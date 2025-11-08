@echo off
REM Lance l'interface graphique

echo.
echo ========================================================================
echo    Lancement de l'interface graphique
echo ========================================================================
echo.

REM Activer l'environnement virtuel si disponible
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Lancer l'interface
python scripts\gui_app.py

pause
