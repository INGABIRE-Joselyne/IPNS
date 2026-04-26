from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.common.models import UserProfile


class Command(BaseCommand):
    help = (
        'Create a new user with admin access to the IPNS API / SPA, or promote an existing user '
        '(sets UserProfile.role=admin). Django superuser is separate — see command output.'
    )

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Login email (also used as username)')
        parser.add_argument(
            'password',
            nargs='?',
            default=None,
            help='Password (required only when creating a new user)',
        )

    def handle(self, *args, **options):
        email = options['email'].strip().lower()
        password = options['password']

        user = User.objects.filter(username=email).first() or User.objects.filter(email=email).first()

        if user is None:
            if not password:
                self.stderr.write(
                    self.style.ERROR('Password is required when creating a new user. Example: create_admin admin@x.com MySecret123')
                )
                return
            user = User.objects.create_user(username=email, email=email, password=password)
            UserProfile.objects.update_or_create(user=user, defaults={'role': 'admin'})
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {email}'))
            return

        UserProfile.objects.update_or_create(user=user, defaults={'role': 'admin'})
        if user.username != email:
            user.username = email
        if user.email != email:
            user.email = email
        if password:
            user.set_password(password)
        user.save()
        if password:
            self.stdout.write(self.style.SUCCESS(f'Promoted to admin and password updated: {email}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Promoted to admin (password unchanged): {email}'))
