@echo off
REM Menu interactif pour Windows
setlocal enabledelayedexpansion

:MENU
cls
echo.
echo ========================================================================
echo    Dashboard Bexio - Power BI - Menu Principal
echo ========================================================================
echo.
echo    1. Installer les dependances
echo    2. Tester la connexion API
echo    3. Generer des donnees de demonstration
echo    4. Extraire les donnees depuis Bexio
echo    5. Transformer les donnees en Excel
echo    6. Pipeline complet (extraction + transformation)
echo    7. Ouvrir le dossier des donnees
echo    8. Voir la documentation
echo    9. Quitter
echo.
echo ========================================================================
echo.

set /p choice="Votre choix (1-9): "

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto TEST
if "%choice%"=="3" goto DEMO
if "%choice%"=="4" goto EXTRACT
if "%choice%"=="5" goto TRANSFORM
if "%choice%"=="6" goto PIPELINE
if "%choice%"=="7" goto OPENDIR
if "%choice%"=="8" goto DOCS
if "%choice%"=="9" goto END

echo Choix invalide!
timeout /t 2 >nul
goto MENU

:INSTALL
echo.
echo Installation des dependances...
echo.
call install.bat
pause
goto MENU

:TEST
echo.
echo Test de connexion API...
echo.
call run_test.bat
goto MENU

:DEMO
echo.
echo Generation des donnees de demonstration...
echo.
if exist "venv\Scripts\activate.bat" call venv\Scripts\activate.bat
python scripts\generate_demo_data.py
echo.
pause
goto MENU

:EXTRACT
echo.
echo Extraction depuis Bexio...
echo.
if exist "venv\Scripts\activate.bat" call venv\Scripts\activate.bat
python scripts\bexio_extractor.py
echo.
pause
goto MENU

:TRANSFORM
echo.
echo Transformation des donnees...
echo.
if exist "venv\Scripts\activate.bat" call venv\Scripts\activate.bat
python scripts\data_transformer.py
echo.
pause
goto MENU

:PIPELINE
echo.
echo Pipeline complet...
echo.
call run_extraction.bat
goto MENU

:OPENDIR
echo.
echo Ouverture du dossier data...
start explorer data
goto MENU

:DOCS
echo.
echo Documentation:
echo.
echo  - README.md                      (Vue d'ensemble)
echo  - QUICKSTART.md                  (Demarrage rapide)
echo  - docs\GUIDE_INSTALLATION.md     (Installation detaillee)
echo  - docs\GUIDE_DASHBOARDS.md       (Templates dashboards)
echo  - docs\API_REFERENCE.md          (Reference API)
echo.
echo Ouvrir README.md? (O/N)
set /p open="Votre choix: "
if /i "%open%"=="O" start README.md
goto MENU

:END
echo.
echo Au revoir!
timeout /t 1 >nul
exit /b 0
