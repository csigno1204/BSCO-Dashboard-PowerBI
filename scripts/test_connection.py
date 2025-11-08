"""
Script de test de connexion à l'API Bexio
Vérifie que tout est correctement configuré avant l'extraction
"""
import os
import sys
import requests
from dotenv import load_dotenv

# Couleurs pour le terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_success(message):
    """Affiche un message de succès"""
    print(f"{Colors.GREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    """Affiche un message d'erreur"""
    print(f"{Colors.RED}✗ {message}{Colors.ENDC}")

def print_warning(message):
    """Affiche un avertissement"""
    print(f"{Colors.YELLOW}⚠ {message}{Colors.ENDC}")

def print_info(message):
    """Affiche une information"""
    print(f"{Colors.BLUE}ℹ {message}{Colors.ENDC}")

def check_env_file():
    """Vérifie que le fichier .env existe"""
    if not os.path.exists('.env'):
        print_error("Fichier .env introuvable")
        print_info("Créez un fichier .env basé sur .env.example:")
        print("    cp .env.example .env  # Linux/Mac")
        print("    copy .env.example .env  # Windows")
        return False
    print_success("Fichier .env trouvé")
    return True

def check_token():
    """Vérifie que le token API est configuré"""
    load_dotenv()
    token = os.getenv('BEXIO_API_TOKEN')

    if not token:
        print_error("BEXIO_API_TOKEN non configuré dans .env")
        print_info("Ajoutez votre token API dans le fichier .env:")
        print("    BEXIO_API_TOKEN=votre_token_ici")
        return False, None

    if token == "votre_token_api_ici":
        print_error("BEXIO_API_TOKEN contient la valeur par défaut")
        print_info("Remplacez 'votre_token_api_ici' par votre vrai token")
        return False, None

    # Masquer une partie du token pour la sécurité
    masked_token = token[:8] + "..." + token[-4:]
    print_success(f"Token API configuré ({masked_token})")
    return True, token

def test_api_connection(token):
    """Test la connexion à l'API Bexio"""
    print_info("Test de connexion à l'API Bexio...")

    url = "https://api.bexio.com/2.0/contact"
    headers = {
        'Accept': 'application/json',
        'Authorization': f'Bearer {token}'
    }

    try:
        # Limiter à 1 résultat pour le test
        response = requests.get(url, headers=headers, params={'limit': 1}, timeout=10)

        if response.status_code == 200:
            print_success("Connexion à l'API Bexio réussie!")
            data = response.json()
            if data:
                print_info(f"Nombre de contacts disponibles: {len(data)} (échantillon)")
            return True
        elif response.status_code == 401:
            print_error("Authentification échouée (401)")
            print_info("Votre token API est invalide ou expiré")
            print_info("Générez un nouveau token sur https://office.bexio.com")
            return False
        elif response.status_code == 403:
            print_error("Accès refusé (403)")
            print_info("Votre token n'a pas les permissions nécessaires")
            return False
        elif response.status_code == 429:
            print_error("Trop de requêtes (429)")
            print_info("Attendez quelques minutes avant de réessayer")
            return False
        else:
            print_error(f"Erreur HTTP {response.status_code}")
            print_info(f"Détails: {response.text}")
            return False

    except requests.exceptions.Timeout:
        print_error("Délai d'attente dépassé")
        print_info("Vérifiez votre connexion Internet")
        return False
    except requests.exceptions.ConnectionError:
        print_error("Erreur de connexion")
        print_info("Vérifiez votre connexion Internet")
        return False
    except Exception as e:
        print_error(f"Erreur inattendue: {str(e)}")
        return False

def check_data_directory():
    """Vérifie que le répertoire data existe"""
    if not os.path.exists('data'):
        print_warning("Répertoire 'data' introuvable, création...")
        os.makedirs('data')
        print_success("Répertoire 'data' créé")
    else:
        print_success("Répertoire 'data' trouvé")
    return True

def check_endpoints_config():
    """Vérifie la configuration des endpoints"""
    load_dotenv()
    endpoints_str = os.getenv('BEXIO_ENDPOINTS', 'contacts,invoices,quotes,projects')
    endpoints = [e.strip() for e in endpoints_str.split(',')]

    print_success(f"Endpoints configurés: {', '.join(endpoints)}")

    days = os.getenv('EXTRACTION_DAYS', '365')
    print_success(f"Période d'extraction: {days} jours")

    return True

def main():
    """Fonction principale"""
    print("\n" + "="*70)
    print("  TEST DE CONFIGURATION - Dashboard Bexio → Power BI")
    print("="*70 + "\n")

    all_ok = True

    # 1. Vérifier le fichier .env
    print(f"{Colors.BOLD}[1/5] Vérification du fichier .env{Colors.ENDC}")
    if not check_env_file():
        all_ok = False
    print()

    # 2. Vérifier le token
    print(f"{Colors.BOLD}[2/5] Vérification du token API{Colors.ENDC}")
    token_ok, token = check_token()
    if not token_ok:
        all_ok = False
    print()

    # 3. Tester la connexion API
    if token:
        print(f"{Colors.BOLD}[3/5] Test de connexion à l'API Bexio{Colors.ENDC}")
        if not test_api_connection(token):
            all_ok = False
        print()
    else:
        print(f"{Colors.BOLD}[3/5] Test de connexion à l'API Bexio{Colors.ENDC}")
        print_warning("Test ignoré (token non configuré)")
        print()
        all_ok = False

    # 4. Vérifier le répertoire data
    print(f"{Colors.BOLD}[4/5] Vérification du répertoire data{Colors.ENDC}")
    check_data_directory()
    print()

    # 5. Vérifier la configuration des endpoints
    print(f"{Colors.BOLD}[5/5] Vérification de la configuration{Colors.ENDC}")
    check_endpoints_config()
    print()

    # Résumé
    print("="*70)
    if all_ok:
        print_success("TOUS LES TESTS SONT PASSÉS!")
        print()
        print_info("Vous pouvez maintenant lancer l'extraction:")
        print("    python scripts/run_pipeline.py")
        print("    ou")
        print("    run_extraction.bat  (Windows)")
        print("    ./run_extraction.sh (Linux/Mac)")
        print()
        return 0
    else:
        print_error("CERTAINS TESTS ONT ÉCHOUÉ")
        print()
        print_info("Corrigez les erreurs ci-dessus avant de continuer")
        print_info("Consultez docs/GUIDE_INSTALLATION.md pour plus d'aide")
        print()
        return 1

if __name__ == '__main__':
    sys.exit(main())
