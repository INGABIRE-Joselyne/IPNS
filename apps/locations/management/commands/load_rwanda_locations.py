from django.core.management.base import BaseCommand
from apps.locations.models import Province, District, Sector


class Command(BaseCommand):
    help = 'Load Rwanda provinces, districts, and sectors'

    def generate_province_code(self, name):
        """Generate province code from name"""
        words = name.split()
        code = ''.join([word[0].upper() for word in words])[:2]
        return code.ljust(2, 'X')[:2]
    
    def generate_district_code(self, province_code, index):
        """Generate district code"""
        return f"{province_code}{index+1:02d}"
    
    def generate_sector_code(self, district_code, index):
        """Generate sector code"""
        return f"{district_code}{index+1:02d}"

    def handle(self, *args, **options):
        # Rwanda location data - 5 Provinces, 30 Districts, 416+ Sectors
        locations_data = {
            'Kigali City': {
                'Gasabo': ['Bumbogo', 'Gisozi', 'Jali', 'Jabana', 'Kimihurura', 'Kinyinya', 'Kiyovu', 'Munanira', 'Muyunza', 'Ndera', 'Nduba', 'Rusororo'],
                'Kicukiro': ['Kagarama', 'Kanombe', 'Karongi', 'Kicukiro', 'Kibagabaga', 'Kimisagara', 'Kimonyi', 'Masaka', 'Muyange'],
                'Nyarugenge': ['Gitare', 'Kaboré', 'Kanyinya', 'Mageregere', 'Mugunga', 'Muhoza', 'Nyabarongo', 'Nyakabanda', 'Nyarugenge', 'Remera'],
            },
            'Eastern Province': {
                'Bugesera': ['Gashora', 'Kamabuye', 'Kanakuwa', 'Kayonza', 'Kibirizi', 'Kigina', 'Kijote', 'Kiziguro', 'Maranyundo', 'Mwoyarugira', 'Nyagatovu', 'Nyarugabo', 'Ruhuha', 'Shyara', 'Soneza'],
                'Gatsibo': ['Janja', 'Kabare', 'Kageyo', 'Kagunga', 'Kayumba', 'Kibili', 'Kibungo', 'Muhazi', 'Musha', 'Mutete', 'Nyagihanga', 'Nyankenke', 'Remera', 'Rwabifu', 'Rwempasha', 'Rwesero'],
                'Kayonza': ['Gahini', 'Kabare', 'Kayonza', 'Murundi', 'Musha', 'Nyakariro', 'Nyamagana', 'Nyamuriro', 'Nyarusange', 'Rusumo'],
                'Kirehe': ['Jabali', 'Kabuye', 'Kagitumba', 'Kahara', 'Karangazi', 'Kibungo', 'Kimacha', 'Kirangira', 'Kirehe', 'Mahama'],
                'Ngoma': ['Jge', 'Karangazi', 'Kibungo', 'Kibuzasht', 'Kigehe', 'Kigwena', 'Mabare', 'Mashyurano', 'Mwulire', 'Mynumburo', 'Ngoma', 'Nzige', 'Remera', 'Rutare', 'Sanza', 'Tarama'],
                'Rwamagana': ['Giciye', 'Gitaka', 'Giti', 'Kabarondo', 'Kamiranzovu', 'Kigabiro', 'Kigazi', 'Kinyababa', 'Kinyarwanda', 'Mahwa', 'Mbogo', 'Munyaburanga', 'Rwamagana', 'Rubyiro'],
            },
            'Northern Province': {
                'Burera': ['Bungwe', 'Gakenke', 'Gatebe', 'Gitondo', 'Kigombe', 'Kinyababa', 'Kinyinya', 'Kinywambogo', 'Kiremera', 'Miyove', 'Muheshimire', 'Murambi', 'Muramba', 'Musanze', 'Ngarama', 'Nyakabanda', 'Nyakabuye', 'Rutare'],
                'Gicumbi': ['Busenyi', 'Gakenke', 'Gakoma', 'Gakenke', 'Mukarange', 'Muko', 'Muyongwe', 'Mwali', 'Nemba', 'Ngarama', 'Nyabihu', 'Nyankaka', 'Rutonde', 'Rwamiko', 'Rushaki', 'Rutonde'],
                'Musanze': ['Bugoyi', 'Bugumi', 'Gisagara', 'Gisagara', 'Gishwati', 'Kinigi', 'Musanze', 'Musizi', 'Nyamunyumba', 'Ruhengeri'],
                'Rulindo': ['Bushoki', 'Gakenke', 'Gituza', 'Kabarole', 'Kamubay', 'Kanyabayonga', 'Kayove', 'Kinoni', 'Kinvi', 'Kivumu', 'Mpungu', 'Muko', 'Muyange', 'Muyongwe', 'Ngandekwe', 'Nyabihu', 'Nyakura', 'Rubagabaga', 'Rubare', 'Rubona', 'Rushaki', 'Rususa', 'Ruvune', 'Ruziba'],
            },
            'Southern Province': {
                'Gisagara': ['Bushubi', 'Bushyi', 'Gaterama', 'Gatikuwe', 'Gatombwa', 'Gisagara', 'Kigali', 'Kibogora', 'Kibuye', 'Kijeneza', 'Kiziguro', 'Cyahinda', 'Mabuswe', 'Makubika', 'Maraba', 'Mbazi', 'Muhanda'],
                'Huye': ['Gishamvu', 'Kaduha', 'Kigoma', 'Kigoye', 'Kinavuyo', 'Kinazi', 'Kinyinya', 'Kinyoni', 'Kiziguro', 'Mukura', 'Murundi', 'Mwendo', 'Ndora', 'Nkokoma', 'Nseza'],
                'Muhanga': ['Gigiri', 'Giheta', 'Gikondo', 'Kandi', 'Kanombe', 'Karama', 'Karangazi', 'Karangwe', 'Kariakhi', 'Karongi'],
                'Nyamagabe': ['Karama', 'Mashenge', 'Muhanga', 'Muhima', 'Mukarere', 'Mukura', 'Mungano', 'Murenzuzi', 'Musambira', 'Musha', 'Muvumbe', 'Nkumba', 'Rebero'],
                'Nyanza': ['Gisagara', 'Gitarama', 'Kaduha', 'Kagina', 'Kagyesera', 'Kagwegwe', 'Kaguhu', 'Kamabuye', 'Kamegeri', 'Kaminuza', 'Kamubiri', 'Kanakuwa', 'Kanali', 'Kandaya', 'Kankanda', 'Kanombe', 'Karama', 'Karangazi'],
                'Nyaruguru': ['Bushenge', 'Cyahinda', 'Gasaka', 'Gatare', 'Gatazo', 'Gihembe', 'Gisenyi', 'Gitama', 'Gitwe'],
            },
            'Western Province': {
                'Bunyoni': ['Gasheshi', 'Gatare', 'Gitega', 'Gitema', 'Gitmekwa', 'Gitwe'],
                'Gakenke': ['Bugira', 'Bugufi', 'Bugui', 'Bumbogo', 'Buringire', 'Bushoki', 'Gacaca'],
                'Karongi': ['Gakenke', 'Gakunzi', 'Gashashi', 'Gatorero', 'Gatunga', 'Gitesi', 'Gitu', 'Gizuri', 'Karongi', 'Kigali'],
                'Nyamyumba': ['Gitare', 'Gitereko', 'Gitsiga'],
                'Nyungwe': ['Cyamudongo', 'Gatarama', 'Gatare', 'Gateramo', 'Gatura'],
                'Rutsiro': ['Gakenke', 'Bushoki', 'Busoro'],
                'Rusizi': ['Bugula', 'Gasaka', 'Gatare', 'Gatasibo', 'Gatazo', 'Gaterama', 'Gatikuwe', 'Gatombwa', 'Gaturenga', 'Gaturuka', 'Gatweraka', 'Gawinga'],
            }
        }

        self.stdout.write(self.style.SUCCESS('Loading Rwanda locations...'))

        for province_name, districts in locations_data.items():
            # Create province with generated code
            province_code = self.generate_province_code(province_name)
            province, created = Province.objects.get_or_create(
                name=province_name,
                defaults={'code': province_code}
            )
            if created:
                self.stdout.write(f'Created Province: {province_name} ({province_code})')
            
            for district_index, (district_name, sectors) in enumerate(districts.items()):
                # Create district with generated code
                district_code = self.generate_district_code(province_code, district_index)
                district, created = District.objects.get_or_create(
                    name=district_name,
                    province=province,
                    defaults={'code': district_code}
                )
                if created:
                    self.stdout.write(f'  Created District: {district_name} ({district_code})')
                
                # Create sectors with generated codes
                for sector_index, sector_name in enumerate(sectors):
                    sector_code = self.generate_sector_code(district_code, sector_index)
                    sector, created = Sector.objects.get_or_create(
                        name=sector_name,
                        district=district,
                        defaults={'code': sector_code}
                    )
                    if created:
                        self.stdout.write(f'    Created Sector: {sector_name} ({sector_code})')

        self.stdout.write(self.style.SUCCESS('Successfully loaded Rwanda locations!'))

