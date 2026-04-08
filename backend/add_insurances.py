import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.insurance.models import InsuranceProvider

# Rwanda's major insurance providers
insurances = [
    {
        'name': 'RSSB',
        'code': 'RSSB',
        'description': 'Rwanda Social Security Board - Government health insurance and pension scheme',
        'contact_phone': '+250 788 311 311'
    },
    {
        'name': 'UMR',
        'code': 'UMR',
        'description': 'Union des Mutuelles de Santé - Community-based health insurance',
        'contact_phone': '+250 252 591 199'
    },
    {
        'name': 'Sanlam Rwanda',
        'code': 'SANLAM',
        'description': 'Sanlam - Life and health insurance provider',
        'contact_phone': '+250 788 400 400'
    },
    {
        'name': 'AAR Insurance',
        'code': 'AAR',
        'description': 'AAR Insurance Rwanda - General and health insurance',
        'contact_phone': '+250 788 123 456'
    },
    {
        'name': 'Britam',
        'code': 'BRITAM',
        'description': 'Britam Insurance - Health and life insurance',
        'contact_phone': '+250 788 500 500'
    },
    {
        'name': 'Ubwiyunge',
        'code': 'UBWIYUNGE',
        'description': 'Ubwiyunge - Community mutual health insurance organization',
        'contact_phone': '+250 788 234 567'
    },
    {
        'name': 'Crystal Assurance',
        'code': 'CRYSTAL',
        'description': 'Crystal Assurance - Health and medical insurance',
        'contact_phone': '+250 788 600 600'
    },
    {
        'name': 'Sonarwa',
        'code': 'SONARWA',
        'description': 'Sonarwa Insurance Company - General insurance provider',
        'contact_phone': '+250 788 222 222'
    }
]

# Create insurances
created_count = 0
for insurance in insurances:
    obj, created = InsuranceProvider.objects.get_or_create(
        code=insurance['code'],
        defaults={
            'name': insurance['name'],
            'description': insurance.get('description', ''),
            'contact_phone': insurance.get('contact_phone', '')
        }
    )
    if created:
        created_count += 1
        print(f"✓ Created: {insurance['name']}")
    else:
        print(f"- Already exists: {insurance['name']}")

print(f"\nTotal created: {created_count}")
print("\nAll insurance providers:")
for ins in InsuranceProvider.objects.all():
    print(f"  {ins.id}. {ins.name} ({ins.code}) - {ins.description}")

