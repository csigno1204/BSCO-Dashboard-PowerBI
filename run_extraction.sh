#!/bin/bash
# Script rapide pour lancer l'extraction (Linux/Mac)

echo ""
echo "========================================================================"
echo "   Extraction des Données Bexio"
echo "========================================================================"
echo ""

# Activer l'environnement virtuel si disponible
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# Lancer le pipeline
python scripts/run_pipeline.py

echo ""
echo "========================================================================"
echo "Pour importer dans Power BI:"
echo "1. Ouvrez Power BI Desktop"
echo "2. Obtenir des données → Excel"
echo "3. Sélectionnez le fichier généré dans le dossier 'data/'"
echo "========================================================================"
echo ""
