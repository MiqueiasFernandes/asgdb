import copy
from rest_framework import permissions

# https://www.django-rest-framework.org/api-guide/permissions/#djangomodelpermissions
# POST requests require the user to have the add permission on the model.
# PUT and PATCH requests require the user to have the change permission on the model.
# DELETE requests require the user to have the delete permission on the model.
class CustomDjangoModelPermission(permissions.DjangoModelPermissions):

    def __init__(self):
        self.perms_map = copy.deepcopy(self.perms_map)
        self.perms_map['GET'] = ['%(app_label)s.view_%(model_name)s']
        self.perms_map['HEAD'] = ['%(app_label)s.view_%(model_name)s']


# from rest_framework.permissions import BasePermission
# class ListPermision(BasePermission):
#     def has_permission(self, request, view):
#         user = request.user
#         if user:
#             user_permissions = [p.codename for p in user.user_permissions.all()]
#             permission = f'{view.queryset.model.__name__}.{view.action}'
#             has_permision = permission in user_permissions
#             if has_permision:
#                 return True
#             print('PERM:', permission, ' not in ', user_permissions)
#         return False

