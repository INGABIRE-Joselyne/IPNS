"""
Script to populate the database with common medicines
Run with: python manage.py shell < load_medicines.py
Or: python load_medicines.py if in the apps directory
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.medicines.models import MedicineCategory, Medicine

# Create categories
categories_data = [
    {'name': 'Antibiotics', 'description': 'Medicines to treat bacterial infections'},
    {'name': 'Pain Relievers', 'description': 'Medicines for pain management'},
    {'name': 'Anti-inflammatories', 'description': 'Medicines to reduce inflammation'},
    {'name': 'Antihistamines', 'description': 'Medicines for allergies and itching'},
    {'name': 'Antifungals', 'description': 'Medicines to treat fungal infections'},
    {'name': 'Antivirals', 'description': 'Medicines to treat viral infections'},
    {'name': 'Antacids', 'description': 'Medicines for stomach acid and reflux'},
    {'name': 'Cough & Cold', 'description': 'Medicines for cough and cold symptoms'},
    {'name': 'Cardiovascular', 'description': 'Medicines for heart and blood pressure'},
    {'name': 'Diabetes', 'description': 'Medicines for diabetes management'},
    {'name': 'Vitamins & Supplements', 'description': 'Vitamins and nutritional supplements'},
    {'name': 'Dermatological', 'description': 'Medicines for skin conditions'},
    {'name': 'Gastrointestinal', 'description': 'Medicines for digestive issues'},
    {'name': 'Respiratory', 'description': 'Medicines for respiratory conditions'},
    {'name': 'Antiparasitic', 'description': 'Medicines to treat parasitic infections'},
]

medicines_data = [
    # Antibiotics
    {'name': 'Amoxicillin', 'generic_name': 'Amoxicillin', 'category': 'Antibiotics', 'strength': '500mg', 'unit': 'capsule', 'manufacturer': 'Various'},
    {'name': 'Ciprofloxacin', 'generic_name': 'Ciprofloxacin', 'category': 'Antibiotics', 'strength': '500mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Doxycycline', 'generic_name': 'Doxycycline', 'category': 'Antibiotics', 'strength': '100mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Erythromycin', 'generic_name': 'Erythromycin', 'category': 'Antibiotics', 'strength': '250mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Metronidazole', 'generic_name': 'Metronidazole', 'category': 'Antibiotics', 'strength': '400mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Pain Relievers
    {'name': 'Paracetamol', 'generic_name': 'Acetaminophen', 'category': 'Pain Relievers', 'strength': '500mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Ibuprofen', 'generic_name': 'Ibuprofen', 'category': 'Pain Relievers', 'strength': '200mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Aspirin', 'generic_name': 'Acetylsalicylic Acid', 'category': 'Pain Relievers', 'strength': '100mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Diclofenac', 'generic_name': 'Diclofenac', 'category': 'Pain Relievers', 'strength': '50mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Anti-inflammatories
    {'name': 'Indomethacin', 'generic_name': 'Indomethacin', 'category': 'Anti-inflammatories', 'strength': '25mg', 'unit': 'capsule', 'manufacturer': 'Various'},
    {'name': 'Naproxen', 'generic_name': 'Naproxen', 'category': 'Anti-inflammatories', 'strength': '250mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Antihistamines
    {'name': 'Cetirizine', 'generic_name': 'Cetirizine', 'category': 'Antihistamines', 'strength': '10mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Chlorpheniramine', 'generic_name': 'Chlorpheniramine', 'category': 'Antihistamines', 'strength': '4mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Diphenhydramine', 'generic_name': 'Diphenhydramine', 'category': 'Antihistamines', 'strength': '25mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Antifungals
    {'name': 'Fluconazole', 'generic_name': 'Fluconazole', 'category': 'Antifungals', 'strength': '150mg', 'unit': 'capsule', 'manufacturer': 'Various'},
    {'name': 'Clotrimazole', 'generic_name': 'Clotrimazole', 'category': 'Antifungals', 'strength': '1%', 'unit': 'cream', 'manufacturer': 'Various'},
    {'name': 'Miconazole', 'generic_name': 'Miconazole', 'category': 'Antifungals', 'strength': '2%', 'unit': 'cream', 'manufacturer': 'Various'},
    
    # Antivirals
    {'name': 'Acyclovir', 'generic_name': 'Acyclovir', 'category': 'Antivirals', 'strength': '400mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Oseltamivir', 'generic_name': 'Oseltamivir', 'category': 'Antivirals', 'strength': '75mg', 'unit': 'capsule', 'manufacturer': 'Various'},
    
    # Antacids
    {'name': 'Omeprazole', 'generic_name': 'Omeprazole', 'category': 'Antacids', 'strength': '20mg', 'unit': 'capsule', 'manufacturer': 'Various'},
    {'name': 'Ranitidine', 'generic_name': 'Ranitidine', 'category': 'Antacids', 'strength': '150mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Antacid Suspension', 'generic_name': 'Aluminum Hydroxide', 'category': 'Antacids', 'strength': '300mg/5ml', 'unit': 'ml', 'manufacturer': 'Various'},
    
    # Cough & Cold
    {'name': 'Cough Syrup', 'generic_name': 'Dextromethorphan', 'category': 'Cough & Cold', 'strength': '10mg/5ml', 'unit': 'ml', 'manufacturer': 'Various'},
    {'name': 'Loratadine', 'generic_name': 'Loratadine', 'category': 'Cough & Cold', 'strength': '10mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Phenylephrine', 'generic_name': 'Phenylephrine', 'category': 'Cough & Cold', 'strength': '10mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Cardiovascular
    {'name': 'Atenolol', 'generic_name': 'Atenolol', 'category': 'Cardiovascular', 'strength': '50mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Lisinopril', 'generic_name': 'Lisinopril', 'category': 'Cardiovascular', 'strength': '10mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Amlodipine', 'generic_name': 'Amlodipine', 'category': 'Cardiovascular', 'strength': '5mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Atorvastatin', 'generic_name': 'Atorvastatin', 'category': 'Cardiovascular', 'strength': '20mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Simvastatin', 'generic_name': 'Simvastatin', 'category': 'Cardiovascular', 'strength': '20mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Diabetes
    {'name': 'Metformin', 'generic_name': 'Metformin', 'category': 'Diabetes', 'strength': '500mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Glibenclamide', 'generic_name': 'Glibenclamide', 'category': 'Diabetes', 'strength': '5mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Insulin', 'generic_name': 'Insulin', 'category': 'Diabetes', 'strength': '100 IU/ml', 'unit': 'injection', 'manufacturer': 'Various'},
    
    # Vitamins & Supplements
    {'name': 'Vitamin C', 'generic_name': 'Ascorbic Acid', 'category': 'Vitamins & Supplements', 'strength': '500mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Vitamin D', 'generic_name': 'Cholecalciferol', 'category': 'Vitamins & Supplements', 'strength': '1000 IU', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Vitamin B12', 'generic_name': 'Cyanocobalamin', 'category': 'Vitamins & Supplements', 'strength': '1000mcg', 'unit': 'injection', 'manufacturer': 'Various'},
    {'name': 'Folic Acid', 'generic_name': 'Folic Acid', 'category': 'Vitamins & Supplements', 'strength': '400mcg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Iron Supplement', 'generic_name': 'Ferrous Sulfate', 'category': 'Vitamins & Supplements', 'strength': '325mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Multivitamin', 'generic_name': 'Multivitamin', 'category': 'Vitamins & Supplements', 'strength': 'Mixed', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Dermatological
    {'name': 'Hydrocortisone Cream', 'generic_name': 'Hydrocortisone', 'category': 'Dermatological', 'strength': '1%', 'unit': 'cream', 'manufacturer': 'Various'},
    {'name': 'Sulfur Ointment', 'generic_name': 'Sulfur', 'category': 'Dermatological', 'strength': '5%', 'unit': 'ointment', 'manufacturer': 'Various'},
    {'name': 'Benzoyl Peroxide', 'generic_name': 'Benzoyl Peroxide', 'category': 'Dermatological', 'strength': '5%', 'unit': 'cream', 'manufacturer': 'Various'},
    
    # Gastrointestinal
    {'name': 'Loperamide', 'generic_name': 'Loperamide', 'category': 'Gastrointestinal', 'strength': '2mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Domperidone', 'generic_name': 'Domperidone', 'category': 'Gastrointestinal', 'strength': '10mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Bisacodyl', 'generic_name': 'Bisacodyl', 'category': 'Gastrointestinal', 'strength': '5mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Respiratory
    {'name': 'Salbutamol Inhaler', 'generic_name': 'Salbutamol', 'category': 'Respiratory', 'strength': '100mcg', 'unit': 'inhaler', 'manufacturer': 'Various'},
    {'name': 'Beclomethasone Inhaler', 'generic_name': 'Beclomethasone', 'category': 'Respiratory', 'strength': '50mcg', 'unit': 'inhaler', 'manufacturer': 'Various'},
    {'name': 'Theophylline', 'generic_name': 'Theophylline', 'category': 'Respiratory', 'strength': '100mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    
    # Antiparasitic
    {'name': 'Mebendazole', 'generic_name': 'Mebendazole', 'category': 'Antiparasitic', 'strength': '500mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Albendazole', 'generic_name': 'Albendazole', 'category': 'Antiparasitic', 'strength': '400mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Ivermectin', 'generic_name': 'Ivermectin', 'category': 'Antiparasitic', 'strength': '3mg', 'unit': 'tablet', 'manufacturer': 'Various'},
    {'name': 'Quinine', 'generic_name': 'Quinine', 'category': 'Antiparasitic', 'strength': '300mg', 'unit': 'tablet', 'manufacturer': 'Various'},
]

def load_medicines():
    """Load medicines and categories into the database."""
    print("Loading medicine categories...")
    created_categories = 0
    for cat_data in categories_data:
        category, created = MedicineCategory.objects.get_or_create(**cat_data)
        if created:
            print(f"  ✓ Created: {category.name}")
            created_categories += 1
        else:
            print(f"  - Already exists: {category.name}")
    
    print(f"\nLoaded {created_categories} new categories\n")

    print("Loading medicines...")
    created_medicines = 0
    for med_data in medicines_data:
        # Get or create the category
        category_name = med_data.pop('category')
        category = MedicineCategory.objects.get(name=category_name)
        
        # Create or get the medicine
        medicine, created = Medicine.objects.get_or_create(
            name=med_data['name'],
            generic_name=med_data['generic_name'],
            defaults={
                'category': category,
                'strength': med_data.get('strength'),
                'unit': med_data.get('unit'),
                'manufacturer': med_data.get('manufacturer'),
                'is_active': True,
            }
        )
        
        if created:
            print(f"  ✓ Created: {medicine.name} ({medicine.strength})")
            created_medicines += 1
        else:
            print(f"  - Already exists: {medicine.name}")
    
    print(f"\nLoaded {created_medicines} new medicines")
    print(f"Total medicines in database: {Medicine.objects.count()}")
    print("✅ Medicine data loaded successfully!")

if __name__ == '__main__':
    load_medicines()
