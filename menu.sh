#!/bin/bash
# Menu interactif pour Linux/Mac

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

show_menu() {
    clear
    echo ""
    echo "========================================================================"
    echo "   Dashboard Bexio → Power BI - Menu Principal"
    echo "========================================================================"
    echo ""
    echo "   1. Installer les dépendances"
    echo "   2. Tester la connexion API"
    echo "   3. Générer des données de démonstration"
    echo "   4. Extraire les données depuis Bexio"
    echo "   5. Transformer les données en Excel"
    echo "   6. Pipeline complet (extraction + transformation)"
    echo "   7. Ouvrir le dossier des données"
    echo "   8. Voir la documentation"
    echo "   9. Quitter"
    echo ""
    echo "========================================================================"
    echo ""
}

press_enter() {
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
}

while true; do
    show_menu
    read -p "Votre choix (1-9): " choice

    case $choice in
        1)
            echo ""
            echo "Installation des dépendances..."
            echo ""
            bash install.sh
            press_enter
            ;;
        2)
            echo ""
            echo "Test de connexion API..."
            echo ""
            bash run_test.sh
            press_enter
            ;;
        3)
            echo ""
            echo "Génération des données de démonstration..."
            echo ""
            if [ -f "venv/bin/activate" ]; then
                source venv/bin/activate
            fi
            python scripts/generate_demo_data.py
            press_enter
            ;;
        4)
            echo ""
            echo "Extraction depuis Bexio..."
            echo ""
            if [ -f "venv/bin/activate" ]; then
                source venv/bin/activate
            fi
            python scripts/bexio_extractor.py
            press_enter
            ;;
        5)
            echo ""
            echo "Transformation des données..."
            echo ""
            if [ -f "venv/bin/activate" ]; then
                source venv/bin/activate
            fi
            python scripts/data_transformer.py
            press_enter
            ;;
        6)
            echo ""
            echo "Pipeline complet..."
            echo ""
            bash run_extraction.sh
            press_enter
            ;;
        7)
            echo ""
            echo "Ouverture du dossier data..."
            if [[ "$OSTYPE" == "darwin"* ]]; then
                open data
            else
                xdg-open data 2>/dev/null || nautilus data 2>/dev/null || echo "Dossier: $(pwd)/data"
            fi
            press_enter
            ;;
        8)
            echo ""
            echo "Documentation:"
            echo ""
            echo "  - README.md                    (Vue d'ensemble)"
            echo "  - QUICKSTART.md                (Démarrage rapide)"
            echo "  - docs/GUIDE_INSTALLATION.md   (Installation détaillée)"
            echo "  - docs/GUIDE_DASHBOARDS.md     (Templates dashboards)"
            echo "  - docs/API_REFERENCE.md        (Référence API)"
            echo ""
            read -p "Ouvrir README.md? (o/n): " open
            if [[ $open == "o" || $open == "O" ]]; then
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    open README.md
                else
                    xdg-open README.md 2>/dev/null || less README.md
                fi
            fi
            press_enter
            ;;
        9)
            echo ""
            echo "Au revoir!"
            exit 0
            ;;
        *)
            echo ""
            echo "Choix invalide!"
            sleep 2
            ;;
    esac
done
