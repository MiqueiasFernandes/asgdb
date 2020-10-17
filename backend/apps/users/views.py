import os
import requests
from uuid import uuid4

from django.contrib.auth import authenticate, login
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

from apps.users.models import User
from apps.users.serializers import UserSerializer, UserWriteSerializer
import time


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserSerializer
        return UserWriteSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data.get('password'))
        user.save()

    def perform_update(self, serializer):
        user = serializer.save()
        if 'password' in self.request.data:
            user.set_password(self.request.data.get('password'))
            user.save()

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

    @action(methods=['GET'], detail=False, permission_classes=[IsAuthenticated])
    def profile(self, request):
        if request.user.is_authenticated:
            serializer = self.serializer_class(request.user)
            return Response(status=status.HTTP_200_OK, data=serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated])
    def profile_update(self, request):

        user = request.user
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', None)
        avatar_changed = request.data.get('avatar_changed', 'false') == 'true'
        if avatar_changed:
            old_avatar = user.avatar.path if user.avatar else None
            user.avatar = request.FILES['avatar'] if 'avatar' in request.FILES else None
            if not old_avatar is None:
                os.remove(old_avatar)
                
        
        user.save()
            
        serializer = self.serializer_class(user)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny])
    def register(self, request):
        last_name = request.data.get('last_name', None)
        first_name = request.data.get('first_name', None)
        email = request.data.get('email', None)
        password = request.data.get('password', None)

        if first_name is None or email is None or password is None:
            return Response({'message': 'Os campos first name, email and password são obrigatorios.'})

        if User.objects.filter(email__iexact=email).exists():
            return Response({'message': 'Este email já está cadastrado.'})

        token = uuid4()

        try:
            params = { 'user': {'name': first_name, 'email': email, 'token': token}, 'DOMAIN': settings.DOMAIN }
            send_mail(
                subject='Criação do usuario no banco de dados',
                message=render_to_string('mail/new_user.txt', params),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
        except:
            return Response({'message': f'Erro ao enviar email para {email}.', 'severity': 'danger'})

        user = User.objects.create_user(
            email=email,
            password=password,
            last_name=last_name,
            first_name=first_name,
            token=token
        )
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED)

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny])
    def password_reset(self, request, format=None):
        if 'email' in request.data and User.objects.filter(email=request.data['email']).exists():
            user = User.objects.get(email=request.data['email'])
            params = {'user': user, 'DOMAIN': settings.DOMAIN}
            send_mail(
                subject='Password reset',
                message=render_to_string('mail/password_reset.txt', params),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.data['email']],
            )
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny])
    def password_change(self, request, format=None):
        if 'token' in request.data and 'password' in  request.data and User.objects.filter(token=request.data['token']).exists():
            user = User.objects.get(token=request.data['token'])
            user.set_password(request.data['password'])
            user.token = uuid4()
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny])
    def activate(self, request, format=None):

        if 'token' in request.data and User.objects.filter(token=request.data['token']).exists():
            user = User.objects.get(token=request.data['token'])
            user.is_active = True
            user.token = uuid4()

            user.save()
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny])
    def login(self, request, format=None):

        email = request.data.get('email', None)
        password = request.data.get('password', None)
        remember = request.data.get('remember', False)

        user = authenticate(username=email, password=password)
        
        if user:
            login(request, user)

            if not remember:
                request.session.set_expiry(0)

            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['POST'], detail=False) ## access restrict to default: `IsAdminUser`
    def setpermissions(self, request):
        for mod, entity, perm in [tuple(p.split()) for p in request.data.get('permissions', '').split(',')]:
            module = importlib.import_module(mod)##'apps.users.models')
            model = getattr(module, entity)##'User')             
            content_type = ContentType.objects.get_for_model(model)
            permission = Permission.objects.create( 
                                                   codename=f'{entity}:{perm}', 
                                                   name=f'{entity}: {perm}', 
                                                   content_type=content_type)
            print('Atribuindo',  permission, ' a ', request.user.email)
            request.user.user_permissions.add(permission)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['GET'], detail=False, permission_classes=[IsAuthenticated])
    def permission(self, request):
        permissions = [p.codename for p in request.user.user_permissions.all()] + ['LOGIN', 'apps.user', 'admin.manage', 'teste', 'apps.gene']
        return Response(status=status.HTTP_200_OK, data={'permissions': permissions})
