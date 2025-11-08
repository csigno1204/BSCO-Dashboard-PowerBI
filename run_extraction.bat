@echo off
REM Script rapide pour lancer l'extraction (Windows)

echo.
echo ========================================================================
echo    Extraction des Donnees Bexio
echo ========================================================================
echo.

REM Activer l'environnement virtuel si disponible
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Lancer le pipeline
python scripts\run_pipeline.py

echo.
echo ========================================================================
echo Pour importer dans Power BI:
echo 1. Ouvrez Power BI Desktop
echo 2. Obtenir des donnees - Excel
echo 3. Selectionnez le fichier genere dans le dossier 'data\'
echo ========================================================================
echo.
pause
