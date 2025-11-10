"""
Web Launcher - Dashboard Bexio → Power BI

Launcher minimaliste qui démarre l'application web et ouvre le navigateur.
Compilé en exe ultra-léger (~10 MB au lieu de 100 MB).
"""

import sys
import os
from pathlib import Path

# Ajouter le répertoire de l'application au path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))

def main():
    """Point d'entrée principal"""
    try:
        print("=" * 60)
        print("  Dashboard Bexio → Power BI - Web Launcher")
        print("=" * 60)
        print()
        print("🚀 Démarrage de l'application web...")
        print()

        # Importer et lancer l'application web
        from webapp.app import run_webapp

        # Lancer sur le port 8000 par défaut
        run_webapp(port=8000, open_browser_on_start=True)

    except KeyboardInterrupt:
        print("\n\n🛑 Application arrêtée par l'utilisateur.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erreur lors du démarrage de l'application :")
        print(f"   {str(e)}")
        print()
        print("Appuyez sur Entrée pour fermer...")
        input()
        sys.exit(1)


if __name__ == '__main__':
    main()
