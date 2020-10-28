import os
import requests
from uuid import uuid4

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import Permission
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser

from apps.users.models import User
from apps.users.serializers import UserSerializer, UserWriteSerializer
from apps.users.permissions import CustomDjangoModelPermission

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser&CustomDjangoModelPermission]

    ## Filter: https://www.django-rest-framework.org/api-guide/filtering/
    ##         https://github.com/miki725/django-url-filter

    ## field filter       : ?category=clothing&in_stock=True
    filter_fields = ['id', 'is_active', 'is_staff', 'email', 'registered_at', 'first_name', 'last_name']  
    
    ## full fields search : ?search=russell  <= text only
    search_fields = ['id', 'email', 'first_name', 'last_name', 'registered_at'] 

    ## ordering           : ?ordering=account,-username
    ordering = ['-id'] 
    ordering_fields = ['id', 'is_active', 'email', 'registered_at', 'is_staff']  

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

    @action(methods=['GET'], detail=False, permission_classes=[AllowAny])
    def profile(self, request):
        if request.user.is_authenticated:
            serializer = self.serializer_class(request.user)
            return Response(status=status.HTTP_200_OK, data={'profile': serializer.data, 'is_authenticated': True})
        return Response(data={'is_authenticated': False})

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
        
        is_active = request.data.get('is_active', False)
        is_staff = request.data.get('is_staff', False)
        is_admin = request.user and request.user.is_staff

        if first_name is None or email is None or password is None:
            return Response({'message': 'Os campos first name, email and password são obrigatorios.'})

        if User.objects.filter(email__iexact=email).exists():
            return Response({'message': 'Este email já está cadastrado.'})

        token = uuid4()

        try: ## FIX nameserver: smtp.gmail.com 172.217.192.108 
             ## echo 172.217.192.108   smtp.gmail.com >> /etc/hosts
            params = { 
                'user': {
                    'name': first_name, 
                    'email': email, 
                    'token': token
                    }, 
                'DOMAIN': settings.DOMAIN 
                }
            send_mail(
                subject='Criação do usuario no banco de dados',
                message=render_to_string('mail/new_user.txt', params),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
        except Exception as e:
            return Response({'message': f'Erro ao enviar email para {email}. {e}', 'severity': 'danger'})

        user = User.objects.create_user(
            email=email,
            password=password,
            last_name=last_name,
            first_name=first_name,
            token=token,
            is_active=is_admin and is_active,
            is_staff=(is_admin and is_staff) or (email in [a[1] for a in settings.ADMINS]),
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
            user.is_active = True
            user.is_staff = user.email in [a[1] for a in settings.ADMINS]
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
        remove = request.data.get('remove', False)

        user = User.objects.filter(email__iexact=email)

        if user.exists():
            user = user[0]

            if user and not user.is_active:
                return Response(data={'error': 1, 'message': 'Usuario inativo.'})

            user = authenticate(username=email, password=password)

            if user:
                login(request, user)

                if not remember:
                    request.session.set_expiry(0)
                    if remove and not self.remove_user(user):
                        Response(status=status.HTTP_404_NOT_FOUND)

                serializer = self.serializer_class(user)
                return Response(data={ 'profile': serializer.data, 'is_authenticated': True})

        return Response(data={'error': 2, 'message': 'Usuario ou senha incorreto.'})

    @action(methods=['PUT'], detail=False)
    def setpermissions(self, request):

        user_id = request.data.get('id', None)
        if user_id:
            user = User.objects.filter(id=user_id)
            if user.exists():
                user = user[0]

                permissions = set()
                perms = []
                ps = [tuple(p.split()) for p in request.data.get('permissions', '').split(',') if p.count(' ') == 2]
                for app, mode, entity in ps:
                    permission = Permission.objects.filter(content_type__app_label=app, codename=f"{mode}_{entity}")
                    perm_str = f'{app}.{mode}_{entity}'
                    
                    if permission.exists():
                        permissions.add(permission[0])
                        perms.append(perm_str)
                    else:
                        return Response(data={ 'error': f'Permission {perm_str} desconhecida.'})
                
                try:
                    user.user_permissions.set(permissions)
                    return Response(data={ 'permissions': perms})
                except Exception as e:
                    return Response(data={ 'error': f'Unknown error: {e}.'})
            
            ## if not user.exists()
            return Response(data={ 'error': f'Usuario id: {user_id} desconhecido.'})
        
        ## not if user_id
        return Response(data={ 'error': 'O id deve ser fornecido.'})

    def remove_user(self, user):
        print('INACTIVED USER', user, user.email)
        try:
            if user.avatar:
                os.remove(user.avatar.path)
            ## user.delete()
            user.is_active = False
            user.save()
            return True
        except:
            return False

    @action(methods=['GET'], detail=False)
    def count(self, request):
        cont = User.objects.filter(is_active=True).count()
        return Response({'active': cont})

    @action(methods=['PUT'], detail=False)
    def profile_update_partial(self, request):

        user_id = request.data.get('id', None)
        if user_id:
            user = User.objects.filter(id=user_id)

            if user.exists():
                user = user[0]
                user.is_active = request.data.get('is_active', user.is_active)
                user.is_staff = request.data.get('is_staff', user.is_staff)
                user.first_name = request.data.get('first_name', user.first_name)
                user.last_name = request.data.get('last_name', user.last_name)
                user.email = request.data.get('email', user.email)
                user.save()
                serializer = self.serializer_class(user)
                return Response(status=status.HTTP_200_OK, data=serializer.data)

            ## if not user.exists()
            return Response(data={ 'error': f'Usuario id: {user_id} desconhecido.'})
        
        ## not if user_id
        return Response(data={ 'error': 'O id deve ser fornecido.'})

    def destroy(self, request, pk=None, **kwargs):
        user_id = pk

        if user_id:
            user = User.objects.filter(id=user_id)

            if user.exists():
                user = user[0]
                
                if self.remove_user(user):
                    user.delete()
                    print('REMOVED USER', user.id, user.email)
                    return Response(status=204)

                return Response(data={ 'error': f'Falhou ao remover dados do usuario {user_id}.'})

            ## if not user.exists()
            return Response(data={ 'error': f'Usuario id: {user_id} desconhecido.'})
        
        ## not if user_id
        return Response(data={ 'error': 'O id deve ser fornecido.'})



from django.shortcuts import render     

def users(request):
    users = User.objects.all()
    context = {'users': users, 'users_size': len(users)}
    return render(request, 'users.html', context)

