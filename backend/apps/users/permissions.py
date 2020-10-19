from rest_framework.permissions import BasePermission

class ListPermision(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user:
            user_permissions = [p.codename for p in user.user_permissions.all()]
            permission = f'{view.queryset.model.__name__}.{view.action}'
            has_permision = permission in user_permissions
            if has_permision:
                return True
            print('PERM:', permission, ' not in ', user_permissions)
        return False