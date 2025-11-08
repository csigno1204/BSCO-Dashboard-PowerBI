"""
Planificateur d'actualisation automatique
Configure l'extraction automatique selon la plateforme
"""
import os
import sys
import platform
from datetime import datetime

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.ENDC}")

def get_project_path():
    """Retourne le chemin absolu du projet"""
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def setup_windows_task(frequency, hour, minute):
    """Configure une tâche planifiée Windows"""
    project_path = get_project_path()
    script_path = os.path.join(project_path, "run_extraction.bat")

    task_name = "BexioDashboardSync"

    # Fréquences
    freq_map = {
        "1": "DAILY",
        "2": "DAILY",
        "3": "WEEKLY",
        "4": "MONTHLY"
    }

    schedule = freq_map.get(frequency, "DAILY")

    # Construire la commande schtasks
    cmd = f'schtasks /create /tn "{task_name}" /tr "\"{script_path}\"" /sc {schedule} /st {hour}:{minute:02d} /f'

    # Pour deux fois par jour, créer deux tâches
    if frequency == "2":
        cmd2 = f'schtasks /create /tn "{task_name}_Evening" /tr "\"{script_path}\"" /sc DAILY /st 18:00 /f'
        os.system(cmd2)

    result = os.system(cmd)

    if result == 0:
        print_success("Tâche planifiée créée avec succès!")
        print_info(f"Tâche: {task_name}")
        print_info(f"Fréquence: {schedule}")
        print_info(f"Heure: {hour}:{minute:02d}")
        print_info(f"Script: {script_path}")
        return True
    else:
        print_error("Erreur lors de la création de la tâche")
        print_info("Vous devez exécuter ce script en tant qu'administrateur")
        return False

def setup_linux_cron(frequency, hour, minute):
    """Configure un cron job Linux/Mac"""
    project_path = get_project_path()
    script_path = os.path.join(project_path, "run_extraction.sh")

    # Fréquences pour cron
    cron_patterns = {
        "1": f"{minute} {hour} * * *",  # Quotidien
        "2": f"{minute} {hour},18 * * *",  # Deux fois par jour
        "3": f"{minute} {hour} * * 1",  # Hebdomadaire (lundi)
        "4": f"{minute} {hour} 1 * *"   # Mensuel (1er du mois)
    }

    cron_line = f"{cron_patterns.get(frequency, cron_patterns['1'])} cd {project_path} && {script_path} >> {project_path}/logs/cron.log 2>&1"

    print_info("\nAjoutez cette ligne à votre crontab:")
    print(f"\n{Colors.BOLD}{cron_line}{Colors.ENDC}\n")
    print_info("Pour éditer le crontab:")
    print("  crontab -e")
    print("\nPuis collez la ligne ci-dessus et sauvegardez.")

    return True

def interactive_setup():
    """Assistant interactif de configuration"""
    print("\n" + "="*70)
    print("  PLANIFICATEUR D'ACTUALISATION AUTOMATIQUE")
    print("="*70 + "\n")

    # Choix de la fréquence
    print("Fréquence d'actualisation:")
    print("  1. Quotidien (recommandé)")
    print("  2. Deux fois par jour (matin et soir)")
    print("  3. Hebdomadaire")
    print("  4. Mensuel")
    print("  5. Personnalisé")
    print()

    frequency = input("Votre choix [1]: ").strip() or "1"

    if frequency not in ["1", "2", "3", "4", "5"]:
        frequency = "1"

    # Heure d'exécution
    if frequency != "5":
        print()
        hour_input = input("Heure d'exécution (0-23) [6]: ").strip() or "6"
        try:
            hour = int(hour_input)
            if hour < 0 or hour > 23:
                hour = 6
        except:
            hour = 6

        minute_input = input("Minutes (0-59) [0]: ").strip() or "0"
        try:
            minute = int(minute_input)
            if minute < 0 or minute > 59:
                minute = 0
        except:
            minute = 0
    else:
        print()
        print_info("Mode personnalisé non implémenté dans cette version")
        print_info("Utilisez le planificateur de votre système d'exploitation")
        return

    print()
    print("="*70)
    print("Configuration:")
    freq_names = {
        "1": "Quotidien",
        "2": "Deux fois par jour",
        "3": "Hebdomadaire",
        "4": "Mensuel"
    }
    print(f"  Fréquence: {freq_names.get(frequency, 'Quotidien')}")
    print(f"  Heure: {hour:02d}:{minute:02d}")
    print("="*70)
    print()

    confirm = input("Confirmer la création? (O/n): ").strip().lower()
    if confirm not in ["o", "oui", "yes", "y", ""]:
        print_info("Opération annulée")
        return

    print()

    # Créer le répertoire logs si nécessaire
    logs_dir = os.path.join(get_project_path(), "logs")
    os.makedirs(logs_dir, exist_ok=True)

    # Configuration selon la plateforme
    system = platform.system()

    if system == "Windows":
        setup_windows_task(frequency, hour, minute)
    elif system in ["Linux", "Darwin"]:  # Darwin = macOS
        setup_linux_cron(frequency, hour, minute)
    else:
        print_error(f"Système d'exploitation non supporté: {system}")

    print()

def main():
    """Fonction principale"""
    try:
        interactive_setup()
    except KeyboardInterrupt:
        print("\n\nOpération annulée par l'utilisateur")
        sys.exit(0)
    except Exception as e:
        print_error(f"Erreur: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
