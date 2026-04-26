from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Allow access only to users with profile.role == 'admin'."""

    message = 'Admin role required.'

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        try:
            return user.profile.role == 'admin'
        except Exception:
            return False
