from rest_framework import serializers

from django.conf import settings

from apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    registered_at = serializers.DateTimeField(format='%H:%M %d.%m.%Y', read_only=True)
    avatar = serializers.SerializerMethodField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)
    short_name = serializers.SerializerMethodField(read_only=True)
    permissions = serializers.SerializerMethodField(read_only=True)

    def get_avatar(self, obj):
        return obj.avatar.url if obj.avatar else settings.STATIC_URL + 'images/default_avatar.png'

    def get_full_name(self, obj):
        return obj.full_name

    def get_short_name(self, obj):
        return obj.short_name

    def get_permissions(self, obj):
        permissions = ['USER']
        permissions += [f'{x.content_type.app_label}.{x.codename}' for x in obj.user_permissions.all()]
        if obj.is_staff: permissions.append('ADMIN')
        return permissions

    class Meta:
        model = User
        fields = ['email', 'permissions', 'id', 'avatar', 'is_active', 'first_name', 'last_name', 'full_name', 'short_name', 'registered_at']


class UserWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']
