"""
Load the national medicine catalog into the database (same as: python manage.py load_medicine_catalog).
Run from the backend folder: python load_medicine_catalog.py
"""
import os
import sys
import django

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    from django.core.management import call_command
    call_command('load_medicine_catalog', *sys.argv[1:])
