================================================================================
  DASHBOARD BEXIO → POWER BI
  Guide d'Installation Rapide
================================================================================

VERSION : 1.0.0
DATE    : Janvier 2025

================================================================================
  ⚡ INSTALLATION EN 3 MINUTES
================================================================================

1. DOUBLE-CLIQUEZ sur "BexioDashboard_Setup.exe"

2. SUIVEZ l'assistant d'installation :
   - Choisissez votre langue (Français, English, Deutsch, Italiano)
   - Acceptez la licence
   - Choisissez le dossier d'installation
   - Cochez les options souhaitées :
     * Icône sur le bureau (optionnel)
     * Installer Power BI Desktop (cochez si vous ne l'avez pas)

3. CLIQUEZ sur "Installer"

4. PATIENTEZ 1-2 minutes

5. C'EST PRÊT ! Lancez l'application depuis le Menu Démarrer

================================================================================
  📋 PRÉREQUIS
================================================================================

✅ Windows 10 ou 11 (64-bit)
✅ ~100 MB d'espace disque
✅ Connexion Internet (pour extraction Bexio)
✅ Compte Bexio avec Token API

❌ Python N'EST PAS nécessaire (déjà inclus dans l'exe)
❌ pip N'EST PAS nécessaire (toutes les dépendances incluses)

================================================================================
  🎯 APRÈS L'INSTALLATION
================================================================================

1. LANCEZ l'application :
   Menu Démarrer → "Dashboard Bexio Power BI"

2. CONFIGUREZ votre connexion Bexio :
   - Cliquez sur "Configuration"
   - Entrez votre Token API Bexio
   - Entrez votre Organisation ID
   - Cliquez sur "Tester la connexion"

3. EFFECTUEZ votre première extraction :
   - Cliquez sur "Extraire les données"
   - Patientez quelques secondes
   - Les données sont sauvegardées dans "data/"

4. IMPORTEZ dans Power BI :
   - Ouvrez Power BI Desktop
   - "Obtenir les données" → "Fichier" → "Excel"
   - Sélectionnez votre extraction dans "data/"
   - Chargez les tables

================================================================================
  🔧 POWER BI DESKTOP
================================================================================

Si vous avez coché "Installer Power BI Desktop" :

- L'installeur DÉTECTE si Power BI est déjà installé
- Si NON, il TÉLÉCHARGE automatiquement (~600 MB)
- Puis vous PROPOSE de l'installer
- Durée totale : 5-10 minutes

Si vous ne l'avez pas coché :

- Téléchargez manuellement depuis :
  https://powerbi.microsoft.com/fr-fr/downloads/

================================================================================
  ❓ DÉPANNAGE
================================================================================

PROBLÈME : "Windows a protégé votre PC"
SOLUTION : Cliquez "Informations complémentaires" → "Exécuter quand même"

PROBLÈME : Antivirus bloque l'installation
SOLUTION : Ajoutez une exception pour "BexioDashboard_Setup.exe"

PROBLÈME : "Erreur d'installation - Accès refusé"
SOLUTION : Clic droit sur l'exe → "Exécuter en tant qu'administrateur"

PROBLÈME : L'application ne démarre pas
SOLUTION : 1. Vérifiez les logs dans "logs/app.log"
           2. Réinstallez l'application

================================================================================
  📚 DOCUMENTATION COMPLÈTE
================================================================================

Après installation, consultez :

C:\Program Files\Dashboard Bexio Power BI\docs\

Guides disponibles :
- INSTALLATION_UTILISATEUR.md - Guide complet pour utilisateurs finaux
- USAGE.md                    - Utilisation détaillée
- FEATURES.md                 - Liste des fonctionnalités
- COMPARATEUR.md              - Comparateur de données
- FAQ.md                      - Questions fréquentes
- TROUBLESHOOTING.md          - Dépannage avancé

================================================================================
  🔒 SÉCURITÉ
================================================================================

✅ Vos données restent SUR VOTRE MACHINE
✅ Pas de stockage cloud
✅ Pas d'envoi de données à des tiers
✅ Token API stocké localement

IMPORTANT : Protégez votre fichier .env (ne le partagez jamais)

================================================================================
  🔄 MISE À JOUR
================================================================================

Pour mettre à jour vers une nouvelle version :

1. NE DÉSINSTALLEZ PAS l'ancienne version
2. Lancez simplement le nouveau "BexioDashboard_Setup.exe"
3. L'installeur remplace l'ancienne version
4. Vos données sont PRÉSERVÉES automatiquement

================================================================================
  🗑️ DÉSINSTALLATION
================================================================================

Panneau de configuration → Programmes → "Dashboard Bexio Power BI" → Désinstaller

L'assistant vous demande si vous voulez supprimer vos données :
- OUI : Supprime tout (extractions, logs, configs)
- NON : Garde vos données (utile si vous réinstallez plus tard)

================================================================================
  📞 SUPPORT
================================================================================

Documentation : C:\Program Files\Dashboard Bexio Power BI\docs\
Logs          : C:\Program Files\Dashboard Bexio Power BI\logs\app.log
GitHub        : https://github.com/csigno1204/BSCO-Dashboard-PowerBI

================================================================================
  ✅ RÉCAPITULATIF
================================================================================

✅ Python et toutes les dépendances sont INCLUS dans l'exe
✅ Aucune installation manuelle de Python requise
✅ Aucune commande "pip install" nécessaire
✅ Double-clic → Ça fonctionne !

Pour les DÉVELOPPEURS qui veulent compiler l'application :
→ Consultez "docs/BUILD_INSTALLER.md"

================================================================================

© 2025 BSCO Solutions - Dashboard Bexio Power BI
Version 1.0.0

================================================================================
