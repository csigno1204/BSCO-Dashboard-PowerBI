# 🤖 Compilation Automatique de l'Installeur .exe

## 🎯 Problème Résolu

Vous n'avez **PAS besoin de Windows** pour créer l'installeur .exe !

GitHub Actions va compiler automatiquement l'installeur sur une machine Windows dans le cloud.

---

## ✨ Comment Ça Marche

### Méthode Automatique (Recommandée)

#### Option 1 : Via Tag Git (Release)

```bash
# 1. Créer un tag pour la version
git tag v1.0.0

# 2. Pousser le tag sur GitHub
git push origin v1.0.0

# 3. GitHub Actions compile automatiquement l'installeur
#    Attendez 5-10 minutes

# 4. Récupérez l'installeur dans GitHub Releases
#    https://github.com/csigno1204/BSCO-Dashboard-PowerBI/releases
```

**Résultat :**
- ✅ Installeur .exe créé automatiquement
- ✅ Publié dans GitHub Releases
- ✅ Prêt à télécharger et distribuer

#### Option 2 : Déclenchement Manuel

Si vous voulez compiler SANS créer de release :

1. Allez sur GitHub : https://github.com/csigno1204/BSCO-Dashboard-PowerBI
2. Cliquez sur **Actions** (onglet en haut)
3. Sélectionnez **"🏗️ Build Windows Installer"**
4. Cliquez sur **"Run workflow"** (bouton à droite)
5. Sélectionnez la branche (ex: `main`)
6. Cliquez sur **"Run workflow"** (bouton vert)

**Résultat :**
- ✅ Compilation dans GitHub Actions
- ✅ Artifacts téléchargeables (onglet Artifacts en bas)
- ⚠️ PAS de release automatique

---

## 📥 Récupérer l'Installeur Compilé

### Via GitHub Releases (Option 1)

1. Allez sur : https://github.com/csigno1204/BSCO-Dashboard-PowerBI/releases
2. Trouvez votre version (ex: `v1.0.0`)
3. Téléchargez `BexioDashboard_Setup_v1.0.0.exe`
4. ✅ Distribuez à vos clients !

### Via GitHub Actions Artifacts (Option 2)

1. Allez sur : https://github.com/csigno1204/BSCO-Dashboard-PowerBI/actions
2. Cliquez sur le workflow terminé (✅ vert)
3. Scrollez en bas → **Artifacts**
4. Téléchargez :
   - **BexioDashboard-Installer** (.exe installeur)
   - **BexioDashboard-Portable** (application portable)

---

## 🔄 Workflow Complet de Release

### Processus Recommandé

```bash
# 1. Finalisez votre code
git add .
git commit -m "feat: Nouvelle fonctionnalité X"
git push

# 2. Testez localement (si vous avez Windows)
# Sinon passez à l'étape 3

# 3. Mettez à jour la version
# Éditez installer/BexioDashboard_Setup.iss → MyAppVersion
# Éditez installer/version_info.txt → filevers
# Éditez CHANGELOG.md

git add installer/ CHANGELOG.md
git commit -m "chore: Bump version to 1.1.0"
git push

# 4. Créez le tag Git
git tag -a v1.1.0 -m "Release v1.1.0 - Description"

# 5. Poussez le tag
git push origin v1.1.0

# 6. ⏳ Attendez 5-10 minutes
#    GitHub Actions compile automatiquement

# 7. ✅ Vérifiez la Release
#    https://github.com/csigno1204/BSCO-Dashboard-PowerBI/releases

# 8. 📤 Partagez le lien avec vos clients
```

---

## 🎬 Ce Qui Se Passe en Coulisses

Quand vous poussez un tag `v*`, GitHub Actions :

1. ✅ Démarre une machine **Windows Server 2022** dans le cloud
2. ✅ Installe **Python 3.11**
3. ✅ Installe toutes les dépendances (`requirements.txt`)
4. ✅ Installe **PyInstaller**
5. ✅ Compile l'application → `BexioDashboard.exe`
6. ✅ Télécharge et installe **Inno Setup**
7. ✅ Compile l'installeur → `BexioDashboard_Setup_v*.exe`
8. ✅ Teste que tout fonctionne
9. ✅ Crée une **GitHub Release**
10. ✅ Attache l'installeur `.exe` à la release

**Durée totale :** ~5-10 minutes

**Coût :** Gratuit (2000 minutes/mois sur GitHub Free)

---

## 🖥️ Si Vous Avez Quand Même Windows

Si vous voulez compiler localement sur votre machine Windows :

```bash
# Méthode simple
build_installer.bat

# OU méthode manuelle
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install pyinstaller
pyinstaller installer\BexioDashboard.spec

# Puis avec Inno Setup Compiler (GUI)
# Ouvrir installer\BexioDashboard_Setup.iss
# Cliquer "Compile"
```

---

## 🐧 Depuis Linux/Mac (Votre Cas)

### Ce Qui NE Fonctionne PAS
❌ `build_installer.bat` (script Windows)
❌ PyInstaller cross-compilation Windows (non supporté)
❌ Inno Setup (Windows uniquement)

### Ce Qui FONCTIONNE
✅ **GitHub Actions** (compilation dans le cloud Windows)
✅ Machine virtuelle Windows (VirtualBox, VMware)
✅ Wine + PyInstaller (complexe, non recommandé)

### Solution Recommandée : GitHub Actions

**Avantages :**
- ✅ Aucune machine Windows nécessaire
- ✅ Compilation reproductible
- ✅ Gratuit (2000 min/mois)
- ✅ Automatique
- ✅ Releases professionnelles

**Inconvénients :**
- ⏳ Doit attendre 5-10 min (vs instantané local)
- 🌐 Nécessite connexion internet

---

## 📊 Comparaison des Méthodes

| Méthode | Temps | Complexité | Coût | Recommandé |
|---------|-------|------------|------|------------|
| **GitHub Actions** | 5-10 min | ⭐ Facile | Gratuit | ✅ OUI |
| **Windows local** | 2-5 min | ⭐⭐ Moyen | Gratuit | Si vous avez Windows |
| **VM Windows** | 10-20 min | ⭐⭐⭐ Difficile | Gratuit | Non |
| **Wine** | 30-60 min | ⭐⭐⭐⭐ Très difficile | Gratuit | ❌ Non |
| **Service cloud** | 5-10 min | ⭐⭐ Moyen | Payant | Non |

---

## 🚀 Commandes Rapides

### Créer une Release

```bash
# Version patch (1.0.0 → 1.0.1)
git tag v1.0.1 && git push origin v1.0.1

# Version minor (1.0.0 → 1.1.0)
git tag v1.1.0 && git push origin v1.1.0

# Version major (1.0.0 → 2.0.0)
git tag v2.0.0 && git push origin v2.0.0
```

### Compiler Sans Release

1. GitHub → Actions → "🏗️ Build Windows Installer" → Run workflow
2. Téléchargez les Artifacts

---

## 🐛 Dépannage

### Le workflow ne se déclenche pas

**Vérifiez :**
1. Le fichier `.github/workflows/build-installer.yml` est bien poussé
2. GitHub Actions est activé : Settings → Actions → Allow all actions
3. Le tag commence bien par `v` (ex: `v1.0.0`, pas `1.0.0`)

### Le workflow échoue

**Causes communes :**

1. **requirements.txt manquant/invalide**
   ```bash
   # Générez un nouveau requirements.txt
   pip freeze > requirements.txt
   ```

2. **Erreur PyInstaller**
   - Vérifiez `installer/BexioDashboard.spec`
   - Ajoutez modules manquants dans `hiddenimports`

3. **Erreur Inno Setup**
   - Vérifiez `installer/BexioDashboard_Setup.iss`
   - Vérifiez les chemins de fichiers

**Solution :**
1. Consultez les logs : Actions → Cliquez sur le workflow rouge → Logs
2. Corrigez l'erreur
3. Poussez le fix
4. Re-créez le tag :
   ```bash
   git tag -d v1.0.0  # Supprimer localement
   git push origin :refs/tags/v1.0.0  # Supprimer sur GitHub
   git tag v1.0.0  # Re-créer
   git push origin v1.0.0  # Re-pousser
   ```

### L'installeur est trop gros (>200 MB)

**Normal si vous avez pandas, numpy, etc.**

Pour réduire :
1. Éditez `installer/BexioDashboard.spec`
2. Ajoutez dans `excludes=[...]` les modules non utilisés
3. Re-poussez et re-compilez

---

## 🎯 Checklist Avant Release

Avant de créer un tag `v*` :

- [ ] Code testé et fonctionnel
- [ ] Version mise à jour dans :
  - [ ] `installer/BexioDashboard_Setup.iss` (#define MyAppVersion)
  - [ ] `installer/version_info.txt` (filevers et prodvers)
- [ ] CHANGELOG.md à jour
- [ ] Documentation à jour
- [ ] .env.example sans données sensibles
- [ ] Tests passent (si vous en avez)
- [ ] README.md reflète les nouveautés

---

## 📚 Ressources

### Documentation
- **GitHub Actions** : https://docs.github.com/en/actions
- **PyInstaller** : https://pyinstaller.readthedocs.io/
- **Inno Setup** : https://jrsoftware.org/isinfo.php

### Liens Utiles
- **Vos Releases** : https://github.com/csigno1204/BSCO-Dashboard-PowerBI/releases
- **Vos Actions** : https://github.com/csigno1204/BSCO-Dashboard-PowerBI/actions
- **Issues** : https://github.com/csigno1204/BSCO-Dashboard-PowerBI/issues

---

## ✅ Résumé

**Pour compiler l'installeur .exe SANS Windows :**

```bash
# 1. Créer et pousser un tag
git tag v1.0.0
git push origin v1.0.0

# 2. Attendre 5-10 minutes

# 3. Télécharger depuis :
# https://github.com/csigno1204/BSCO-Dashboard-PowerBI/releases
```

**C'est tout ! GitHub Actions fait le reste. 🎉**

---

**Mis à jour :** Janvier 2025
