import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.insurance.models import InsuranceProvider

# Rwanda: public schemes, mutuals, and major licensed insurers (BNR-regulated sector).
# Phone numbers: use official lines where known; leave blank otherwise.
insurances = [
    # — Public & institutional schemes —
    {
        'name': 'RSSB Medical Scheme',
        'code': 'RSSB',
        'description': (
            'Rwanda Social Security Board — Medical Scheme (RAMA), CBHI / Mutuelle de Santé '
            'coordination, Ejo Heza, and related social health coverage.'
        ),
        'contact_phone': '+250 788 311 311',
    },
    {
        'name': 'UMR (Union des Mutuelles de Santé)',
        'code': 'UMR',
        'description': (
            'Union des Mutuelles de Santé — community-based health insurance networks '
            'and mutual coverage across Rwanda.'
        ),
        'contact_phone': '+250 252 591 199',
    },
    {
        'name': 'MSUR — University of Rwanda Medical Scheme',
        'code': 'MSUR',
        'description': (
            'Medical Scheme of the University of Rwanda — staff and student health coverage '
            'at affiliated facilities.'
        ),
        'contact_phone': '',
    },
    {
        'name': 'MMI — Military Medical Insurance',
        'code': 'MMI',
        'description': (
            'Military Medical Insurance — coverage for RDF members and eligible dependents '
            '(e.g. Rwanda Military Hospital and partner providers).'
        ),
        'contact_phone': '',
    },
    {
        'name': 'Ubwiyunge Mutual',
        'code': 'UBWIYUNGE',
        'description': 'Ubwiyunge — community mutual health insurance organization.',
        'contact_phone': '',
    },
    # — Commercial insurers (Rwanda market) —
    {
        'name': 'Sanlam Rwanda',
        'code': 'SANLAM',
        'description': 'Sanlam — life, health, and general insurance in Rwanda.',
        'contact_phone': '+250 788 400 400',
    },
    {
        'name': 'Sonarwa General Insurance',
        'code': 'SONARWA',
        'description': 'Sonarwa — general and medical insurance products.',
        'contact_phone': '+250 788 120 200',
    },
    {
        'name': 'Britam Insurance Rwanda',
        'code': 'BRITAM',
        'description': 'Britam — health, life, and general insurance.',
        'contact_phone': '+250 788 190 000',
    },
    {
        'name': 'AAR Insurance Rwanda',
        'code': 'AAR',
        'description': 'AAR Insurance — health, motor, and general insurance.',
        'contact_phone': '+250 788 230 230',
    },
    {
        'name': 'Crystal Assurance',
        'code': 'CRYSTAL',
        'description': 'Crystal Assurance — health and general insurance.',
        'contact_phone': '',
    },
    {
        'name': 'Prime Insurance Ltd',
        'code': 'PRIME',
        'description': 'Prime Insurance — general and health-related insurance products.',
        'contact_phone': '',
    },
    {
        'name': 'Radiant Insurance',
        'code': 'RADIANT',
        'description': 'Radiant Insurance — general insurance including medical cover options.',
        'contact_phone': '',
    },
    {
        'name': 'Jubilee Insurance Rwanda',
        'code': 'JUBILEE',
        'description': 'Jubilee Allianz General Insurance — health and general lines.',
        'contact_phone': '',
    },
    {
        'name': 'Phoenix of East Africa Insurance',
        'code': 'PHOENIX',
        'description': 'Phoenix of East Africa — general and health insurance.',
        'contact_phone': '',
    },
    {
        'name': 'Mayale Insurance',
        'code': 'MAYALE',
        'description': 'Mayale Insurance — general insurance (including medical cover).',
        'contact_phone': '',
    },
    {
        'name': 'UAP Old Mutual Rwanda',
        'code': 'UAP',
        'description': 'UAP Old Mutual — general and health insurance.',
        'contact_phone': '',
    },
    {
        'name': 'Saham Assurance Rwanda',
        'code': 'SAHAM',
        'description': 'Saham Assurance — general insurance products available in Rwanda.',
        'contact_phone': '',
    },
    {
        'name': 'CORAR Rwanda',
        'code': 'CORAR',
        'description': 'CORAR — cooperative and general insurance services.',
        'contact_phone': '',
    },
    {
        'name': 'Allianz Rwanda',
        'code': 'ALLIANZ',
        'description': 'Allianz — international and local general insurance (incl. medical riders).',
        'contact_phone': '',
    },
    {
        'name': 'MUA Insurance',
        'code': 'MUA',
        'description': 'MUA — mutual assurance and general insurance in the East Africa region.',
        'contact_phone': '',
    },
]

created_count = 0
updated_count = 0
for insurance in insurances:
    obj, created = InsuranceProvider.objects.update_or_create(
        code=insurance['code'],
        defaults={
            'name': insurance['name'],
            'description': insurance.get('description', ''),
            'contact_phone': insurance.get('contact_phone', '') or '',
        },
    )
    if created:
        created_count += 1
        print(f"[+] Created: {insurance['name']}")
    else:
        updated_count += 1
        print(f"[*] Updated: {insurance['name']}")

print(f"\nCreated: {created_count}  |  Updated: {updated_count}")
print("\nAll insurance providers:")
for ins in InsuranceProvider.objects.all().order_by('name'):
    print(f"  {ins.id}. {ins.name} ({ins.code})")
