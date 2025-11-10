# 🚀 Workflow Complet - Signature Automatique

## Vue d'ensemble

Ce guide explique le workflow **COMPLET** pour créer un exe signé avec installation **AUTOMATIQUE** du certificat.

**Résultat final :** Les utilisateurs double-cliquent sur l'installeur → Certificat installé automatiquement → Application fonctionnelle !

---

## 📋 Workflow en 5 Étapes

### Étape 1 : Générer le Certificat Auto-signé

**Une seule fois - Valide 3 ans**

```powershell
# PowerShell en Administrateur
cd C:\chemin\vers\BSCO-Dashboard-PowerBI

.\scripts\generate_selfsigned_certificate.ps1
```

**Résultat :**
```
✅ scripts/certificates/BSCO_CodeSigning_SelfSigned.pfx (clé privée)
✅ scripts/certificates/BSCO_CodeSigning_SelfSigned.cer (clé publique)
```

---

### Étape 2 : Compiler l'Application

```powershell
# Installer les dépendances (si première fois)
pip install -r requirements.txt
pip install pyinstaller

# Compiler avec PyInstaller
pyinstaller --clean installer/BexioDashboard.spec
```

**Résultat :**
```
✅ dist/BexioDashboard/BexioDashboard.exe (non signé)
```

---

### Étape 3 : Signer l'Exe

```powershell
.\scripts\sign_executable.ps1 -ExePath "dist\BexioDashboard\BexioDashboard.exe"
```

**Résultat :**
```
✅ dist/BexioDashboard/BexioDashboard.exe (SIGNÉ)
   Signature : CN=BSCO Solutions
   Status : Valid
```

---

### Étape 4 : Extraire le Certificat de l'Exe

**NOUVEAU - Cette étape extrait automatiquement le certificat**

```powershell
.\scripts\extract_certificate.ps1 -ExePath "dist\BexioDashboard\BexioDashboard.exe"
```

**Résultat :**
```
✅ scripts/certificates/BSCO_CodeSigning_SelfSigned.cer mis à jour
   (Prêt pour inclusion dans l'installeur)
```

**Pourquoi extraire ?**
- Garantit que le certificat dans l'installeur correspond EXACTEMENT à la signature de l'exe
- Le certificat est automatiquement trouvé par Inno Setup
- Installé silencieusement lors de l'installation

---

### Étape 5 : Compiler l'Installeur avec Inno Setup

```powershell
# Chemin vers Inno Setup Compiler
$iscc = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"

# Compiler l'installeur
& $iscc "installer\BexioDashboard_Setup.iss"
```

**Résultat :**
```
✅ dist/installer/BexioDashboard_Setup_v1.0.0.exe
   - Contient l'application signée
   - Contient le certificat .cer
   - Installe automatiquement le certificat lors de l'installation
```

---

### Étape 6 (Optionnel) : Signer l'Installeur

```powershell
.\scripts\sign_executable.ps1 -ExePath "dist\installer\BexioDashboard_Setup_v1.0.0.exe"
```

**Résultat :**
```
✅ dist/installer/BexioDashboard_Setup_v1.0.0.exe (DOUBLE SIGNÉ)
   - L'application interne est signée
   - L'installeur lui-même est signé
```

---

## ✨ Ce Qui Se Passe Lors de l'Installation

### Pour l'Utilisateur (Expérience)

1. **Double-clic** sur `BexioDashboard_Setup.exe`
2. **SmartScreen** peut apparaître → "Exécuter quand même"
3. **Assistant d'installation** s'ouvre
4. **Suit l'assistant** → Installation en cours...
5. **Message de confirmation** : "Certificat installé avec succès !"
6. **Installation terminée** → Application prête à utiliser

**Durée totale :** 2-3 minutes

---

### En Coulisses (Technique)

**Pendant l'installation, Inno Setup :**

1. **Copie le certificat** `.cer` dans `{tmp}` (dossier temporaire)

2. **Exécute** (silencieusement) :
   ```
   certutil.exe -addstore -user Root "{tmp}\BSCO_CodeSigning_SelfSigned.cer"
   ```

3. **Le certificat** est installé dans :
   ```
   Cert:\CurrentUser\Root\
   (Autorités de certification racines de confiance)
   ```

4. **Affiche un message** de confirmation à l'utilisateur

5. **Continue l'installation** normalement

6. **Supprime le certificat** de `{tmp}` (nettoyage automatique)

**Code Inno Setup (Pascal) :**
```pascal
function InstallSelfSignedCertificate(): Boolean;
var
  CertPath: String;
  ResultCode: Integer;
begin
  CertPath := ExpandConstant('{tmp}\BSCO_CodeSigning_SelfSigned.cer');

  if Exec('certutil.exe', '-addstore -user Root "' + CertPath + '"',
          '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    if (ResultCode = 0) or (ResultCode = 183) then  // 183 = déjà installé
      Result := True;
  end;
end;
```

---

## 🎯 Avantages de Ce Workflow

### ✅ Pour le Développeur

- **Automatisé à 100%** : Scripts PowerShell pour tout
- **Rapide** : 5 minutes du début à la fin
- **Reproductible** : Même processus à chaque fois
- **Aucun fichier à distribuer manuellement** : Tout dans l'installeur

### ✅ Pour l'Utilisateur

- **Simple** : Double-clic sur l'exe
- **Aucune action manuelle** : Certificat installé automatiquement
- **Aucun fichier .cer à installer** : Tout inclus
- **Message de confirmation** : Sait que le certificat est installé

---

## 📦 Fichiers Générés et Leur Rôle

| Fichier | Rôle | Distribuer ? |
|---------|------|--------------|
| `BSCO_CodeSigning_SelfSigned.pfx` | Clé privée pour signer | ❌ NE JAMAIS distribuer |
| `BSCO_CodeSigning_SelfSigned.cer` | Certificat public | ❌ Inclus dans installeur |
| `BexioDashboard.exe` | Application signée | ❌ Inclus dans installeur |
| `BexioDashboard_Setup.exe` | **INSTALLEUR FINAL** | ✅ **OUI - DISTRIBUER** |

**À distribuer aux utilisateurs :**
```
📦 BexioDashboard_Setup_v1.0.0.exe (~100 MB)
```

**C'est tout !** Un seul fichier contient tout :
- L'application complète (Python + dépendances)
- Le certificat auto-signé
- L'installation automatique du certificat
- L'assistant d'installation
- La désinstallation

---

## 🔄 Script Tout-en-Un (Automatisation Complète)

**Créez `build_and_sign.ps1` :**

```powershell
# ====================================================================
# Build et Signature Automatique Complète
# ====================================================================

param(
    [switch]$SkipBuild,
    [switch]$SkipCertGeneration
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 BUILD ET SIGNATURE AUTOMATIQUE" -ForegroundColor Cyan
Write-Host ""

# 1. Générer le certificat (si pas déjà fait)
if (-not $SkipCertGeneration) {
    if (-not (Test-Path "scripts\certificates\BSCO_CodeSigning_SelfSigned.pfx")) {
        Write-Host "1️⃣  Génération du certificat..." -ForegroundColor Yellow
        .\scripts\generate_selfsigned_certificate.ps1
    } else {
        Write-Host "1️⃣  Certificat déjà existant ✅" -ForegroundColor Green
    }
}

# 2. Compiler l'application
if (-not $SkipBuild) {
    Write-Host "2️⃣  Compilation de l'application..." -ForegroundColor Yellow
    pyinstaller --clean installer\BexioDashboard.spec
}

# 3. Signer l'exe
Write-Host "3️⃣  Signature de l'application..." -ForegroundColor Yellow
.\scripts\sign_executable.ps1 -ExePath "dist\BexioDashboard\BexioDashboard.exe"

# 4. Extraire le certificat
Write-Host "4️⃣  Extraction du certificat..." -ForegroundColor Yellow
.\scripts\extract_certificate.ps1 -ExePath "dist\BexioDashboard\BexioDashboard.exe"

# 5. Compiler l'installeur
Write-Host "5️⃣  Compilation de l'installeur..." -ForegroundColor Yellow
$iscc = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
& $iscc "installer\BexioDashboard_Setup.iss"

# 6. Signer l'installeur
Write-Host "6️⃣  Signature de l'installeur..." -ForegroundColor Yellow
$installer = Get-Item "dist\installer\BexioDashboard_Setup_*.exe"
.\scripts\sign_executable.ps1 -ExePath $installer.FullName

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ BUILD COMPLET TERMINÉ !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Installeur prêt à distribuer :" -ForegroundColor Cyan
Write-Host "   $($installer.FullName)" -ForegroundColor White
Write-Host ""
Write-Host "📊 Taille : $([math]::Round($installer.Length / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Cet installeur contient :" -ForegroundColor Yellow
Write-Host "   ✅ Application complète (Python + dépendances)" -ForegroundColor White
Write-Host "   ✅ Certificat auto-signé" -ForegroundColor White
Write-Host "   ✅ Installation automatique du certificat" -ForegroundColor White
Write-Host "   ✅ Signature numérique valide" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Les utilisateurs peuvent maintenant installer en 1 clic !" -ForegroundColor Green
Write-Host ""
```

**Utilisation :**

```powershell
# Build complet (depuis zéro)
.\build_and_sign.ps1

# Build rapide (certificat déjà généré, skip compilation)
.\build_and_sign.ps1 -SkipCertGeneration -SkipBuild
```

---

## 🔍 Vérification

### Vérifier que le certificat est dans l'installeur

```powershell
# Extraire l'installeur (avec 7zip ou similaire)
7z x dist\installer\BexioDashboard_Setup_v1.0.0.exe -o"extracted"

# Chercher le certificat
Get-ChildItem -Path "extracted" -Recurse -Filter "*.cer"
```

**Devrait trouver :**
```
extracted\{tmp}\BSCO_CodeSigning_SelfSigned.cer
```

---

### Tester l'installation

**Méthode 1 : Machine Virtuelle (Recommandé)**
```
1. Créer une VM Windows 10/11 propre
2. Copier BexioDashboard_Setup.exe dans la VM
3. Double-cliquer et installer
4. Vérifier que le certificat est installé :
   certmgr.msc → Autorités racines → BSCO Solutions
```

**Méthode 2 : Machine Locale**
```powershell
# Vérifier si le certificat est installé
Get-ChildItem -Path Cert:\CurrentUser\Root | Where-Object { $_.Subject -like "*BSCO*" }

# Devrait afficher :
#   Subject: CN=BSCO Solutions, O=BSCO Solutions, L=Geneva, S=Geneva, C=CH
#   Thumbprint: [hash]
```

---

## ❌ Limitations et ⚠️ Rappels

### Limitations du Certificat Auto-signé

❌ **N'élimine PAS** les faux positifs antivirus
❌ **Windows SmartScreen** peut toujours bloquer
❌ **Aucune réputation** avec Microsoft
❌ **Distribution publique limitée**

### Pour Distribution Professionnelle

✅ **Certificat EV** (~500 EUR/an)
- Zéro faux positif antivirus
- "Éditeur vérifié : BSCO Solutions"
- Réputation SmartScreen immédiate
- → Voir : `docs/CODE_SIGNING_GUIDE.md`

---

## 📚 Références

**Scripts créés :**
- `scripts/generate_selfsigned_certificate.ps1` - Génère le certificat
- `scripts/sign_executable.ps1` - Signe un exe
- `scripts/extract_certificate.ps1` - Extrait certificat d'un exe signé
- `build_and_sign.ps1` - Script tout-en-un (à créer)

**Documentation :**
- `docs/CERTIFICAT_AUTOSIGNE.md` - Guide complet auto-signé
- `docs/CODE_SIGNING_GUIDE.md` - Guide certificat EV professionnel
- `docs/ANTIVIRUS_ET_SECURITE.md` - Problèmes antivirus
- Ce document - Workflow complet

**Configuration :**
- `installer/BexioDashboard_Setup.iss` - Script Inno Setup avec auto-installation certificat

---

## ✅ Checklist Complète

**Préparation (une fois) :**
- [ ] Windows SDK installé (pour SignTool)
- [ ] Inno Setup 6 installé
- [ ] Python 3.11+ installé
- [ ] Dépendances installées : `pip install -r requirements.txt`

**Build (à chaque version) :**
- [ ] 1. Générer certificat (si première fois)
- [ ] 2. Compiler application : `pyinstaller --clean`
- [ ] 3. Signer exe : `sign_executable.ps1`
- [ ] 4. Extraire certificat : `extract_certificate.ps1`
- [ ] 5. Compiler installeur : `ISCC.exe`
- [ ] 6. Signer installeur : `sign_executable.ps1`

**Distribution :**
- [ ] Tester l'installeur sur une machine propre
- [ ] Vérifier certificat auto-installé
- [ ] Distribuer `BexioDashboard_Setup_v*.exe`

---

## 🎉 Résultat Final

**Pour l'utilisateur final :**

1. Télécharge : `BexioDashboard_Setup_v1.0.0.exe`
2. Double-clic
3. Suit l'assistant
4. Message : "Certificat installé avec succès !"
5. Application installée et fonctionnelle

**Aucune action manuelle requise !**

---

Workflow créé par Claude pour BSCO Solutions
