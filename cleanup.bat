@echo off
REM ============================================================================
REM Script de nettoyage pour la désinstallation
REM Supprime les fichiers temporaires et logs (optionnel)
REM ============================================================================

REM Ce script est exécuté automatiquement lors de la désinstallation
REM Il ne supprime QUE les fichiers temporaires, pas les données utilisateur

echo Nettoyage des fichiers temporaires...

REM Supprimer les fichiers .pyc (cache Python)
if exist "%~dp0*.pyc" del /s /q "%~dp0*.pyc" 2>nul

REM Supprimer les dossiers __pycache__
for /d /r "%~dp0" %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d" 2>nul

REM Supprimer les fichiers temporaires dans temp\
if exist "%~dp0temp\*" del /s /q "%~dp0temp\*" 2>nul

REM Note: Les fichiers data\, logs\, backups\ sont conservés
REM L'utilisateur choisit s'il veut les supprimer via l'installeur

echo Nettoyage terminé.
exit /b 0
