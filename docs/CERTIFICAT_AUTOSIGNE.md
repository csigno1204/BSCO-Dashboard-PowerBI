# 🔐 Guide - Certificat Auto-signé

## Vue d'ensemble

Ce guide explique comment :
1. **Développeur** : Générer un certificat auto-signé et signer vos exe
2. **Utilisateurs** : Installer le certificat pour faire confiance aux exe signés

---

## ⚠️ IMPORTANT - Limitations

**Le certificat auto-signé est pour TESTS et DISTRIBUTION INTERNE uniquement.**

### Avantages ✅
- Gratuit et immédiat
- Permet de tester le processus de signature
- Bon pour distribution interne (entreprise)
- Prouve l'intégrité du fichier (non modifié)

### Inconvénients ❌
- **N'élimine PAS les faux positifs antivirus**
- Nécessite installation manuelle du certificat par chaque utilisateur
- Windows affiche "Éditeur inconnu" tant que certificat non installé
- Aucune réputation SmartScreen
- Pas adapté pour distribution publique

### Pour une solution professionnelle
→ Certificat EV (~500 EUR/an)
→ Voir : `docs/CODE_SIGNING_GUIDE.md`

---

## 👨‍💻 PARTIE 1 : Pour les Développeurs

### Étape 1 : Générer le certificat auto-signé

**Windows PowerShell (Administrateur) :**

```powershell
# Aller dans le dossier du projet
cd C:\chemin\vers\BSCO-Dashboard-PowerBI

# Exécuter le script de génération
.\scripts\generate_selfsigned_certificate.ps1
```

**Ce qui est créé :**

```
scripts/certificates/
├── BSCO_CodeSigning_SelfSigned.pfx    ← Pour VOUS (signer les exe)
├── BSCO_CodeSigning_SelfSigned.cer    ← Pour VOS UTILISATEURS (installer)
└── CERTIFICATE_INFO.txt               ← Informations du certificat
```

**Résultat :**
- ✅ Certificat généré et exporté
- ✅ Certificat installé dans votre store Windows (Trusted Root)
- ✅ Valide pendant 3 ans
- ✅ Prêt à signer des exe

---

### Étape 2 : Signer un exécutable

**Méthode 1 : Script automatique (Recommandé)**

```powershell
# Signer un exe
.\scripts\sign_executable.ps1 -ExePath "dist\BexioDashboard\BexioDashboard.exe"

# Signer l'installeur
.\scripts\sign_executable.ps1 -ExePath "dist\installer\BexioDashboard_Setup.exe"
```

**Méthode 2 : SignTool manuel**

```powershell
# Chemin vers SignTool (Windows SDK)
$signtool = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe"

# Signer
& $signtool sign `
  /f "scripts\certificates\BSCO_CodeSigning_SelfSigned.pfx" `
  /p "MotDePasseSecurise123!" `
  /fd SHA256 `
  /tr http://timestamp.digicert.com `
  /td SHA256 `
  "dist\BexioDashboard\BexioDashboard.exe"
```

**Vérifier la signature :**

```powershell
# Avec SignTool
& $signtool verify /pa /v "dist\BexioDashboard\BexioDashboard.exe"

# Avec PowerShell
Get-AuthenticodeSignature "dist\BexioDashboard\BexioDashboard.exe" | Format-List
```

---

### Étape 3 : Distribuer aux utilisateurs

**Fichiers à distribuer :**

1. **`BexioDashboard_Setup.exe`** (signé)
2. **`BSCO_CodeSigning_SelfSigned.cer`** (certificat public)
3. **`INSTALLATION_CERTIFICAT.txt`** (instructions)

**Exemple de `INSTALLATION_CERTIFICAT.txt` :**

```
====================================================================
  INSTALLATION DU CERTIFICAT - Dashboard Bexio Power BI
====================================================================

IMPORTANT : Pour que l'application fonctionne sans avertissement,
vous devez installer le certificat BSCO Solutions.

====================================================================
  INSTRUCTIONS
====================================================================

1. Double-cliquez sur "BSCO_CodeSigning_SelfSigned.cer"

2. Cliquez sur "Installer le certificat..."

3. Sélectionnez "Utilisateur actuel" → Suivant

4. Choisissez "Placer tous les certificats dans le magasin suivant"

5. Cliquez sur "Parcourir..."

6. Sélectionnez "Autorités de certification racines de confiance"

7. Cliquez sur "OK" → "Suivant" → "Terminer"

8. IMPORTANT : Acceptez l'avertissement de sécurité
   (Cliquez sur "Oui")

9. C'est terminé ! Vous pouvez maintenant installer l'application.

====================================================================
  VÉRIFICATION
====================================================================

Après installation du certificat :

1. Clic droit sur "BexioDashboard_Setup.exe" → Propriétés
2. Onglet "Signatures numériques"
3. Vous devriez voir : "BSCO Solutions" avec statut "Valide"

====================================================================
```

---

## 👥 PARTIE 2 : Pour les Utilisateurs

### Installer le certificat (Requis avant installation)

#### Étape 1 : Double-cliquez sur le fichier certificat

**Fichier :** `BSCO_CodeSigning_SelfSigned.cer`

Une fenêtre "Certificat" s'ouvre.

---

#### Étape 2 : Installer le certificat

1. Cliquez sur **"Installer le certificat..."**

2. **Assistant d'importation de certificat** s'ouvre :
   - Emplacement du magasin : **"Utilisateur actuel"**
   - Cliquez sur **"Suivant"**

3. **Magasin de certificats** :
   - Sélectionnez **"Placer tous les certificats dans le magasin suivant"**
   - Cliquez sur **"Parcourir..."**

4. **Sélectionner un magasin de certificats** :
   - Choisissez **"Autorités de certification racines de confiance"**
   - Cliquez sur **"OK"**

5. Cliquez sur **"Suivant"**

6. Vérifiez le récapitulatif :
   ```
   Magasin de certificats : Autorités de certification racines de confiance
   Contenu : 1 certificat(s)
   ```

7. Cliquez sur **"Terminer"**

---

#### Étape 3 : Accepter l'avertissement de sécurité

**⚠️ Windows affiche un avertissement :**

```
Avertissement de sécurité

Voulez-vous installer ce certificat ?

Émetteur   : BSCO Solutions
Objet      : BSCO Solutions

L'ajout de certificats dans le magasin Autorités de certification
racines de confiance signifie que vous faites confiance à tous les
logiciels signés avec ce certificat.
```

**➡️ Cliquez sur "OUI"**

---

#### Étape 4 : Confirmation

Vous devriez voir :

```
✅ L'importation a réussi.
```

**Le certificat est maintenant installé !**

---

#### Étape 5 : Installer l'application

Maintenant vous pouvez installer l'application :

1. **Double-cliquez** sur `BexioDashboard_Setup.exe`

2. Windows ne devrait **plus bloquer** (SmartScreen peut toujours s'activer)

3. **Si SmartScreen apparaît** :
   - Cliquez sur "Informations complémentaires"
   - Cliquez sur "Exécuter quand même"

4. **Suivez l'assistant** d'installation normalement

---

### Vérifier la signature (Optionnel)

**Avant d'installer l'application, vous pouvez vérifier la signature :**

1. **Clic droit** sur `BexioDashboard_Setup.exe` → **Propriétés**

2. **Onglet "Signatures numériques"** :
   - Liste de signatures : `BSCO Solutions`
   - Cliquez sur `BSCO Solutions`
   - Cliquez sur **"Détails"**

3. **Informations sur la signature** :
   - Algorithme de synthèse : SHA256
   - Horodatage : [Date de signature]

4. Cliquez sur **"Voir le certificat"**

5. **Détails du certificat** :
   - Délivré à : `CN=BSCO Solutions, O=BSCO Solutions, L=Geneva, S=Geneva, C=CH`
   - Délivré par : `CN=BSCO Solutions, O=BSCO Solutions, L=Geneva, S=Geneva, C=CH`
   - Valide du : [Date début]
   - Valide jusqu'au : [Date fin]

**Status :** `✅ Ce certificat est valide`

---

## 🔄 Désinstaller le certificat

**Si vous voulez désinstaller le certificat plus tard :**

1. Appuyez sur **Windows + R**
2. Tapez : `certmgr.msc`
3. Appuyez sur **Entrée**

4. **Gestionnaire de certificats** s'ouvre :
   - Naviguez vers : **Autorités de certification racines de confiance** → **Certificats**
   - Trouvez : **BSCO Solutions**
   - **Clic droit** → **Supprimer**
   - Confirmez

**Le certificat est désinstallé.**

---

## 📊 Comparaison : Avec vs Sans Certificat

### Sans certificat installé

```
❌ Windows SmartScreen bloque
❌ "Éditeur inconnu"
❌ "Windows a protégé votre PC"
❌ Antivirus peut bloquer
```

### Avec certificat installé

```
✅ SmartScreen n'affiche plus "Éditeur inconnu"
✅ Signature valide affichée
⚠️  MAIS : Antivirus peut toujours bloquer (faux positif PyInstaller)
```

### Avec certificat EV professionnel

```
✅ "Éditeur vérifié : BSCO Solutions"
✅ Aucun SmartScreen
✅ Aucun faux positif antivirus
✅ Réputation immédiate
```

**→ Pour distribution professionnelle : Certificat EV recommandé**

---

## 🔒 Sécurité

### Le certificat auto-signé est-il sûr ?

**OUI**, si vous l'avez généré vous-même et que vous contrôlez sa distribution.

**NON**, si un inconnu vous demande d'installer son certificat auto-signé !

**Principe :**
- Un certificat auto-signé dit : "Je me fais confiance à moi-même"
- Un certificat EV dit : "DigiCert a vérifié mon identité d'entreprise"

**Pour votre cas (distribution interne) :**
- ✅ Vous générez le certificat
- ✅ Vous signez vos propres exe
- ✅ Vous distribuez à vos propres utilisateurs
- ✅ C'est sûr !

**Pour distribution publique :**
- ❌ Les utilisateurs ne vous connaissent pas
- ❌ Impossible de vérifier votre identité
- ❌ Utilisez un certificat EV à la place

---

## 🛠️ Dépannage

### Problème 1 : "Le certificat n'est pas approuvé"

**Cause :** Certificat non installé dans "Autorités de certification racines de confiance"

**Solution :**
- Réinstallez le certificat en suivant les étapes ci-dessus
- Vérifiez que vous l'avez bien mis dans "Autorités de certification **RACINES** de confiance"
- Pas dans "Autorités de certification intermédiaires" !

---

### Problème 2 : "L'antivirus bloque toujours l'exe"

**Cause :** Le certificat auto-signé ne protège PAS contre les faux positifs antivirus

**Solutions :**
1. **Temporaire** : Ajoutez une exclusion antivirus (voir `docs/ANTIVIRUS_ET_SECURITE.md`)
2. **Permanente** : Obtenez un certificat EV (voir `docs/CODE_SIGNING_GUIDE.md`)

---

### Problème 3 : "La signature est invalide après installation"

**Cause :** Le fichier exe a été modifié après signature

**Solution :**
- Ne JAMAIS modifier un exe après signature
- Resignez si vous modifiez le fichier

---

### Problème 4 : "SignTool.exe non trouvé"

**Cause :** Windows SDK non installé

**Solution :**
```powershell
# Installer via Chocolatey
choco install windows-sdk-10.0

# OU télécharger depuis
# https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/
```

---

## 📋 Checklist

### Pour le développeur

- [ ] Générer le certificat auto-signé : `.\scripts\generate_selfsigned_certificate.ps1`
- [ ] Vérifier création de `BSCO_CodeSigning_SelfSigned.pfx`
- [ ] Vérifier création de `BSCO_CodeSigning_SelfSigned.cer`
- [ ] Signer l'exe : `.\scripts\sign_executable.ps1 -ExePath "..."`
- [ ] Vérifier la signature : `Get-AuthenticodeSignature`
- [ ] Préparer le package pour distribution :
  - [ ] `BexioDashboard_Setup.exe` (signé)
  - [ ] `BSCO_CodeSigning_SelfSigned.cer`
  - [ ] `INSTALLATION_CERTIFICAT.txt`

### Pour l'utilisateur

- [ ] Recevoir le package complet
- [ ] Lire `INSTALLATION_CERTIFICAT.txt`
- [ ] Installer le certificat `.cer`
- [ ] Accepter l'avertissement de sécurité
- [ ] Vérifier que le certificat est installé (`certmgr.msc`)
- [ ] Installer l'application
- [ ] (Optionnel) Ajouter exclusion antivirus

---

## 💰 Coûts

| Type | Coût | Temps | Faux positifs antivirus |
|------|------|-------|-------------------------|
| **Auto-signé** | Gratuit | 5 min | ❌ Aucune protection |
| **Certificat EV** | ~500 EUR/an | 3-7 jours | ✅ Éliminés |

**Recommandation :**
- Tests / Distribution interne : Certificat auto-signé
- Distribution publique / Professionnelle : Certificat EV

---

## 📚 Ressources

**Documentation :**
- Certificat auto-signé : Ce document
- Signature de code professionnelle : `docs/CODE_SIGNING_GUIDE.md`
- Problèmes antivirus : `docs/ANTIVIRUS_ET_SECURITE.md`

**Outils :**
- SignTool : Inclus dans Windows SDK
- PowerShell : Inclus dans Windows
- Certificat auto-signé : Scripts fournis

**Liens utiles :**
- Windows SDK : https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/
- Documentation SignTool : https://docs.microsoft.com/en-us/windows/win32/seccrypto/signtool
- Authenticode : https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode

---

## ✅ Résumé

**Pour développeur :**
1. Générer certificat : `.\scripts\generate_selfsigned_certificate.ps1`
2. Signer exe : `.\scripts\sign_executable.ps1 -ExePath "..."`
3. Distribuer : exe signé + certificat .cer + instructions

**Pour utilisateur :**
1. Installer certificat `.cer` dans "Autorités racines de confiance"
2. Accepter avertissement sécurité
3. Installer application normalement

**Limitations :**
- ❌ N'élimine PAS les faux positifs antivirus
- ✅ Bon pour tests et distribution interne
- ✅ Gratuit et immédiat

**Pour distribution professionnelle :**
→ Certificat EV (~500 EUR/an, aucun faux positif)

---

Besoin d'aide ? Consultez `docs/CODE_SIGNING_GUIDE.md` pour la solution professionnelle.
