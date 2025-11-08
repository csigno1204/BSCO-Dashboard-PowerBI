# 🏗️ Guide de Construction de l'Installeur Windows (.exe)

Ce guide explique comment créer un installeur professionnel Windows (.exe) pour le Dashboard Bexio → Power BI.

---

## 📋 Vue d'Ensemble

L'installeur Windows permet de distribuer votre application comme un logiciel professionnel:
- ✅ Installation en 1 clic (double-clic sur le .exe)
- ✅ Pas besoin de Python installé sur la machine cible
- ✅ Créé automatiquement les raccourcis (Bureau, Menu Démarrer)
- ✅ Désinstallation propre via Panneau de configuration
- ✅ Interface d'installation professionnelle

**Résultat:** Un fichier `BexioDashboard_Setup_v1.0.0.exe` (~50-100 MB) prêt à distribuer.

---

## 🎯 Prérequis

### Sur Votre Machine de Développement

Vous aurez besoin de:

1. **Python 3.8+** installé et dans le PATH
   - Vérifiez: `python --version`
   - Téléchargement: https://www.python.org/downloads/

2. **Inno Setup 6** (gratuit, open-source)
   - Téléchargement: https://jrsoftware.org/isdl.php
   - Installer la version complète (~3 MB)

3. **Environnement virtuel Python** (créé automatiquement si absent)

4. **Espace disque:** ~500 MB libre (pour la compilation)

---

## 🚀 Méthode Rapide (Automatique)

### Option 1: Script Automatique

**C'est la méthode recommandée** - Tout est automatisé en 1 commande.

```bash
# Depuis la racine du projet
build_installer.bat
```

Le script va:
1. ✅ Vérifier Python
2. ✅ Créer/activer l'environnement virtuel
3. ✅ Installer les dépendances (PyInstaller, etc.)
4. ✅ Nettoyer les builds précédents
5. ✅ Compiler l'application en .exe (PyInstaller)
6. ✅ Créer l'installeur professionnel (Inno Setup)

**Durée:** 5-10 minutes selon votre machine.

**Résultat:**
```
dist/
├── BexioDashboard/              ← Application compilée
│   └── BexioDashboard.exe
└── installer/
    └── BexioDashboard_Setup_v1.0.0.exe  ← INSTALLEUR FINAL
```

---

## 🛠️ Méthode Manuelle (Étape par Étape)

Si vous préférez comprendre chaque étape ou si le script automatique échoue:

### Étape 1: Préparer l'Environnement

```bash
# Créer l'environnement virtuel
python -m venv venv

# L'activer
venv\Scripts\activate.bat

# Mettre à jour pip
python -m pip install --upgrade pip

# Installer les dépendances
pip install -r requirements.txt
```

### Étape 2: Installer PyInstaller

```bash
pip install pyinstaller
```

### Étape 3: Compiler l'Application

```bash
# Nettoyer les builds précédents
rmdir /s /q dist\BexioDashboard
rmdir /s /q build

# Compiler avec PyInstaller
pyinstaller installer\BexioDashboard.spec
```

**Ce que PyInstaller fait:**
- Analyse les dépendances Python
- Empaquète Python + modules + votre code dans un .exe
- Crée un dossier `dist\BexioDashboard\` avec l'application

**Résultat:**
```
dist\BexioDashboard\
├── BexioDashboard.exe          ← Exécutable principal
├── _internal\                   ← Bibliothèques Python empaquetées
│   ├── python3XX.dll
│   ├── pandas\
│   ├── tkinter\
│   └── ...
├── scripts\                     ← Vos scripts Python (pour utilisateurs avancés)
├── docs\                        ← Documentation
└── ...
```

### Étape 4: Tester l'Exécutable

```bash
# Lancer l'application compilée
dist\BexioDashboard\BexioDashboard.exe
```

**Vérifiez:**
- ✅ L'interface GUI s'ouvre
- ✅ Pas d'erreurs de modules manquants
- ✅ Les fonctionnalités de base fonctionnent

**Si erreur "module not found":**
- Ajoutez le module manquant dans `installer\BexioDashboard.spec` → `hiddenimports=[...]`
- Recompilez

### Étape 5: Créer l'Installeur avec Inno Setup

**Méthode A - Interface Graphique:**

1. Ouvrez **Inno Setup Compiler**
2. **File** → **Open** → Chargez `installer\BexioDashboard_Setup.iss`
3. **Build** → **Compile** (ou F9)
4. Attendez la compilation (~1-2 minutes)
5. L'installeur est créé dans `dist\installer\`

**Méthode B - Ligne de Commande:**

```bash
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer\BexioDashboard_Setup.iss
```

**Résultat:**
```
dist\installer\
└── BexioDashboard_Setup_v1.0.0.exe  ← Installeur final (~50-100 MB)
```

---

## 📦 Structure de l'Installeur

L'installeur Inno Setup créé va:

### Lors de l'Installation

1. **Bienvenue** - Affiche l'écran de bienvenue
2. **Licence** - Affiche le fichier LICENSE
3. **Destination** - Choix du dossier d'installation (défaut: `C:\Program Files\Dashboard Bexio Power BI\`)
4. **Composants** - Options:
   - ☑️ Créer icône Bureau
   - ☐ Créer icône Barre de lancement rapide
   - ☐ Lancer au démarrage de Windows
5. **Installation** - Copie des fichiers
6. **Fin** - Option pour lancer l'application

### Ce Qui Est Installé

```
C:\Program Files\Dashboard Bexio Power BI\
├── BexioDashboard.exe           ← Application principale
├── scripts\                      ← Scripts Python
├── docs\                         ← Documentation complète
├── powerbi\                      ← Fichiers DAX/Power Query
├── .env.example                  ← Template configuration
├── .env                          ← Créé automatiquement
├── alerts.yaml                   ← Configuration alertes
├── requirements.txt
├── README.md
├── LICENSE
└── data\                         ← Créé avec permissions
    logs\
    backups\
    configs\
```

### Raccourcis Créés

**Menu Démarrer:**
- Dashboard Bexio Power BI
- Configuration
- Documentation
- Guide d'Installation
- Guide d'Utilisation
- Validation des Données
- Désinstaller

**Bureau** (optionnel):
- Dashboard Bexio Power BI

**Démarrage Windows** (optionnel):
- Dashboard Bexio Power BI (minimisé)

### Registre Windows

L'installeur enregistre:
```
HKLM\SOFTWARE\BSCO Solutions\Dashboard Bexio Power BI\
├── InstallPath = C:\Program Files\...
└── Version = 1.0.0
```

---

## 🎨 Personnalisation de l'Installeur

### Changer la Version

Éditez `installer\BexioDashboard_Setup.iss` :

```iss
#define MyAppVersion "1.0.0"  ← Changez ici
```

Et `installer\version_info.txt` :

```python
filevers=(1, 0, 0, 0),  ← Changez ici
prodvers=(1, 0, 0, 0),  ← Changez ici
```

### Ajouter une Icône

1. Créez ou téléchargez une icône (.ico, 256x256 recommandé)
2. Placez-la dans `assets\icon.ico`
3. Le script PyInstaller l'utilisera automatiquement

**Outils gratuits pour créer des icônes:**
- IcoFX: https://icofx.ro/
- ConvertICO: https://convertico.com/

### Changer les Images de l'Installeur

**Banner (haut de l'installeur):**
- Fichier: `assets\installer_banner.bmp`
- Taille: 164x314 pixels
- Format: BMP 24-bit

**Petite icône (coin haut-gauche):**
- Fichier: `assets\installer_icon.bmp`
- Taille: 55x58 pixels
- Format: BMP 24-bit

### Ajouter/Retirer des Fichiers

Éditez `installer\BexioDashboard_Setup.iss`, section `[Files]`:

```iss
; Ajouter un fichier
Source: "..\mon_fichier.txt"; DestDir: "{app}"; Flags: ignoreversion

; Ajouter un dossier complet
Source: "..\mon_dossier\*"; DestDir: "{app}\mon_dossier"; Flags: ignoreversion recursesubdirs
```

---

## 🐛 Dépannage

### Erreur: "Python n'est pas installé"

**Solution:**
1. Installez Python depuis https://www.python.org/downloads/
2. ☑️ Cochez "Add Python to PATH" pendant l'installation
3. Redémarrez votre terminal

### Erreur: "Module 'XXX' not found" lors de l'exécution

**Cause:** PyInstaller n'a pas détecté une dépendance.

**Solution:**
1. Éditez `installer\BexioDashboard.spec`
2. Ajoutez le module dans `hiddenimports`:

```python
hiddenimports=[
    'tkinter',
    'pandas',
    'XXX',  # ← Ajoutez le module manquant ici
],
```

3. Recompilez: `pyinstaller installer\BexioDashboard.spec`

### Erreur: "Inno Setup not found"

**Solution:**
1. Téléchargez Inno Setup: https://jrsoftware.org/isdl.php
2. Installez-le (acceptez les options par défaut)
3. Relancez `build_installer.bat`

### L'Exécutable est Très Gros (>200 MB)

**Normal** - Python empaquetté + toutes les dépendances (pandas, numpy, etc.) = ~50-150 MB.

**Pour réduire la taille:**

1. **Exclure modules non utilisés** dans `BexioDashboard.spec`:

```python
excludes=[
    'IPython',
    'notebook',
    'matplotlib',  # Si vous ne générez pas de graphiques
    'PIL',         # Si pas d'images
],
```

2. **Activer UPX compression** (déjà activé):

```python
upx=True,
```

3. **Un seul fichier .exe** (plus lent au démarrage):

```python
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,  # ← Décommenter
    a.zipfiles,  # ← Décommenter
    a.datas,     # ← Décommenter
    [],
    name='BexioDashboard',
    onefile=True,  # ← Ajouter
    ...
)
```

### L'Installeur Ne Se Lance Pas

**Vérifiez:**
1. L'antivirus ne bloque pas l'installeur
2. Vous avez les droits administrateur
3. Le fichier .exe n'est pas corrompu (retéléchargez)

**Si "Windows a protégé votre ordinateur":**
- Cliquez sur "Informations complémentaires"
- Puis "Exécuter quand même"

*Note:* Pour éviter cet avertissement, vous pouvez signer numériquement l'installeur (certificat Code Signing ~200-400 CHF/an).

### Erreur lors de la Désinstallation

**Solution:**
1. Allez dans `C:\Program Files\Dashboard Bexio Power BI\`
2. Lancez `unins000.exe` manuellement
3. Ou utilisez: Panneau de configuration → Désinstaller un programme

---

## 📤 Distribution de l'Installeur

Une fois créé, vous pouvez distribuer `BexioDashboard_Setup_v1.0.0.exe` :

### Méthode 1: Téléchargement Direct

1. **GitHub Releases**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   # Puis créer une Release sur GitHub et uploader le .exe
   ```

2. **Google Drive / Dropbox / OneDrive**
   - Uploadez le .exe
   - Partagez le lien

3. **Votre site web**
   ```html
   <a href="downloads/BexioDashboard_Setup_v1.0.0.exe" download>
     Télécharger Dashboard Bexio (50 MB)
   </a>
   ```

### Méthode 2: Clé USB

- Copiez simplement le .exe sur une clé USB
- Donnez-la au client
- Le client double-clique pour installer

### Méthode 3: Réseau d'Entreprise

- Placez le .exe sur un partage réseau
- Les utilisateurs l'installent depuis le réseau

### Signature Numérique (Optionnel - Professionnel)

Pour éviter l'avertissement "Éditeur inconnu" de Windows:

1. Achetez un certificat Code Signing:
   - Digicert: ~300 CHF/an
   - Sectigo: ~250 CHF/an
   - SwissSign: ~400 CHF/an

2. Signez l'exécutable:
   ```bash
   signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com BexioDashboard_Setup_v1.0.0.exe
   ```

3. Vos utilisateurs verront: "Vérifié par: BSCO Solutions"

---

## 🔄 Mise à Jour de l'Application

### Version Mineure (1.0.0 → 1.0.1)

1. Modifiez le code source
2. Changez la version:
   - `installer\BexioDashboard_Setup.iss` → `#define MyAppVersion "1.0.1"`
   - `installer\version_info.txt` → `filevers=(1, 0, 1, 0)`
3. Recompilez: `build_installer.bat`
4. Distribuez le nouvel installeur

**Les utilisateurs devront:**
- Désinstaller l'ancienne version
- Installer la nouvelle
- OU l'installeur peut détecter et proposer de mettre à jour

### Auto-Update (Futur)

Pour l'auto-mise à jour automatique, vous pouvez implémenter:

```python
# scripts/auto_updater.py
import requests

def check_for_updates():
    response = requests.get('https://yourdomain.com/version.json')
    latest_version = response.json()['version']
    current_version = '1.0.0'

    if latest_version > current_version:
        # Télécharger et installer
        pass
```

---

## 📊 Comparaison des Options de Distribution

| Méthode | Avantages | Inconvénients | Recommandé pour |
|---------|-----------|---------------|-----------------|
| **Installeur .exe** | ✅ Professionnel<br>✅ 1 clic<br>✅ Désinstallation propre | ⚠️ Fichier lourd (50-100 MB)<br>⚠️ Compilation longue | Production, clients finaux |
| **Application portable** | ✅ Léger<br>✅ Pas d'installation<br>✅ Sur clé USB | ⚠️ Pas de raccourcis<br>⚠️ Moins professionnel | Tests, démos |
| **Scripts Python** | ✅ Très léger<br>✅ Modifiable<br>✅ Open-source | ⚠️ Python requis<br>⚠️ Installation manuelle | Développeurs, utilisateurs avancés |
| **Docker** | ✅ Isolation<br>✅ Reproductible<br>✅ Multi-plateforme | ⚠️ Docker requis<br>⚠️ Courbe d'apprentissage | DevOps, serveurs |

---

## 🎯 Checklist Avant Distribution

Avant de distribuer l'installeur, vérifiez:

- [ ] Version correcte dans tous les fichiers
- [ ] Licence à jour (LICENSE)
- [ ] Documentation complète (README.md, docs/)
- [ ] .env.example sans données sensibles
- [ ] Icône de l'application (assets/icon.ico)
- [ ] Test d'installation sur machine propre
- [ ] Test de désinstallation
- [ ] Toutes les fonctionnalités fonctionnent
- [ ] Pas d'erreurs dans les logs
- [ ] Documentation utilisateur claire
- [ ] Support / contact fourni
- [ ] CHANGELOG.md à jour

---

## 🚀 Workflow Complet de Release

Processus recommandé pour créer une nouvelle version:

```bash
# 1. Finaliser le code
git add .
git commit -m "feat: Version 1.0.0 ready for release"

# 2. Mettre à jour la version
# Éditez installer\BexioDashboard_Setup.iss
# Éditez installer\version_info.txt

# 3. Créer le tag Git
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"

# 4. Compiler l'installeur
build_installer.bat

# 5. Tester l'installeur
dist\installer\BexioDashboard_Setup_v1.0.0.exe

# 6. Créer le CHANGELOG
# Éditez CHANGELOG.md

# 7. Push sur GitHub
git push origin main
git push origin v1.0.0

# 8. Créer la Release GitHub
# Allez sur GitHub → Releases → New Release
# Tag: v1.0.0
# Title: Dashboard Bexio Power BI v1.0.0
# Description: Voir CHANGELOG.md
# Attachez: BexioDashboard_Setup_v1.0.0.exe

# 9. Communiquer
# Envoyez email aux clients/utilisateurs
```

---

## 📞 Ressources

### Documentation Officielle

- **PyInstaller:** https://pyinstaller.readthedocs.io/
- **Inno Setup:** https://jrsoftware.org/isinfo.php
- **Tkinter:** https://docs.python.org/3/library/tkinter.html

### Outils Utiles

- **Resource Hacker** (éditer .exe): http://www.angusj.com/resourcehacker/
- **Dependency Walker** (analyser DLL): http://www.dependencywalker.com/
- **NSIS** (alternative à Inno Setup): https://nsis.sourceforge.io/

### Support

- **Issues GitHub:** https://github.com/csigno1204/BSCO-Dashboard-PowerBI/issues
- **Documentation projet:** `docs/`
- **FAQ:** `docs/FAQ.md`

---

## ✅ Résumé

**Pour créer l'installeur Windows .exe:**

```bash
# Commande unique
build_installer.bat
```

**Résultat:** `dist\installer\BexioDashboard_Setup_v1.0.0.exe`

**Distribution:** Envoyez le .exe à vos clients → Double-clic → Installation automatique

**C'est tout ! 🎉**

---

**Mis à jour:** Janvier 2025
