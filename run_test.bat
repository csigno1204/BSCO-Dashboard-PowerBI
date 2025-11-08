@echo off
REM Script de test de connexion API Bexio (Windows)

echo.
echo ========================================================================
echo    Test de Connexion API Bexio
echo ========================================================================
echo.

REM Activer l'environnement virtuel si disponible
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Lancer le script de test
python scripts\test_connection.py

echo.
pause
