@echo off
REM ============================================================================
REM Script de création de l'installeur Windows (.exe)
REM Dashboard Bexio → Power BI
REM ============================================================================

SETLOCAL EnableDelayedExpansion

echo.
echo ========================================================================
echo    Construction de l'installeur Windows
echo    Dashboard Bexio - Power BI
echo ========================================================================
echo.

REM Couleurs (si supporté)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM ============================================================================
REM Étape 0: Vérifications préalables
REM ============================================================================

echo %BLUE%[1/6] Vérification de l'environnement...%NC%
echo.

REM Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERREUR]%NC% Python n'est pas installé ou n'est pas dans le PATH
    echo.
    echo Téléchargez Python depuis: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo %GREEN%✓%NC% Python détecté
python --version

REM Vérifier si l'environnement virtuel existe
if not exist "venv\Scripts\activate.bat" (
    echo %YELLOW%⚠%NC% Environnement virtuel non trouvé
    echo Création de l'environnement virtuel...
    python -m venv venv
    if errorlevel 1 (
        echo %RED%[ERREUR]%NC% Échec de création de l'environnement virtuel
        pause
        exit /b 1
    )
)

echo %GREEN%✓%NC% Environnement virtuel OK
echo.

REM ============================================================================
REM Étape 1: Activer l'environnement virtuel et installer dépendances
REM ============================================================================

echo %BLUE%[2/6] Installation des dépendances...%NC%
echo.

call venv\Scripts\activate.bat

REM Installer les dépendances de base
echo Installation des packages requis...
python -m pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt -q

if errorlevel 1 (
    echo %RED%[ERREUR]%NC% Échec d'installation des dépendances
    pause
    exit /b 1
)

echo %GREEN%✓%NC% Dépendances installées
echo.

REM ============================================================================
REM Étape 2: Installer PyInstaller
REM ============================================================================

echo %BLUE%[3/6] Installation de PyInstaller...%NC%
echo.

pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo Installation de PyInstaller...
    pip install pyinstaller
    if errorlevel 1 (
        echo %RED%[ERREUR]%NC% Échec d'installation de PyInstaller
        pause
        exit /b 1
    )
) else (
    echo PyInstaller est déjà installé
)

echo %GREEN%✓%NC% PyInstaller OK
echo.

REM ============================================================================
REM Étape 3: Nettoyer les builds précédents
REM ============================================================================

echo %BLUE%[4/6] Nettoyage des builds précédents...%NC%
echo.

if exist "dist\BexioDashboard" (
    echo Suppression de dist\BexioDashboard...
    rmdir /s /q "dist\BexioDashboard"
)

if exist "build" (
    echo Suppression de build...
    rmdir /s /q "build"
)

if exist "dist\installer" (
    echo Conservation des installeurs précédents dans dist\installer...
) else (
    echo Création du dossier dist\installer...
    mkdir "dist\installer"
)

echo %GREEN%✓%NC% Nettoyage terminé
echo.

REM ============================================================================
REM Étape 4: Compiler l'application avec PyInstaller
REM ============================================================================

echo %BLUE%[5/6] Compilation de l'application avec PyInstaller...%NC%
echo.
echo Ceci peut prendre plusieurs minutes...
echo.

REM Créer le dossier assets si nécessaire (pour l'icône)
if not exist "assets" mkdir assets

REM Compiler avec PyInstaller
pyinstaller --clean installer\BexioDashboard.spec

if errorlevel 1 (
    echo.
    echo %RED%[ERREUR]%NC% Échec de compilation avec PyInstaller
    echo.
    echo Vérifiez les erreurs ci-dessus et relancez le script.
    pause
    exit /b 1
)

echo.
echo %GREEN%✓%NC% Application compilée avec succès
echo %GREEN%✓%NC% Fichiers générés dans: dist\BexioDashboard\
echo.

REM Vérifier que l'exécutable a été créé
if not exist "dist\BexioDashboard\BexioDashboard.exe" (
    echo %RED%[ERREUR]%NC% L'exécutable n'a pas été créé
    pause
    exit /b 1
)

REM Afficher la taille
for %%I in ("dist\BexioDashboard\BexioDashboard.exe") do set size=%%~zI
set /a size_mb=!size! / 1048576
echo Taille de l'exécutable: !size_mb! MB
echo.

REM ============================================================================
REM Étape 5: Créer l'installeur avec Inno Setup (optionnel)
REM ============================================================================

echo %BLUE%[6/6] Création de l'installeur avec Inno Setup...%NC%
echo.

REM Chercher Inno Setup dans les emplacements communs
set "INNO_COMPILER="
set "INNO_PATHS=C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
set "INNO_PATHS=%INNO_PATHS%;C:\Program Files\Inno Setup 6\ISCC.exe"
set "INNO_PATHS=%INNO_PATHS%;C:\Program Files (x86)\Inno Setup 5\ISCC.exe"
set "INNO_PATHS=%INNO_PATHS%;C:\Program Files\Inno Setup 5\ISCC.exe"

for %%P in (%INNO_PATHS%) do (
    if exist "%%~P" (
        set "INNO_COMPILER=%%~P"
        goto :inno_found
    )
)

:inno_not_found
echo %YELLOW%⚠%NC% Inno Setup n'est pas installé
echo.
echo L'application a été compilée avec succès dans: dist\BexioDashboard\
echo.
echo %YELLOW%Pour créer un installeur professionnel:%NC%
echo 1. Téléchargez Inno Setup: https://jrsoftware.org/isdl.php
echo 2. Installez Inno Setup
echo 3. Relancez ce script
echo.
echo %BLUE%OU%NC%
echo.
echo Vous pouvez compiler manuellement:
echo 1. Ouvrez Inno Setup Compiler
echo 2. Chargez le fichier: installer\BexioDashboard_Setup.iss
echo 3. Cliquez sur "Compile"
echo.
goto :skip_inno

:inno_found
echo %GREEN%✓%NC% Inno Setup trouvé: %INNO_COMPILER%
echo.
echo Compilation de l'installeur...
echo.

"%INNO_COMPILER%" "installer\BexioDashboard_Setup.iss"

if errorlevel 1 (
    echo.
    echo %RED%[ERREUR]%NC% Échec de création de l'installeur Inno Setup
    echo.
    echo L'application a quand même été compilée dans: dist\BexioDashboard\
    pause
    exit /b 1
)

echo.
echo %GREEN%✓✓✓ SUCCÈS! Installeur créé avec succès%NC%
echo.

REM Trouver le fichier installeur créé
for %%F in ("dist\installer\BexioDashboard_Setup_*.exe") do (
    set "INSTALLER_FILE=%%~nxF"
    set "INSTALLER_SIZE=%%~zF"
)

if defined INSTALLER_FILE (
    set /a installer_mb=!INSTALLER_SIZE! / 1048576
    echo %GREEN%📦 Installeur:%NC% dist\installer\!INSTALLER_FILE!
    echo %GREEN%📊 Taille:%NC% !installer_mb! MB
) else (
    echo %YELLOW%Fichier installeur non trouvé dans dist\installer\%NC%
)

echo.

:skip_inno

REM ============================================================================
REM Résumé final
REM ============================================================================

echo.
echo ========================================================================
echo    Construction terminée
echo ========================================================================
echo.

if defined INSTALLER_FILE (
    echo %GREEN%✅ INSTALLEUR PROFESSIONNEL CRÉÉ%NC%
    echo.
    echo 📂 Fichier: dist\installer\!INSTALLER_FILE!
    echo 📊 Taille: !installer_mb! MB
    echo.
    echo %BLUE%Prochaines étapes:%NC%
    echo 1. Testez l'installeur sur une machine propre
    echo 2. Distribuez l'installeur à vos utilisateurs
    echo 3. L'installeur créera des raccourcis dans le menu Démarrer
    echo.
) else (
    echo %GREEN%✅ APPLICATION COMPILÉE%NC%
    echo.
    echo 📂 Dossier: dist\BexioDashboard\
    echo 📊 Taille: !size_mb! MB
    echo 🚀 Exécutable: dist\BexioDashboard\BexioDashboard.exe
    echo.
    echo %BLUE%Prochaines étapes:%NC%
    echo 1. Testez l'application: dist\BexioDashboard\BexioDashboard.exe
    echo 2. Distribuez le dossier complet "BexioDashboard"
    echo 3. OU installez Inno Setup et relancez ce script pour créer un installeur
    echo.
)

echo %YELLOW%Note:%NC% Pour créer une nouvelle version, modifiez:
echo - installer\BexioDashboard_Setup.iss (ligne #define MyAppVersion)
echo - installer\version_info.txt (filevers et prodvers)
echo.

pause
