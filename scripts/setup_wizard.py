"""
Assistant de configuration interactive
Guide l'utilisateur à travers la configuration initiale
"""
import os
import sys
from dotenv import load_dotenv

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text.center(70)}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*70}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓{Colors.ENDC} {text}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ{Colors.ENDC} {text}")

def print_question(text):
    return input(f"{Colors.YELLOW}?{Colors.ENDC} {text}")

def setup_wizard():
    """Assistant de configuration interactif"""

    print_header("ASSISTANT DE CONFIGURATION - Dashboard Bexio → Power BI")

    print("Bienvenue ! Cet assistant va vous aider à configurer votre projet.\n")

    # Vérifier si .env existe déjà
    env_exists = os.path.exists('.env')
    if env_exists:
        print_info("Un fichier .env existe déjà.")
        overwrite = print_question("Voulez-vous le reconfigurer? (o/N): ").lower()
        if overwrite not in ['o', 'oui', 'y', 'yes']:
            print("\nConfiguration annulée.")
            return
        print()

    config = {}

    # 1. Token API Bexio
    print_header("Étape 1/6 - Token API Bexio")
    print("Pour obtenir votre token:")
    print("  1. Allez sur https://office.bexio.com")
    print("  2. Paramètres → Intégrations → API")
    print("  3. Copiez le token d'accès\n")

    token = print_question("Token API Bexio: ").strip()
    if not token:
        print(f"\n{Colors.RED}✗{Colors.ENDC} Token requis. Configuration annulée.")
        return
    config['BEXIO_API_TOKEN'] = token
    print_success("Token configuré\n")

    # 2. Données à extraire
    print_header("Étape 2/6 - Données à extraire")
    print("Quelles données souhaitez-vous extraire?\n")

    all_endpoints = {
        '1': ('contacts', 'Contacts (clients, fournisseurs)'),
        '2': ('invoices', 'Factures'),
        '3': ('quotes', 'Devis'),
        '4': ('orders', 'Commandes'),
        '5': ('projects', 'Projets'),
        '6': ('timesheets', 'Feuilles de temps'),
        '7': ('articles', 'Articles/Services')
    }

    for key, (endpoint, desc) in all_endpoints.items():
        print(f"  {key}. {desc}")

    print(f"  8. Tout (recommandé)\n")

    choices = print_question("Vos choix (ex: 1,2,3 ou 8 pour tout): ").strip()

    if choices == '8':
        selected_endpoints = [ep for ep, _ in all_endpoints.values()]
    else:
        selected_endpoints = []
        for choice in choices.split(','):
            choice = choice.strip()
            if choice in all_endpoints:
                selected_endpoints.append(all_endpoints[choice][0])

    if not selected_endpoints:
        selected_endpoints = ['contacts', 'invoices', 'quotes', 'projects']
        print_info("Utilisation des endpoints par défaut")

    config['BEXIO_ENDPOINTS'] = ','.join(selected_endpoints)
    print_success(f"Endpoints sélectionnés: {', '.join(selected_endpoints)}\n")

    # 3. Période d'extraction
    print_header("Étape 3/6 - Période d'extraction")
    print("Combien de jours de données historiques voulez-vous?\n")
    print("  1. 90 jours (3 mois)")
    print("  2. 180 jours (6 mois)")
    print("  3. 365 jours (1 an) - recommandé")
    print("  4. 730 jours (2 ans)")
    print("  5. Personnalisé\n")

    period_choice = print_question("Votre choix [3]: ").strip() or "3"

    period_days = {
        '1': '90',
        '2': '180',
        '3': '365',
        '4': '730'
    }

    if period_choice == '5':
        days = print_question("Nombre de jours: ").strip()
        config['EXTRACTION_DAYS'] = days if days.isdigit() else '365'
    else:
        config['EXTRACTION_DAYS'] = period_days.get(period_choice, '365')

    print_success(f"Période: {config['EXTRACTION_DAYS']} jours\n")

    # 4. Notifications email
    print_header("Étape 4/6 - Notifications par email (optionnel)")
    enable_email = print_question("Activer les notifications email? (o/N): ").lower()

    if enable_email in ['o', 'oui', 'y', 'yes']:
        config['EMAIL_NOTIFICATIONS'] = 'true'
        config['EMAIL_TO'] = print_question("Votre email: ").strip()
        config['SMTP_SERVER'] = print_question("Serveur SMTP [smtp.gmail.com]: ").strip() or 'smtp.gmail.com'
        config['SMTP_PORT'] = print_question("Port SMTP [587]: ").strip() or '587'
        config['SMTP_USER'] = print_question("Utilisateur SMTP: ").strip()
        config['SMTP_PASSWORD'] = print_question("Mot de passe SMTP: ").strip()
        print_success("Notifications email configurées\n")
    else:
        config['EMAIL_NOTIFICATIONS'] = 'false'
        print_info("Notifications email désactivées\n")

    # 5. Profil d'utilisation
    print_header("Étape 5/6 - Profil d'utilisation")
    print("Quel est votre secteur d'activité?\n")
    print("  1. Services / Consulting")
    print("  2. E-commerce")
    print("  3. Artisanat / BTP")
    print("  4. IT / Software")
    print("  5. Autre\n")

    sector = print_question("Votre choix [1]: ").strip() or "1"
    config['USER_SECTOR'] = sector

    clients_per_year = print_question("\nCombien de clients gérez-vous par an? [50]: ").strip() or "50"
    config['CLIENTS_PER_YEAR'] = clients_per_year

    print()

    # 6. Récapitulatif
    print_header("Étape 6/6 - Récapitulatif")
    print("Configuration:")
    print(f"  • Token API: {'*' * 8}...{token[-4:]}")
    print(f"  • Endpoints: {config['BEXIO_ENDPOINTS']}")
    print(f"  • Période: {config['EXTRACTION_DAYS']} jours")
    print(f"  • Notifications: {'Activées' if config.get('EMAIL_NOTIFICATIONS') == 'true' else 'Désactivées'}")
    print()

    confirm = print_question("Confirmer et sauvegarder? (O/n): ").lower()
    if confirm in ['n', 'non', 'no']:
        print("\nConfiguration annulée.")
        return

    # Sauvegarder la configuration
    with open('.env', 'w', encoding='utf-8') as f:
        f.write("# Configuration Dashboard Bexio → Power BI\n")
        f.write(f"# Généré le {os.popen('date').read().strip()}\n\n")

        f.write("# API Bexio\n")
        f.write(f"BEXIO_API_TOKEN={config['BEXIO_API_TOKEN']}\n\n")

        f.write("# Données à extraire\n")
        f.write(f"BEXIO_ENDPOINTS={config['BEXIO_ENDPOINTS']}\n")
        f.write(f"EXTRACTION_DAYS={config['EXTRACTION_DAYS']}\n\n")

        if config.get('EMAIL_NOTIFICATIONS') == 'true':
            f.write("# Notifications email\n")
            f.write(f"EMAIL_NOTIFICATIONS={config['EMAIL_NOTIFICATIONS']}\n")
            f.write(f"EMAIL_TO={config.get('EMAIL_TO', '')}\n")
            f.write(f"SMTP_SERVER={config.get('SMTP_SERVER', 'smtp.gmail.com')}\n")
            f.write(f"SMTP_PORT={config.get('SMTP_PORT', '587')}\n")
            f.write(f"SMTP_USER={config.get('SMTP_USER', '')}\n")
            f.write(f"SMTP_PASSWORD={config.get('SMTP_PASSWORD', '')}\n\n")

        f.write("# Profil utilisateur\n")
        f.write(f"USER_SECTOR={config.get('USER_SECTOR', '1')}\n")
        f.write(f"CLIENTS_PER_YEAR={config.get('CLIENTS_PER_YEAR', '50')}\n")

    print()
    print_success("Configuration sauvegardée dans .env")

    print("\n" + "="*70)
    print_success("Configuration terminée avec succès!")
    print("="*70 + "\n")

    print("Prochaines étapes:")
    print("  1. Testez la connexion: run_test.bat (ou ./run_test.sh)")
    print("  2. Lancez l'extraction: run_extraction.bat (ou ./run_extraction.sh)")
    print("  3. Importez le fichier Excel dans Power BI\n")

def main():
    try:
        setup_wizard()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Configuration interrompue{Colors.ENDC}\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}✗ Erreur: {str(e)}{Colors.ENDC}\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
