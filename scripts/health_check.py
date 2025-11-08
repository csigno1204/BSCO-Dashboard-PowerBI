"""
Vérificateur de santé du système
Diagnostic complet de l'installation et de la configuration
"""
import os
import sys
import shutil
import platform
from datetime import datetime, timedelta
from dotenv import load_dotenv
import glob

load_dotenv()

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

class HealthChecker:
    """Vérificateur de santé du système"""

    def __init__(self):
        self.checks_passed = 0
        self.checks_total = 0
        self.warnings = []

    def check(self, condition, success_msg, failure_msg):
        """Effectue une vérification"""
        self.checks_total += 1
        if condition:
            print(f"{Colors.GREEN}✓{Colors.ENDC} {success_msg}")
            self.checks_passed += 1
            return True
        else:
            print(f"{Colors.RED}✗{Colors.ENDC} {failure_msg}")
            return False

    def warn(self, message):
        """Ajoute un avertissement"""
        print(f"{Colors.YELLOW}⚠{Colors.ENDC} {message}")
        self.warnings.append(message)

    def info(self, message):
        """Affiche une information"""
        print(f"{Colors.BLUE}ℹ{Colors.ENDC} {message}")

    def check_python_version(self):
        """Vérifie la version de Python"""
        version = sys.version_info
        version_str = f"Python {version.major}.{version.minor}.{version.micro}"

        if version.major == 3 and version.minor >= 8:
            self.check(True, version_str, "")
            return True
        else:
            self.check(False, "", f"{version_str} (version 3.8+ requise)")
            return False

    def check_dependencies(self):
        """Vérifie les dépendances Python"""
        required = ['requests', 'pandas', 'openpyxl', 'python-dotenv', 'xlsxwriter']
        all_installed = True

        for package in required:
            try:
                __import__(package.replace('-', '_'))
                self.check(True, f"Package '{package}' installé", "")
            except ImportError:
                self.check(False, "", f"Package '{package}' manquant")
                all_installed = False

        return all_installed

    def check_configuration(self):
        """Vérifie la configuration"""
        # Fichier .env
        if not self.check(os.path.exists('.env'), "Fichier .env trouvé", "Fichier .env manquant"):
            self.info("Créez un fichier .env basé sur .env.example")
            return False

        # Token API
        token = os.getenv('BEXIO_API_TOKEN')
        if self.check(token and token != 'votre_token_api_ici',
                     "Token API configuré",
                     "Token API non configuré"):
            masked = f"{token[:8]}...{token[-4:]}"
            self.info(f"  Token: {masked}")
        else:
            return False

        # Endpoints
        endpoints = os.getenv('BEXIO_ENDPOINTS', '')
        self.check(bool(endpoints), f"Endpoints configurés: {endpoints}",
                  "Aucun endpoint configuré")

        return True

    def check_directories(self):
        """Vérifie les répertoires"""
        dirs = ['data', 'logs', 'scripts', 'powerbi', 'docs']
        for directory in dirs:
            self.check(os.path.isdir(directory), f"Répertoire '{directory}' présent", "")

    def check_disk_space(self):
        """Vérifie l'espace disque disponible"""
        try:
            stat = shutil.disk_usage('.')
            free_mb = stat.free / (1024 * 1024)
            free_gb = free_mb / 1024

            if free_gb > 1:
                self.check(True, f"{free_gb:.1f} GB d'espace libre", "")
            elif free_mb > 100:
                self.check(True, f"{free_mb:.0f} MB d'espace libre", "")
                self.warn("Espace disque faible (< 1 GB)")
            else:
                self.check(False, "", f"Espace disque critique: {free_mb:.0f} MB")
        except:
            self.warn("Impossible de vérifier l'espace disque")

    def check_last_extraction(self):
        """Vérifie la dernière extraction"""
        # Chercher le fichier Excel le plus récent
        excel_files = glob.glob('data/*.xlsx')

        if not excel_files:
            self.warn("Aucune extraction trouvée (aucun fichier Excel dans data/)")
            return

        latest_file = max(excel_files, key=os.path.getmtime)
        mod_time = datetime.fromtimestamp(os.path.getmtime(latest_file))
        age = datetime.now() - mod_time

        if age.total_seconds() < 3600:  # Moins d'1h
            self.check(True, f"Dernière extraction: il y a {int(age.total_seconds() / 60)} min", "")
        elif age.days == 0:  # Aujourd'hui
            self.check(True, f"Dernière extraction: il y a {int(age.total_seconds() / 3600)}h", "")
        elif age.days < 2:
            self.check(True, f"Dernière extraction: hier", "")
        elif age.days < 7:
            self.check(True, f"Dernière extraction: il y a {age.days} jours", "")
            self.warn("Extraction pas très récente")
        else:
            self.warn(f"Dernière extraction: il y a {age.days} jours (ancienne)")

    def check_overdue_invoices(self):
        """Vérifie les factures en retard (si données disponibles)"""
        try:
            import pandas as pd
            excel_files = glob.glob('data/*.xlsx')

            if not excel_files:
                return

            latest_file = max(excel_files, key=os.path.getmtime)

            # Lire l'onglet invoices
            df = pd.read_excel(latest_file, sheet_name='invoices')

            if 'DaysOverdue' in df.columns:
                overdue = df[df['DaysOverdue'] > 0]
                count = len(overdue)

                if count == 0:
                    self.check(True, "Aucune facture en retard", "")
                elif count < 5:
                    self.warn(f"{count} facture(s) en retard")
                else:
                    self.warn(f"{count} factures en retard (action requise)")
        except:
            pass  # Pas de données ou erreur de lecture

    def get_score(self):
        """Calcule le score de santé"""
        if self.checks_total == 0:
            return 0
        return int((self.checks_passed / self.checks_total) * 100)

    def run_full_check(self):
        """Exécute tous les diagnostics"""
        print("\n" + "="*70)
        print("  🔍 DIAGNOSTIC COMPLET DU SYSTÈME")
        print("="*70 + "\n")

        # 1. Python et dépendances
        print(f"{Colors.BOLD}[1/6] Python et dépendances{Colors.ENDC}")
        self.check_python_version()
        self.check_dependencies()
        print()

        # 2. Configuration
        print(f"{Colors.BOLD}[2/6] Configuration{Colors.ENDC}")
        self.check_configuration()
        print()

        # 3. Structure du projet
        print(f"{Colors.BOLD}[3/6] Structure du projet{Colors.ENDC}")
        self.check_directories()
        print()

        # 4. Ressources système
        print(f"{Colors.BOLD}[4/6] Ressources système{Colors.ENDC}")
        self.info(f"Système: {platform.system()} {platform.release()}")
        self.check_disk_space()
        print()

        # 5. Historique des extractions
        print(f"{Colors.BOLD}[5/6] Historique{Colors.ENDC}")
        self.check_last_extraction()
        print()

        # 6. Alertes métier
        print(f"{Colors.BOLD}[6/6] Alertes métier{Colors.ENDC}")
        self.check_overdue_invoices()
        print()

        # Résumé
        print("="*70)
        score = self.get_score()

        if score >= 90:
            color = Colors.GREEN
            status = "EXCELLENT"
        elif score >= 70:
            color = Colors.YELLOW
            status = "BON"
        else:
            color = Colors.RED
            status = "ATTENTION REQUISE"

        print(f"\n{color}{Colors.BOLD}Score de santé: {score}/100 - {status}{Colors.ENDC}\n")

        if self.warnings:
            print(f"{Colors.YELLOW}Avertissements:{Colors.ENDC}")
            for warning in self.warnings:
                print(f"  • {warning}")
            print()

        print("="*70 + "\n")

def main():
    checker = HealthChecker()
    checker.run_full_check()

if __name__ == '__main__':
    main()
