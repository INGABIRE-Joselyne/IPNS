# Pipe-delimited: name|generic_name|strength|unit|manufacturer|category
# Empty manufacturer is allowed. Categories are created automatically.
CATALOG_LINES = """
Paracetamol|Acetaminophen|500mg|tablet||Analgesics & Antipyretics
Paracetamol|Acetaminophen|250mg|tablet||Analgesics & Antipyretics
Paracetamol suspension|Acetaminophen|120mg/5ml|ml||Analgesics & Antipyretics
Ibuprofen|Ibuprofen|400mg|tablet||Analgesics & Antipyretics
Ibuprofen|Ibuprofen|200mg|tablet||Analgesics & Antipyretics
Aspirin|Acetylsalicylic acid|300mg|tablet||Analgesics & Antipyretics
Diclofenac|Diclofenac sodium|50mg|tablet||Analgesics & Antipyretics
Diclofenac gel|Diclofenac|1%|cream||Analgesics & Antipyretics
Naproxen|Naproxen|500mg|tablet||Analgesics & Antipyretics
Tramadol|Tramadol HCl|50mg|capsule||Analgesics & Antipyretics
Morphine sulfate|Morphine|10mg|tablet||Analgesics & Antipyretics
Codeine/Paracetamol|Codeine + Paracetamol|30/500mg|tablet||Analgesics & Antipyretics
Amoxicillin|Amoxicillin|500mg|capsule||Antibiotics
Amoxicillin suspension|Amoxicillin|250mg/5ml|ml||Antibiotics
Amoxicillin/Clavulanate|Amoxicillin + Clavulanic acid|625mg|tablet||Antibiotics
Ampicillin|Ampicillin|500mg|capsule||Antibiotics
Azithromycin|Azithromycin|500mg|tablet||Antibiotics
Azithromycin suspension|Azithromycin|200mg/5ml|ml||Antibiotics
Ciprofloxacin|Ciprofloxacin|500mg|tablet||Antibiotics
Ciprofloxacin drops|Ciprofloxacin|0.3%|drops||Antibiotics
Clarithromycin|Clarithromycin|500mg|tablet||Antibiotics
Doxycycline|Doxycycline|100mg|capsule||Antibiotics
Erythromycin|Erythromycin|500mg|tablet||Antibiotics
Metronidazole|Metronidazole|400mg|tablet||Antibiotics
Metronidazole gel|Metronidazole|0.75%|cream||Antibiotics
Nitrofurantoin|Nitrofurantoin|100mg|capsule||Antibiotics
Cephalexin|Cefalexin|500mg|capsule||Antibiotics
Ceftriaxone injection|Ceftriaxone|1g|injection||Antibiotics
Benzathine penicillin|Penicillin G benzathine|1.2MU|injection||Antibiotics
Flucloxacillin|Flucloxacillin|500mg|capsule||Antibiotics
Co-trimoxazole|Sulfamethoxazole + Trimethoprim|480mg|tablet||Antibiotics
Gentamicin injection|Gentamicin|80mg|injection||Antibiotics
Chloramphenicol drops|Chloramphenicol|0.5%|drops||Antibiotics
Artemether/Lumefantrine|Artemether + Lumefantrine|20/120mg|tablet||Antimalarials
Artesunate|Artesunate|50mg|tablet||Antimalarials
Artesunate injection|Artesunate|60mg|injection||Antimalarials
Quinine|Quinine sulfate|300mg|tablet||Antimalarials
Quinine injection|Quinine|300mg|injection||Antimalarials
Primaquine|Primaquine|15mg|tablet||Antimalarials
Sulfadoxine/Pyrimethamine|Sulfadoxine + Pyrimethamine|500/25mg|tablet||Antimalarials
Fluconazole|Fluconazole|150mg|capsule||Antifungals
Fluconazole|Fluconazole|200mg|capsule||Antifungals
Itraconazole|Itraconazole|100mg|capsule||Antifungals
Ketoconazole cream|Ketoconazole|2%|cream||Antifungals
Clotrimazole cream|Clotrimazole|1%|cream||Antifungals
Miconazole|Miconazole|2%|cream||Antifungals
Nystatin oral|Nystatin|500000 IU|tablet||Antifungals
Griseofulvin|Griseofulvin|500mg|tablet||Antifungals
Omeprazole|Omeprazole|20mg|capsule||Gastrointestinal
Omeprazole|Omeprazole|40mg|capsule||Gastrointestinal
Pantoprazole|Pantoprazole|40mg|tablet||Gastrointestinal
Esomeprazole|Esomeprazole|40mg|capsule||Gastrointestinal
Ranitidine|Ranitidine|150mg|tablet||Gastrointestinal
Famotidine|Famotidine|20mg|tablet||Gastrointestinal
Aluminum hydroxide/Mg hydroxide|Antacid compound||suspension||Gastrointestinal
Oral rehydration salts|ORS formula||sachet||Gastrointestinal
Loperamide|Loperamide|2mg|capsule||Gastrointestinal
Bisacodyl|Bisacodyl|5mg|tablet||Gastrointestinal
Senna|Senna extract|7.5mg|tablet||Gastrointestinal
Lactulose|Lactulose|10g/15ml|ml||Gastrointestinal
Metoclopramide|Metoclopramide|10mg|tablet||Gastrointestinal
Ondansetron|Ondansetron|4mg|tablet||Gastrointestinal
Simethicone|Simethicone|40mg|capsule||Gastrointestinal
Amlodipine|Amlodipine|5mg|tablet||Cardiovascular
Amlodipine|Amlodipine|10mg|tablet||Cardiovascular
Atenolol|Atenolol|50mg|tablet||Cardiovascular
Bisoprolol|Bisoprolol|5mg|tablet||Cardiovascular
Carvedilol|Carvedilol|12.5mg|tablet||Cardiovascular
Enalapril|Enalapril|10mg|tablet||Cardiovascular
Lisinopril|Lisinopril|10mg|tablet||Cardiovascular
Losartan|Losartan|50mg|tablet||Cardiovascular
Losartan|Losartan|100mg|tablet||Cardiovascular
Hydrochlorothiazide|Hydrochlorothiazide|25mg|tablet||Cardiovascular
Furosemide|Furosemide|40mg|tablet||Cardiovascular
Spironolactone|Spironolactone|25mg|tablet||Cardiovascular
Simvastatin|Simvastatin|20mg|tablet||Cardiovascular
Atorvastatin|Atorvastatin|20mg|tablet||Cardiovascular
Aspirin low dose|Acetylsalicylic acid|75mg|tablet||Cardiovascular
Clopidogrel|Clopidogrel|75mg|tablet||Cardiovascular
Warfarin|Warfarin|5mg|tablet||Cardiovascular
Digoxin|Digoxin|0.25mg|tablet||Cardiovascular
Glyceryl trinitrate|Nitroglycerin|0.5mg|tablet||Cardiovascular
Metformin|Metformin|500mg|tablet||Diabetes
Metformin|Metformin|850mg|tablet||Diabetes
Metformin XR|Metformin|1000mg|tablet||Diabetes
Glibenclamide|Glibenclamide|5mg|tablet||Diabetes
Gliclazide|Gliclazide|80mg|tablet||Diabetes
Glimepiride|Glimepiride|2mg|tablet||Diabetes
Insulin human NPH|Human insulin|100IU/ml|injection||Diabetes
Insulin human regular|Human insulin|100IU/ml|injection||Diabetes
Insulin glargine|Insulin glargine|100IU/ml|injection||Diabetes
Sitagliptin|Sitagliptin|100mg|tablet||Diabetes
Empagliflozin|Empagliflozin|10mg|tablet||Diabetes
Salbutamol inhaler|Salbutamol|100mcg/dose|inhaler||Respiratory
Salbutamol nebules|Salbutamol|2.5mg/2.5ml|ml||Respiratory
Beclometasone inhaler|Beclometasone|200mcg/dose|inhaler||Respiratory
Budesonide inhaler|Budesonide|200mcg/dose|inhaler||Respiratory
Fluticasone/Salmeterol|Fluticasone + Salmeterol|250/50mcg|inhaler||Respiratory
Montelukast|Montelukast|10mg|tablet||Respiratory
Theophylline|Theophylline|200mg|tablet||Respiratory
Prednisolone|Prednisolone|5mg|tablet||Respiratory
Prednisolone|Prednisolone|20mg|tablet||Respiratory
Ambroxol|Ambroxol|30mg|tablet||Respiratory
Guaifenesin|Guaifenesin|200mg|tablet||Respiratory
Vitamin C|Ascorbic acid|500mg|tablet||Vitamins & Minerals
Vitamin B complex|B vitamins||tablet||Vitamins & Minerals
Vitamin B12|Cyanocobalamin|1000mcg|tablet||Vitamins & Minerals
Folic acid|Folic acid|5mg|tablet||Vitamins & Minerals
Iron sulfate|Ferrous sulfate|200mg|tablet||Vitamins & Minerals
Zinc sulfate|Zinc sulfate|20mg|tablet||Vitamins & Minerals
Calcium + Vitamin D|Calcium carbonate + Cholecalciferol||tablet||Vitamins & Minerals
Multivitamin children|Multivitamin||syrup||Vitamins & Minerals
Hydrocortisone cream|Hydrocortisone|1%|cream||Dermatology
Betamethasone cream|Betamethasone|0.1%|cream||Dermatology
Clobetasol cream|Clobetasol|0.05%|cream||Dermatology
Permethrin cream|Permethrin|5%|cream||Dermatology
Benzyl benzoate lotion|Benzyl benzoate|25%|lotion||Dermatology
Calamine lotion|Calamine||lotion||Dermatology
Salicylic acid ointment|Salicylic acid|2%|ointment||Dermatology
Acyclovir cream|Acyclovir|5%|cream||Dermatology
Tretinoin cream|Tretinoin|0.05%|cream||Dermatology
Chloramphenicol eye drops|Chloramphenicol|0.5%|drops||Ophthalmology
Tobramycin eye drops|Tobramycin|0.3%|drops||Ophthalmology
Artificial tears|Hypromellose||drops||Ophthalmology
Timolol eye drops|Timolol|0.5%|drops||Ophthalmology
Acyclovir|Acyclovir|400mg|tablet||Antivirals
Acyclovir|Acyclovir|200mg|tablet||Antivirals
Valacyclovir|Valacyclovir|500mg|tablet||Antivirals
Oseltamivir|Oseltamivir|75mg|capsule||Antivirals
Tenofovir/Emtricitabine|TDF + FTC|300/200mg|tablet||Antivirals
Efavirenz|Efavirenz|600mg|tablet||Antivirals
Levothyroxine|Levothyroxine|100mcg|tablet||Hormones & Endocrine
Levothyroxine|Levothyroxine|50mcg|tablet||Hormones & Endocrine
Prednisolone (endocrine)|Prednisolone|5mg|tablet||Hormones & Endocrine
Combined oral contraceptive|Ethinylestradiol + Levonorgestrel||tablet||Contraception & Women's Health
Levonorgestrel EC|Levonorgestrel|1.5mg|tablet||Contraception & Women's Health
Medroxyprogesterone injection|Medroxyprogesterone|150mg|injection||Contraception & Women's Health
Ferrous folate pregnancy|Iron + Folic acid||tablet||Contraception & Women's Health
Oxytocin injection|Oxytocin|10IU|injection||Contraception & Women's Health
Misoprostol|Misoprostol|200mcg|tablet||Contraception & Women's Health
Cetirizine|Cetirizine|10mg|tablet||Antihistamines & Allergy
Loratadine|Loratadine|10mg|tablet||Antihistamines & Allergy
Chlorpheniramine|Chlorpheniramine|4mg|tablet||Antihistamines & Allergy
Dexamethasone injection|Dexamethasone|4mg|injection||Antihistamines & Allergy
Adrenaline injection|Epinephrine|1mg/ml|injection||Antihistamines & Allergy
Hydrocortisone injection|Hydrocortisone|100mg|injection||Antihistamines & Allergy
Albendazole|Albendazole|400mg|tablet||Anthelmintics & Antiprotozoal
Mebendazole|Mebendazole|100mg|tablet||Anthelmintics & Antiprotozoal
Praziquantel|Praziquantel|600mg|tablet||Anthelmintics & Antiprotozoal
Tinidazole|Tinidazole|500mg|tablet||Anthelmintics & Antiprotozoal
Metronidazole (protozoa)|Metronidazole|400mg|tablet||Anthelmintics & Antiprotozoal
Dextrose 5% infusion|Glucose 5%|500ml|infusion||Fluids & Electrolytes
Normal saline 0.9%|Sodium chloride 0.9%|500ml|infusion||Fluids & Electrolytes
Ringers lactate|Compound electrolyte|500ml|infusion||Fluids & Electrolytes
Potassium chloride oral|Potassium chloride|600mg|tablet||Fluids & Electrolytes
Zinc ORS tablets|Zinc supplement|20mg|tablet||Fluids & Electrolytes
Amitriptyline|Amitriptyline|25mg|tablet||Mental Health
Fluoxetine|Fluoxetine|20mg|capsule||Mental Health
Sertraline|Sertraline|50mg|tablet||Mental Health
Diazepam|Diazepam|5mg|tablet||Mental Health
Lorazepam|Lorazepam|1mg|tablet||Mental Health
Haloperidol|Haloperidol|5mg|tablet||Mental Health
Risperidone|Risperidone|2mg|tablet||Mental Health
Carbamazepine|Carbamazepine|200mg|tablet||Mental Health
Sodium valproate|Valproate|200mg|tablet||Mental Health
Phenytoin|Phenytoin|100mg|capsule||Mental Health
Benzhexol|Trihexyphenidyl|2mg|tablet||Mental Health
Hyoscine butylbromide|Hyoscine-N-butylbromide|10mg|tablet||Other
Atropine injection|Atropine sulfate|0.6mg|injection||Other
Lidocaine injection|Lidocaine|2%|injection||Other
Ceftazidime injection|Ceftazidime|1g|injection||Antibiotics
Meropenem injection|Meropenem|1g|injection||Antibiotics
Vancomycin injection|Vancomycin|1g|injection||Antibiotics
Silver sulfadiazine cream|Silver sulfadiazine|1%|cream||Dermatology
Tetracycline eye ointment|Tetracycline|1%|ointment||Ophthalmology
Permethrin shampoo|Permethrin|1%|lotion||Dermatology
Magnesium sulfate injection|Magnesium sulfate|50%|injection||Other
Calcium gluconate injection|Calcium gluconate|10%|injection||Other
Heparin injection|Heparin|5000 IU|injection||Cardiovascular
Enoxaparin injection|Enoxaparin|40mg|injection||Cardiovascular
Insulin sliding scale mix|70/30 insulin|100IU/ml|injection||Diabetes
Clindamycin|Clindamycin|300mg|capsule||Antibiotics
Linezolid|Linezolid|600mg|tablet||Antibiotics
Piperacillin/Tazobactam injection|Pip-tazo|4.5g|injection||Antibiotics
"""


def iter_catalog_rows():
    for line in CATALOG_LINES.strip().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("|")
        if len(parts) != 6:
            continue
        name, generic, strength, unit, mfr, category = [p.strip() for p in parts]
        yield {
            "name": name,
            "generic_name": generic or name,
            "strength": strength or "",
            "unit": unit or "tablet",
            "manufacturer": mfr or "",
            "category": category,
        }
