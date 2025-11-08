#!/bin/bash
# ============================================================================
# Script d'installation automatique - Dashboard Bexio PowerBI
# Pour Linux/Mac
# ============================================================================

echo ""
echo "========================================================================"
echo "   Installation Dashboard Bexio → Power BI"
echo "========================================================================"
echo ""

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier si Python est installé
echo "[1/5] Vérification de Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[ERREUR]${NC} Python 3 n'est pas installé"
    echo ""
    echo "Installation:"
    echo "  - Ubuntu/Debian: sudo apt-get install python3 python3-pip python3-venv"
    echo "  - MacOS: brew install python3"
    echo "  - Fedora: sudo dnf install python3 python3-pip"
    echo ""
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo -e "${GREEN}✓${NC} $PYTHON_VERSION détecté"
echo ""

# Vérifier si pip est installé
echo "[2/5] Vérification de pip..."
if ! command -v pip3 &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} pip n'est pas installé, installation..."
    python3 -m ensurepip --default-pip
fi

PIP_VERSION=$(pip3 --version)
echo -e "${GREEN}✓${NC} $PIP_VERSION détecté"
echo ""

# Créer un environnement virtuel
echo "[3/5] Création de l'environnement virtuel..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓${NC} Environnement virtuel créé"
else
    echo -e "${YELLOW}⚠${NC} Environnement virtuel déjà existant"
fi
echo ""

# Activer l'environnement virtuel
echo "[4/5] Activation de l'environnement virtuel..."
source venv/bin/activate
echo -e "${GREEN}✓${NC} Environnement activé"
echo ""

# Installer les dépendances
echo "[5/5] Installation des dépendances Python..."
echo "(Cela peut prendre quelques minutes...)"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}[ERREUR]${NC} Problème lors de l'installation des dépendances"
    exit 1
fi

echo ""
echo "========================================================================"
echo -e "${GREEN}   Installation terminée avec succès!${NC}"
echo "========================================================================"
echo ""
echo "Prochaines étapes:"
echo ""
echo "1. Configurez votre token API Bexio:"
echo "   cp .env.example .env"
echo "   nano .env  # ou vim .env"
echo ""
echo "2. Testez la connexion:"
echo "   ./run_test.sh"
echo ""
echo "3. Lancez l'extraction:"
echo "   ./run_extraction.sh"
echo ""
echo "4. Ou utilisez le menu interactif:"
echo "   ./menu.sh"
echo ""
echo "Documentation complète dans: docs/GUIDE_INSTALLATION.md"
echo ""
