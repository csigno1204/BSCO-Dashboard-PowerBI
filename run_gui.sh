#!/bin/bash
# Lance l'interface graphique

echo ""
echo "========================================================================"
echo "   Lancement de l'interface graphique"
echo "========================================================================"
echo ""

# Activer l'environnement virtuel si disponible
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# Lancer l'interface
python scripts/gui_app.py
