"""
Visualiseur d'historique des extractions
"""
import os
import sys
from datetime import datetime
from logger import ExtractionLogger

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def format_duration(seconds):
    """Formate une durée en secondes"""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        minutes = seconds / 60
        return f"{minutes:.1f}m"
    else:
        hours = seconds / 3600
        return f"{hours:.1f}h"

def format_timestamp(iso_timestamp):
    """Formate un timestamp ISO"""
    dt = datetime.fromisoformat(iso_timestamp)
    return dt.strftime("%d/%m %H:%M")

def display_history(limit=10):
    """Affiche l'historique des extractions"""
    logger = ExtractionLogger()
    history = logger.get_history(limit)

    if not history:
        print(f"\n{Colors.YELLOW}Aucun historique disponible{Colors.ENDC}\n")
        return

    print("\n" + "="*70)
    print(f"  HISTORIQUE DES {min(limit, len(history))} DERNIÈRES EXTRACTIONS")
    print("="*70 + "\n")

    for i, entry in enumerate(history, 1):
        timestamp = format_timestamp(entry['timestamp'])
        success = entry['success']
        records = entry.get('records', 0)
        duration = entry.get('duration', 0)
        error = entry.get('error')

        # Ligne de statut
        if success:
            status_icon = f"{Colors.GREEN}✓{Colors.ENDC}"
            info = f"{records} enregistrements  {format_duration(duration)}"
        else:
            status_icon = f"{Colors.RED}✗{Colors.ENDC}"
            info = f"Erreur: {error[:40]}..." if error else "Échec"

        print(f"{timestamp}  {status_icon}  {info}")

    print("\n" + "="*70 + "\n")

    # Statistiques
    total = len(history)
    success_count = sum(1 for e in history if e['success'])
    failure_count = total - success_count

    if total > 0:
        success_rate = (success_count / total) * 100
        print(f"Statistiques:")
        print(f"  Total: {total} extractions")
        print(f"  Succès: {Colors.GREEN}{success_count}{Colors.ENDC} ({success_rate:.0f}%)")
        if failure_count > 0:
            print(f"  Échecs: {Colors.RED}{failure_count}{Colors.ENDC}")
        print()

def display_detailed_entry(index):
    """Affiche les détails d'une entrée spécifique"""
    logger = ExtractionLogger()
    history = logger.get_history(100)

    if index < 1 or index > len(history):
        print(f"{Colors.RED}Index invalide{Colors.ENDC}")
        return

    entry = history[index - 1]

    print("\n" + "="*70)
    print("  DÉTAILS DE L'EXTRACTION")
    print("="*70 + "\n")

    print(f"Date/Heure: {format_timestamp(entry['timestamp'])}")
    print(f"Statut: {'✓ Succès' if entry['success'] else '✗ Échec'}")
    print(f"Enregistrements: {entry.get('records', 0)}")
    print(f"Durée: {format_duration(entry.get('duration', 0))}")

    if entry.get('output_file'):
        print(f"Fichier: {entry['output_file']}")

    if entry.get('error'):
        print(f"\n{Colors.RED}Erreur:{Colors.ENDC}")
        print(f"  {entry['error']}")

    print()

def main():
    """Fonction principale"""
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
            display_history(limit)
        except ValueError:
            print(f"{Colors.RED}Erreur: L'argument doit être un nombre{Colors.ENDC}")
            sys.exit(1)
    else:
        display_history(10)

if __name__ == '__main__':
    main()
