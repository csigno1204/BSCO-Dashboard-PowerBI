# 📦 Guide d'Installation - Utilisateur Final

## ⚡ Installation Rapide (3 minutes)

### Étape 1 : Télécharger l'installeur

Téléchargez le fichier :
```
BexioDashboard_Setup.exe
```

**Taille :** ~100 MB
**Contenu :** Tout est inclus ! Python, toutes les dépendances, l'application complète.

---

### Étape 2 : Lancer l'installation

1. **Double-cliquez** sur `BexioDashboard_Setup.exe`
2. Windows peut afficher un avertissement de sécurité → Cliquez sur **"Exécuter quand même"**
3. L'assistant d'installation s'ouvre

---

### Étape 3 : Suivre l'assistant

L'assistant vous guidera à travers 5 étapes simples :

#### 🌍 **1. Choix de la langue**
- Français 🇫🇷
- English 🇬🇧
- Deutsch 🇩🇪
- Italiano 🇮🇹

#### 📄 **2. Accepter la licence**
- Lisez et acceptez les conditions d'utilisation

#### 📂 **3. Choisir le dossier d'installation**
- Par défaut : `C:\Program Files\Dashboard Bexio Power BI`
- Vous pouvez changer si nécessaire

#### ✅ **4. Options d'installation**

**Icônes (optionnel) :**
- [ ] Créer une icône sur le bureau
- [ ] Créer une icône dans la barre de lancement rapide
- [ ] Lancer au démarrage de Windows

**Composants optionnels :**
- [ ] **Télécharger et installer Power BI Desktop** ⬅️ COCHEZ CECI si vous n'avez pas Power BI !

**Important :** Si vous cochez "Installer Power BI Desktop", l'installeur va :
1. Détecter si Power BI est déjà installé
2. Si non, télécharger automatiquement Power BI Desktop (~600 MB)
3. Vous proposer de l'installer automatiquement
4. Total : ~5-10 minutes pour Power BI

#### ⏳ **5. Installation en cours**
- L'installeur copie tous les fichiers
- Crée les raccourcis
- Configure l'application
- **Durée :** 30 secondes à 2 minutes

---

### Étape 4 : Terminer l'installation

À la fin, l'installeur vous propose :
- ✅ **Lancer Dashboard Bexio Power BI**
- ✅ Lire le guide d'installation

**Résultat :**
- ✅ Application installée dans `C:\Program Files\Dashboard Bexio Power BI`
- ✅ Raccourcis créés dans le Menu Démarrer
- ✅ (Optionnel) Icône sur le bureau
- ✅ (Optionnel) Power BI Desktop installé

---

## 🎯 Après l'installation

### Premier lancement

1. **Lancez l'application** depuis :
   - Menu Démarrer → "Dashboard Bexio Power BI"
   - OU l'icône sur le bureau (si créée)

2. **L'assistant de configuration** s'ouvre automatiquement

3. **Configurez votre connexion Bexio :**
   - Entrez votre **Token API Bexio**
   - Entrez votre **Organisation ID**
   - Cliquez sur **"Tester la connexion"**

4. **C'est prêt !**
   - Effectuez votre première extraction
   - Les données seront sauvegardées dans `data/`
   - Importez-les ensuite dans Power BI

---

## 📋 Configuration Détaillée

### Comment obtenir votre Token API Bexio ?

1. Connectez-vous à votre compte Bexio
2. Allez dans **"Paramètres"** → **"API"**
3. Cliquez sur **"Créer un nouveau token"**
4. Copiez le token (format : `bexio-...`)
5. Collez-le dans l'application

### Configuration du fichier .env

L'application utilise un fichier `.env` pour stocker vos paramètres.

**Localisation :**
```
C:\Program Files\Dashboard Bexio Power BI\.env
```

**Contenu minimal :**
```env
BEXIO_TOKEN=votre_token_ici
BEXIO_ORG_ID=votre_org_id_ici
```

**Vous pouvez éditer ce fichier** avec n'importe quel éditeur de texte (Notepad, Notepad++, etc.)

---

## 🔧 Dépannage

### Problème 1 : "Windows a protégé votre PC"

**Cause :** Windows SmartScreen bloque les applications non signées numériquement.

**Solution :**
1. Cliquez sur **"Informations complémentaires"**
2. Cliquez sur **"Exécuter quand même"**

**Note :** C'est un faux positif. L'application est sûre.

---

### Problème 2 : L'antivirus bloque l'installation

**Cause :** Certains antivirus détectent PyInstaller comme suspect (faux positif).

**Solution :**
1. Ajoutez une **exception** dans votre antivirus
2. OU désactivez temporairement l'antivirus pendant l'installation
3. Puis réactivez-le

---

### Problème 3 : "Erreur d'installation - Accès refusé"

**Cause :** Droits administrateur requis.

**Solution :**
1. Faites un **clic droit** sur `BexioDashboard_Setup.exe`
2. Cliquez sur **"Exécuter en tant qu'administrateur"**
3. Acceptez la demande de privilèges

---

### Problème 4 : Power BI Desktop ne s'installe pas

**Cause :** Échec du téléchargement ou installation Power BI.

**Solution :**
1. Téléchargez Power BI manuellement depuis :
   - https://powerbi.microsoft.com/fr-fr/downloads/
2. Installez-le normalement
3. Puis relancez l'installation de Dashboard Bexio

---

### Problème 5 : L'application ne démarre pas

**Solutions :**

1. **Vérifiez les logs :**
   ```
   C:\Program Files\Dashboard Bexio Power BI\logs\app.log
   ```

2. **Réinstallez l'application :**
   - Désinstallez depuis le Panneau de configuration
   - Réinstallez avec `BexioDashboard_Setup.exe`

3. **Contactez le support** avec le fichier `app.log`

---

## 🔄 Mise à jour

### Comment mettre à jour vers une nouvelle version ?

**Méthode recommandée :**
1. **Ne désinstallez PAS** l'ancienne version
2. Lancez simplement le **nouveau `BexioDashboard_Setup.exe`**
3. L'installeur détecte l'ancienne version
4. Propose de la remplacer
5. Vos données (`data/`, `logs/`, `configs/`) sont **préservées** automatiquement

**Méthode manuelle :**
1. Désinstallez l'ancienne version (Panneau de configuration)
2. **IMPORTANT :** Choisissez **"Non"** quand on vous demande de supprimer les données
3. Installez la nouvelle version
4. Vos données sont récupérées automatiquement

---

## 🗑️ Désinstallation

### Comment désinstaller complètement l'application ?

**Méthode 1 : Panneau de configuration**
1. Ouvrez **"Panneau de configuration"** → **"Programmes et fonctionnalités"**
2. Cherchez **"Dashboard Bexio Power BI"**
3. Cliquez sur **"Désinstaller"**
4. L'assistant de désinstallation vous demande :
   - **"Voulez-vous supprimer vos données ?"**
   - **Oui :** Supprime tout (extractions, logs, configs)
   - **Non :** Garde vos données (utile si vous réinstallez plus tard)

**Méthode 2 : Menu Démarrer**
1. Menu Démarrer → **"Dashboard Bexio Power BI"**
2. Cliquez sur **"Désinstaller Dashboard Bexio Power BI"**
3. Suivez l'assistant

**Après désinstallation :**
- Tous les fichiers du programme sont supprimés
- Les raccourcis sont supprimés
- (Optionnel) Vos données sont supprimées

---

## 📊 Utilisation avec Power BI

### Importer les données extraites dans Power BI

1. **Lancez Power BI Desktop**

2. **Créez un nouveau rapport**

3. **Obtenez les données :**
   - Cliquez sur **"Obtenir les données"** → **"Fichier"** → **"Excel"**
   - Naviguez vers :
     ```
     C:\Program Files\Dashboard Bexio Power BI\data\
     ```
   - Sélectionnez votre fichier d'extraction (format : `bexio_extraction_YYYY-MM-DD.xlsx`)

4. **Sélectionnez les tables à importer :**
   - Contacts
   - Projets
   - Tâches
   - Factures
   - Paiements
   - (Toutes les autres tables disponibles)

5. **Cliquez sur "Charger"**

6. **Vos données sont maintenant dans Power BI !**

**Pour aller plus loin :**
- Consultez les exemples DAX : `powerbi/DAX_Measures.dax`
- Consultez les exemples Power Query : `powerbi/PowerQuery_Examples.m`
- Consultez le guide complet : `docs/USAGE.md`

---

## ❓ Questions Fréquentes

### Q1 : Ai-je besoin d'installer Python ?

**Non !** Python est **déjà inclus** dans l'exe. Vous n'avez **rien à installer** manuellement.

---

### Q2 : Puis-je utiliser l'application sans Power BI ?

**Oui !** L'application fonctionne indépendamment. Elle extrait et transforme les données Bexio.

Power BI est seulement nécessaire pour **visualiser** les données extraites.

---

### Q3 : L'application fonctionne-t-elle hors ligne ?

**Partiellement :**
- ❌ L'extraction nécessite une connexion Internet (pour accéder à l'API Bexio)
- ✅ La transformation et export fonctionnent hors ligne
- ✅ Le comparateur de données fonctionne hors ligne

---

### Q4 : Mes données sont-elles sécurisées ?

**Oui !**
- Vos données restent **sur votre machine**
- Pas de stockage cloud
- Pas d'envoi de données à des tiers
- Token API stocké localement dans `.env`

**Recommandation :** Protégez votre fichier `.env` (ne le partagez pas).

---

### Q5 : Puis-je installer sur plusieurs ordinateurs ?

**Oui !** Vous pouvez installer l'application sur autant d'ordinateurs que nécessaire.

Chaque installation nécessite son propre fichier `.env` avec le token API.

---

### Q6 : Quelle version de Windows est requise ?

**Compatible avec :**
- ✅ Windows 10 (64-bit)
- ✅ Windows 11 (64-bit)
- ⚠️ Windows 8.1 (64-bit) - Non testé mais devrait fonctionner
- ❌ Windows 7 (non supporté par Python 3.11)

---

### Q7 : Combien d'espace disque faut-il ?

**Installation :**
- Application : ~100 MB
- Power BI Desktop (optionnel) : ~600 MB
- Données : Variable selon volume (généralement 10-100 MB)

**Total recommandé :** 1-2 GB d'espace libre

---

## 📞 Support

### Besoin d'aide ?

**Documentation complète :**
```
C:\Program Files\Dashboard Bexio Power BI\docs\
```

**Guides disponibles :**
- `INSTALLATION.md` - Installation détaillée (développeurs)
- `USAGE.md` - Guide d'utilisation complet
- `FEATURES.md` - Liste de toutes les fonctionnalités
- `FAQ.md` - Questions fréquentes
- `TROUBLESHOOTING.md` - Dépannage avancé
- `COMPARATEUR.md` - Guide du comparateur de données
- `VALIDATION_DONNEES.md` - Validation des données
- `ALERTS.md` - Système d'alertes
- `EXPORT.md` - Options d'export

**Logs d'application :**
```
C:\Program Files\Dashboard Bexio Power BI\logs\app.log
```

**Support GitHub :**
- https://github.com/csigno1204/BSCO-Dashboard-PowerBI/issues

---

## ✅ Résumé

**Installation complète en 3 minutes :**
1. Double-clic sur `BexioDashboard_Setup.exe`
2. Suivre l'assistant (cocher "Installer Power BI" si besoin)
3. Lancer l'application et configurer votre token API Bexio

**Aucune connaissance technique requise !**

---

**Mis à jour :** Janvier 2025
**Version :** 1.0.0

© 2025 BSCO Solutions - Dashboard Bexio Power BI
