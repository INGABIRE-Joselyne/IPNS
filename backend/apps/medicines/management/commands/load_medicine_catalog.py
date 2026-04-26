from django.core.management.base import BaseCommand

from apps.medicines.models import Medicine, MedicineCategory
from apps.medicines.seed_catalog_data import iter_catalog_rows


class Command(BaseCommand):
    help = "Load or update the national medicine catalog (WHO-style essential list + common OTC)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--purge-inactive",
            action="store_true",
            help="Mark medicines not present in the seed file as inactive (does not delete).",
        )

    def handle(self, *args, **options):
        purge = options["purge_inactive"]
        cat_map = {}
        seen_ids = []

        for row in iter_catalog_rows():
            cat_name = row["category"]
            if cat_name not in cat_map:
                c, _ = MedicineCategory.objects.get_or_create(
                    name=cat_name,
                    defaults={"description": ""},
                )
                cat_map[cat_name] = c
            cat = cat_map[cat_name]

            qs = Medicine.objects.filter(
                name=row["name"],
                strength=row["strength"] or "",
                unit=row["unit"] or "tablet",
            )
            obj = qs.first()
            if obj:
                obj.generic_name = row["generic_name"] or obj.generic_name
                obj.manufacturer = row["manufacturer"] or obj.manufacturer
                obj.category = cat
                obj.is_active = True
                obj.save()
                seen_ids.append(obj.id)
                self.stdout.write(f"[*] {row['name']} ({row.get('strength')})")
            else:
                m = Medicine.objects.create(
                    name=row["name"],
                    generic_name=row["generic_name"] or row["name"],
                    strength=row["strength"] or "",
                    unit=row["unit"] or "tablet",
                    manufacturer=row["manufacturer"] or "",
                    category=cat,
                    is_active=True,
                )
                seen_ids.append(m.id)
                self.stdout.write(f"[+] {row['name']} ({row.get('strength')})")

        if purge and seen_ids:
            n = Medicine.objects.exclude(id__in=seen_ids).update(is_active=False)
            self.stdout.write(self.style.WARNING(f"Marked {n} catalog medicines inactive (not in seed)."))

        total = Medicine.objects.filter(is_active=True).count()
        self.stdout.write(self.style.SUCCESS(f"Done. Active medicines in database: {total}"))
