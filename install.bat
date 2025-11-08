@echo off
REM ============================================================================
REM Script d'installation automatique - Dashboard Bexio PowerBI
REM Pour Windows
REM ============================================================================

echo.
echo ========================================================================
echo    Installation Dashboard Bexio - Power BI
echo ========================================================================
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Python n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Telechargez Python depuis: https://www.python.org/downloads/
    echo IMPORTANT: Cochez "Add Python to PATH" lors de l'installation
    echo.
    pause
    exit /b 1
)

echo [1/5] Python detecte
python --version
echo.

REM Vérifier si pip est installé
python -m pip --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] pip n'est pas installe
    echo Installation de pip...
    python -m ensurepip --default-pip
)

echo [2/5] pip detecte
python -m pip --version
echo.

REM Créer un environnement virtuel (optionnel mais recommandé)
echo [3/5] Creation de l'environnement virtuel...
if not exist "venv" (
    python -m venv venv
    echo Environnement virtuel cree
) else (
    echo Environnement virtuel deja existant
)
echo.

REM Activer l'environnement virtuel
echo [4/5] Activation de l'environnement virtuel...
call venv\Scripts\activate.bat
echo.

REM Installer les dépendances
echo [5/5] Installation des dependances Python...
echo (Cela peut prendre quelques minutes...)
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo [ERREUR] Probleme lors de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo ========================================================================
echo    Installation terminee avec succes!
echo ========================================================================
echo.
echo Prochaines etapes:
echo.
echo 1. Configurez votre token API Bexio:
echo    - Copiez .env.example vers .env
echo    - Editez .env et ajoutez votre token
echo.
echo 2. Testez la connexion:
echo    run_test.bat
echo.
echo 3. Lancez l'extraction:
echo    run_extraction.bat
echo.
echo 4. Ou utilisez le menu interactif:
echo    menu.bat
echo.
echo Documentation complete dans: docs\GUIDE_INSTALLATION.md
echo.
pause
