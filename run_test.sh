#!/bin/bash
# Script de test de connexion API Bexio (Linux/Mac)

echo ""
echo "========================================================================"
echo "   Test de Connexion API Bexio"
echo "========================================================================"
echo ""

# Activer l'environnement virtuel si disponible
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# Lancer le script de test
python scripts/test_connection.py

echo ""
