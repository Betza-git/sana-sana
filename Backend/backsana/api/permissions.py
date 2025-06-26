from rest_framework.permissions import BasePermission

class IsAdminUserRole(BasePermission):
    """
    Permite acceso solo a usuarios autenticados con rol 'admin'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol == 'admin')

