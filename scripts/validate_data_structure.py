"""
Script de validation de la structure des données Bexio
Vérifie que les données extraites sont compatibles avec Power BI
"""
import os
import json
import glob
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class DataValidator:
    """Validateur de structure de données"""

    def __init__(self):
        self.issues = []
        self.warnings = []
        self.success = []

    def error(self, message):
        self.issues.append(f"❌ {message}")
        print(f"❌ {message}")

    def warn(self, message):
        self.warnings.append(f"⚠️ {message}")
        print(f"⚠️ {message}")

    def ok(self, message):
        self.success.append(f"✓ {message}")
        print(f"✓ {message}")

    def validate_json_structure(self, file_path, expected_fields):
        """Valide la structure d'un fichier JSON"""
        print(f"\n🔍 Validation de {os.path.basename(file_path)}...")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            if not data:
                self.warn(f"Fichier vide: {file_path}")
                return False

            # Vérifier que c'est une liste
            if not isinstance(data, list):
                self.error(f"Les données doivent être une liste, reçu: {type(data)}")
                return False

            # Vérifier le premier élément
            if len(data) > 0:
                first_item = data[0]
                self.ok(f"{len(data)} enregistrements trouvés")

                # Afficher la structure
                print(f"   Champs disponibles ({len(first_item)} champs):")
                for key, value in list(first_item.items())[:10]:
                    value_type = type(value).__name__
                    value_preview = str(value)[:50]
                    print(f"     • {key}: {value_type} = {value_preview}")

                if len(first_item) > 10:
                    print(f"     ... et {len(first_item) - 10} autres champs")

                # Vérifier les champs attendus
                missing_fields = []
                for field in expected_fields:
                    if field not in first_item:
                        missing_fields.append(field)

                if missing_fields:
                    self.warn(f"Champs manquants: {', '.join(missing_fields)}")
                    self.warn(f"Cela peut être normal si vous n'utilisez pas tous les champs")
                else:
                    self.ok(f"Tous les champs attendus sont présents")

            return True

        except json.JSONDecodeError as e:
            self.error(f"Erreur de parsing JSON: {str(e)}")
            return False
        except Exception as e:
            self.error(f"Erreur inattendue: {str(e)}")
            return False

    def validate_excel_structure(self, file_path):
        """Valide la structure d'un fichier Excel généré"""
        print(f"\n🔍 Validation du fichier Excel...")

        try:
            # Lire les noms des feuilles
            xl_file = pd.ExcelFile(file_path)
            sheets = xl_file.sheet_names

            self.ok(f"Fichier Excel valide avec {len(sheets)} onglets")
            print(f"   Onglets: {', '.join(sheets)}")

            # Vérifier chaque onglet
            for sheet in sheets:
                df = pd.read_excel(file_path, sheet_name=sheet)
                print(f"\n   📄 Onglet '{sheet}':")
                print(f"      • {len(df)} lignes")
                print(f"      • {len(df.columns)} colonnes")
                print(f"      • Colonnes: {', '.join(df.columns[:5])}...")

                # Vérifier les types
                problematic_cols = []
                for col in df.columns:
                    if df[col].dtype == 'object':
                        # Vérifier si ça devrait être une date
                        if 'date' in col.lower():
                            problematic_cols.append(f"{col} (devrait être date)")
                        # Vérifier si ça devrait être numérique
                        elif any(word in col.lower() for word in ['id', 'total', 'amount', 'price']):
                            if not all(df[col].apply(lambda x: isinstance(x, (int, float)) or pd.isna(x))):
                                problematic_cols.append(f"{col} (devrait être numérique)")

                if problematic_cols:
                    self.warn(f"Colonnes avec types potentiellement incorrects:")
                    for col in problematic_cols:
                        print(f"         ⚠️ {col}")

            return True

        except Exception as e:
            self.error(f"Erreur lors de la validation Excel: {str(e)}")
            return False

    def validate_powerbi_compatibility(self, file_path):
        """Vérifie la compatibilité Power BI"""
        print(f"\n🔍 Vérification compatibilité Power BI...")

        try:
            xl_file = pd.ExcelFile(file_path)

            # Vérifier les relations possibles
            relations = []

            if 'invoices' in xl_file.sheet_names and 'contacts' in xl_file.sheet_names:
                invoices = pd.read_excel(file_path, sheet_name='invoices')
                contacts = pd.read_excel(file_path, sheet_name='contacts')

                if 'ContactID' in invoices.columns and 'ContactID' in contacts.columns:
                    # Vérifier que les IDs correspondent
                    invoice_contacts = set(invoices['ContactID'].dropna())
                    available_contacts = set(contacts['ContactID'].dropna())

                    missing = invoice_contacts - available_contacts
                    if missing:
                        self.warn(f"{len(missing)} ContactIDs dans invoices n'existent pas dans contacts")
                        self.warn("Cela créera des relations 'orphelines' dans Power BI")
                    else:
                        self.ok("Relation invoices → contacts validée")
                        relations.append("invoices[ContactID] → contacts[ContactID]")

            if 'invoices' in xl_file.sheet_names and 'projects' in xl_file.sheet_names:
                invoices = pd.read_excel(file_path, sheet_name='invoices')
                projects = pd.read_excel(file_path, sheet_name='projects')

                if 'ProjectID' in invoices.columns and 'ProjectID' in projects.columns:
                    self.ok("Relation invoices → projects validée")
                    relations.append("invoices[ProjectID] → projects[ProjectID]")

            if relations:
                print(f"\n   Relations Power BI suggérées:")
                for rel in relations:
                    print(f"      • {rel}")
            else:
                self.warn("Aucune relation détectée entre les tables")

            return True

        except Exception as e:
            self.error(f"Erreur compatibilité Power BI: {str(e)}")
            return False

    def test_with_real_api(self):
        """Test avec l'API Bexio réelle"""
        print(f"\n🔍 Test avec API Bexio réelle...")

        token = os.getenv('BEXIO_API_TOKEN')
        if not token or token == 'votre_token_api_ici':
            self.warn("Token API non configuré - test ignoré")
            return

        import requests

        try:
            # Test simple: récupérer 1 contact
            url = "https://api.bexio.com/2.0/contact"
            headers = {
                'Accept': 'application/json',
                'Authorization': f'Bearer {token}'
            }
            response = requests.get(url, headers=headers, params={'limit': 1})

            if response.status_code == 200:
                data = response.json()
                if data:
                    self.ok("API Bexio accessible")
                    print(f"\n   Structure réelle d'un contact Bexio:")
                    print(f"   Champs disponibles: {len(data[0])} champs")
                    for key in list(data[0].keys())[:15]:
                        print(f"      • {key}")
                    if len(data[0]) > 15:
                        print(f"      ... et {len(data[0]) - 15} autres")
            else:
                self.error(f"API Bexio erreur {response.status_code}")

        except Exception as e:
            self.error(f"Erreur test API: {str(e)}")

    def generate_report(self):
        """Génère un rapport de validation"""
        print("\n" + "="*70)
        print("  RAPPORT DE VALIDATION")
        print("="*70 + "\n")

        if self.issues:
            print(f"🔴 PROBLÈMES CRITIQUES ({len(self.issues)}):")
            for issue in self.issues:
                print(f"   {issue}")
            print()

        if self.warnings:
            print(f"⚠️  AVERTISSEMENTS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"   {warning}")
            print()

        if self.success:
            print(f"✅ VALIDATIONS RÉUSSIES ({len(self.success)}):")
            for item in self.success:
                print(f"   {item}")
            print()

        # Score
        total = len(self.issues) + len(self.warnings) + len(self.success)
        if total > 0:
            score = ((len(self.success) * 2 + len(self.warnings)) / (total * 2)) * 100
            print(f"Score de compatibilité: {score:.0f}/100")

            if score >= 90:
                print("🟢 Excellent - Prêt pour Power BI")
            elif score >= 70:
                print("🟡 Bon - Quelques ajustements recommandés")
            else:
                print("🔴 Attention - Corrections nécessaires")

        print("\n" + "="*70 + "\n")

def main():
    """Fonction principale"""
    print("\n" + "="*70)
    print("  VALIDATION DE LA STRUCTURE DES DONNÉES")
    print("="*70)

    validator = DataValidator()

    # 1. Tester avec l'API réelle
    validator.test_with_real_api()

    # 2. Vérifier les fichiers JSON extraits
    json_files = glob.glob('data/*.json')
    if json_files:
        # Prendre le plus récent
        latest_json = max(json_files, key=os.path.getmtime)

        # Définir les champs attendus selon le type
        if 'contacts' in latest_json:
            expected = ['id', 'name_1', 'email']
        elif 'invoices' in latest_json:
            expected = ['id', 'document_nr', 'total', 'contact_id']
        else:
            expected = []

        validator.validate_json_structure(latest_json, expected)
    else:
        validator.warn("Aucun fichier JSON trouvé - lancez d'abord une extraction")

    # 3. Vérifier les fichiers Excel
    excel_files = glob.glob('data/*.xlsx')
    if excel_files:
        latest_excel = max(excel_files, key=os.path.getmtime)
        validator.validate_excel_structure(latest_excel)
        validator.validate_powerbi_compatibility(latest_excel)
    else:
        validator.warn("Aucun fichier Excel trouvé - lancez la transformation")

    # 4. Générer le rapport
    validator.generate_report()

    # 5. Recommandations
    print("💡 RECOMMANDATIONS:")
    print("   1. Testez avec vos vraies données Bexio")
    print("   2. Importez dans Power BI et vérifiez les types")
    print("   3. Créez les relations suggérées")
    print("   4. Signalez tout problème pour ajustement des scripts")
    print()

if __name__ == '__main__':
    main()
