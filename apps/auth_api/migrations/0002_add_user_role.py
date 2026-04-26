# Generated migration to add role field to User model

from django.db import migrations
from django.contrib.auth.models import User


def add_role_to_users(apps, schema_editor):
    """Add default role to existing users."""
    User = apps.get_model('auth', 'User')
    for user in User.objects.all():
        user.profile_role = 'pharmacist'
        user.save()


def reverse_add_role(apps, schema_editor):
    """Reverse: remove role from users."""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('auth_api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_role_to_users, reverse_add_role),
    ]
