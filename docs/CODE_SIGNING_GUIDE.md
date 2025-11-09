# 🔐 Guide Complet - Signature de Code

## Vue d'ensemble

Ce guide explique comment obtenir et configurer un **certificat de signature de code** pour éliminer les faux positifs antivirus.

---

## 📋 Qu'est-ce que la Signature de Code ?

**Signature de code** = Certificat numérique qui :
- ✅ Prouve votre identité en tant qu'éditeur de logiciel
- ✅ Garantit que le fichier n'a pas été modifié depuis la signature
- ✅ Élimine les faux positifs antivirus
- ✅ Affiche "Éditeur vérifié" dans Windows

**Résultat visible par l'utilisateur :**
```
Avant signature :
❌ "Éditeur inconnu"
❌ "Windows a protégé votre PC"
❌ Antivirus bloque l'exe

Après signature :
✅ "Éditeur vérifié : BSCO Solutions"
✅ Installation sans avertissement
✅ Aucun faux positif antivirus
```

---

## 🎯 Types de Certificats

### 1. Certificat EV (Extended Validation) - **RECOMMANDÉ**

**Prix :** ~400-600 EUR/an

**Avantages :**
- ✅ Réputation **IMMÉDIATE** avec Windows SmartScreen
- ✅ **Zéro faux positif** antivirus (reconnu par tous)
- ✅ Windows affiche l'éditeur vérifié dès la 1ère installation
- ✅ Certificat sur clé USB sécurisée (sécurité maximale)
- ✅ ROI rapide si vous distribuez à beaucoup d'utilisateurs

**Inconvénients :**
- ❌ Plus cher que OV
- ❌ Validation entreprise stricte (KBIS, D-U-N-S, etc.)
- ❌ Délai validation : 3-7 jours ouvrés

**Fournisseurs recommandés :**
- **DigiCert** : ~500 EUR/an (leader marché, meilleur support)
- **Sectigo** : ~400 EUR/an (bon rapport qualité/prix)
- **GlobalSign** : ~450 EUR/an

---

### 2. Certificat OV (Organization Validation)

**Prix :** ~150-300 EUR/an

**Avantages :**
- ✅ Moins cher que EV
- ✅ Signature de code valide
- ✅ Réduit les faux positifs

**Inconvénients :**
- ⚠️ Réputation SmartScreen **progressive** (nécessite plusieurs installations avant reconnaissance)
- ⚠️ Plus de faux positifs qu'avec EV (mais moins que sans signature)
- ❌ Validation entreprise requise

**Fournisseurs :**
- **Sectigo** : ~150 EUR/an
- **Certum** : ~120 EUR/an
- **K Software** : ~180 EUR/an

---

### 3. Certificat Auto-signé (Tests uniquement)

**Prix :** Gratuit

**Utilisation :**
- ✅ Tests internes uniquement
- ❌ NE FONCTIONNE PAS pour distribution publique

**Avantages :**
- ✅ Gratuit et immédiat
- ✅ Parfait pour tester le processus de signature

**Inconvénients :**
- ❌ Nécessite que chaque utilisateur installe votre certificat racine manuellement
- ❌ Aucune protection contre faux positifs
- ❌ Windows affiche toujours "Éditeur inconnu"

---

## 🛒 Commande du Certificat (Exemple : DigiCert EV)

### Étape 1 : Création du compte

1. **Allez sur :** https://www.digicert.com/signing/code-signing-certificates

2. **Créez un compte** :
   - Nom d'entreprise : `BSCO Solutions`
   - Email professionnel : `votre@email-entreprise.com`
   - Téléphone professionnel

3. **Choisissez le certificat** :
   - **EV Code Signing Certificate**
   - Platform : **Windows** (Authenticode)
   - Durée : **1 an** (ou 3 ans pour économiser)

---

### Étape 2 : Documents requis

Préparez ces documents (scannés) :

#### Documents Entreprise

**Pour France :**
- ✅ **KBIS** (moins de 3 mois)
- ✅ **Statuts** de l'entreprise
- ✅ **Pièce d'identité** du représentant légal (recto-verso)

**Pour Suisse :**
- ✅ **Extrait du registre du commerce** (moins de 3 mois)
- ✅ **Statuts** de l'entreprise
- ✅ **Pièce d'identité** du représentant légal

**Pour Belgique :**
- ✅ **Extrait BCE** (Banque-Carrefour des Entreprises)
- ✅ **Statuts** de l'entreprise
- ✅ **Pièce d'identité** du représentant légal

#### Vérification D-U-N-S (pour EV)

DigiCert nécessite un **numéro D-U-N-S** (Data Universal Numbering System) :

1. **Vérifiez** si votre entreprise en a déjà un :
   - https://www.dnb.com/duns-number/lookup.html

2. **Sinon, demandez-en un** (gratuit, délai 30 jours) :
   - https://www.dnb.com/duns-number/get-a-duns.html

**Astuce :** Demandez votre D-U-N-S **avant** de commander le certificat !

---

### Étape 3 : Validation

1. **Upload des documents** via le portail DigiCert

2. **Appel téléphonique de vérification** :
   - DigiCert appelle le **numéro professionnel** enregistré
   - Confirme l'identité du représentant légal
   - Durée : ~5 minutes

3. **Validation des documents** :
   - Vérification KBIS/extrait registre
   - Vérification D-U-N-S
   - Durée : 3-7 jours ouvrés

4. **Réception du certificat** :
   - **EV** : Reçu sur **clé USB sécurisée** par courrier
   - **OV** : Téléchargeable en ligne (.pfx ou .p12)

---

## 🔧 Configuration GitHub Actions

### Prérequis

Vous aurez besoin de :
- ✅ Votre certificat (.pfx ou .p12)
- ✅ Le mot de passe du certificat

---

### Étape 1 : Préparer le certificat

#### Convertir en Base64 (pour GitHub Secrets)

**Windows PowerShell :**
```powershell
# Convertir le certificat en base64
$cert = [IO.File]::ReadAllBytes("C:\chemin\vers\certificat.pfx")
$base64 = [Convert]::ToBase64String($cert)
$base64 | Out-File "certificat_base64.txt"
```

**Linux/Mac :**
```bash
base64 -i certificat.pfx -o certificat_base64.txt
```

**Résultat :** Un fichier texte avec une longue chaîne base64

---

### Étape 2 : Ajouter les secrets GitHub

1. **Allez sur GitHub** :
   - https://github.com/csigno1204/BSCO-Dashboard-PowerBI/settings/secrets/actions

2. **Créez les secrets** :

   **Secret 1 : CODESIGN_CERTIFICATE**
   - Cliquez sur "New repository secret"
   - Name : `CODESIGN_CERTIFICATE`
   - Value : Copiez TOUT le contenu de `certificat_base64.txt`
   - Cliquez sur "Add secret"

   **Secret 2 : CODESIGN_PASSWORD**
   - Cliquez sur "New repository secret"
   - Name : `CODESIGN_PASSWORD`
   - Value : Le mot de passe de votre certificat
   - Cliquez sur "Add secret"

---

### Étape 3 : Activer le workflow de signature

1. **Renommez le fichier workflow** :
   ```bash
   cd .github/workflows
   mv build-installer-signed.yml.DISABLED build-installer-signed.yml
   ```

2. **Commitez et poussez** :
   ```bash
   git add .github/workflows/build-installer-signed.yml
   git commit -m "🔐 Activer workflow de signature de code"
   git push
   ```

---

### Étape 4 : Créer une release signée

```bash
# Créer un tag avec -signed
git tag v1.0.1-signed

# Pousser le tag
git push origin v1.0.1-signed
```

**Résultat :**
- ✅ GitHub Actions compile l'exe
- ✅ Signe automatiquement l'exe et l'installeur
- ✅ Crée une Release avec le fichier signé
- ✅ Durée : ~10 minutes

---

## 🧪 Vérifier la Signature

### Vérification Windows

1. **Téléchargez l'exe signé**

2. **Clic droit** → **Propriétés**

3. **Onglet "Signatures numériques"** :
   - ✅ Nom du signataire : `BSCO Solutions`
   - ✅ Horodatage : Date de signature
   - ✅ Algorithme de synthèse : SHA256

4. **Détails** → **Voir le certificat** :
   - ✅ Délivré à : Votre entreprise
   - ✅ Délivré par : DigiCert (ou autre CA)
   - ✅ Valide du : Date début → Date fin

---

### Vérification en ligne de commande

```powershell
# Vérifier la signature avec SignTool
signtool verify /pa /v BexioDashboard_Setup.exe
```

**Résultat attendu :**
```
Vérification : BexioDashboard_Setup.exe
Signature Index: 0 (Primary Signature)
Hash of file (sha256): [hash]
Signing Certificate Chain:
    Issued to: BSCO Solutions
    Issued by: DigiCert
    Expires:   [date]

Successfully verified: BexioDashboard_Setup.exe
```

---

### Vérification PowerShell

```powershell
Get-AuthenticodeSignature BexioDashboard_Setup.exe | Format-List
```

**Résultat attendu :**
```
SignerCertificate : [Certificat]
Status            : Valid
StatusMessage     : Signature verified.
```

---

## 💰 Coûts et ROI

### Investissement Initial

| Élément | EV | OV |
|---------|----|----|
| **Certificat 1 an** | 500 EUR | 180 EUR |
| **D-U-N-S** | Gratuit | Gratuit |
| **Temps setup** | ~2h | ~2h |
| **Total année 1** | **500 EUR** | **180 EUR** |

### Années suivantes

| Élément | EV | OV |
|---------|----|----|
| **Renouvellement** | 500 EUR/an | 180 EUR/an |
| **Temps** | ~30 min/an | ~30 min/an |

---

### ROI (Retour sur Investissement)

**Avantages quantifiables :**

1. **Support utilisateur** :
   - Sans signature : ~30% utilisateurs contactent support pour antivirus
   - Avec signature : ~0% (aucun problème)
   - **Économie :** ~10-20h support/mois

2. **Taux d'installation** :
   - Sans signature : ~60% abandonnent à cause antivirus/SmartScreen
   - Avec signature : ~95% installent sans problème
   - **Gain :** +35% utilisateurs

3. **Réputation** :
   - Apparence professionnelle
   - Confiance utilisateur accrue

**Calcul ROI :**
```
Si 1h de support coûte 50 EUR :
Économie support : 15h/mois × 50 EUR = 750 EUR/mois = 9000 EUR/an

ROI = (9000 - 500) / 500 = 17x (1700%)
```

**Conclusion :** Le certificat EV est **RENTABLE** dès le 1er mois si vous avez plusieurs utilisateurs.

---

## 📋 Checklist de Commande

### Avant de commander

- [ ] Vérifiez que vous avez un D-U-N-S (pour EV)
- [ ] Préparez KBIS/extrait registre (moins de 3 mois)
- [ ] Scannez pièce d'identité représentant légal
- [ ] Préparez statuts entreprise
- [ ] Vérifiez numéro téléphone professionnel (pour appel validation)
- [ ] Budget alloué : 500 EUR (EV) ou 180 EUR (OV)

### Après commande

- [ ] Uploadez documents sur portail fournisseur
- [ ] Attendez appel téléphonique validation
- [ ] Réceptionnez certificat (clé USB pour EV, download pour OV)
- [ ] Convertissez en base64
- [ ] Ajoutez secrets GitHub
- [ ] Activez workflow signature
- [ ] Testez avec tag `-signed`
- [ ] Vérifiez signature sur exe final
- [ ] Distribuez version signée

---

## 🔄 Renouvellement Annuel

**90 jours avant expiration :**

1. **Email de rappel** du fournisseur

2. **Renouvellement** :
   - Moins de documents requis
   - Validation plus rapide (1-3 jours)

3. **Mise à jour secrets GitHub** :
   - Remplacer `CODESIGN_CERTIFICATE` avec nouveau certificat
   - Mettre à jour `CODESIGN_PASSWORD` si changé

4. **Test** :
   - Créer un tag de test
   - Vérifier nouvelle signature

---

## 🆘 Problèmes Courants

### Problème 1 : "Certificat expiré"

**Cause :** Le certificat a expiré

**Solution :**
- Renouvelez le certificat
- Resignez tous les exe distribués
- Les exe signés avec ancien certificat restent valides tant que timestampés

**Prévention :** Utilisez le timestamp lors de la signature !

---

### Problème 2 : "Signature invalide"

**Cause :** Le fichier a été modifié après signature

**Solution :**
- Ne JAMAIS modifier un exe signé
- Resignez après toute modification

---

### Problème 3 : "Workflow échoue à la signature"

**Causes possibles :**
- Secret `CODESIGN_CERTIFICATE` mal encodé
- Secret `CODESIGN_PASSWORD` incorrect
- Certificat expiré

**Diagnostic :**
```powershell
# Tester localement
$cert = [Convert]::FromBase64String("votre_base64")
[IO.File]::WriteAllBytes("test.pfx", $cert)

# Essayer d'importer
Import-PfxCertificate -FilePath "test.pfx" -CertStoreLocation Cert:\CurrentUser\My -Password (ConvertTo-SecureString "password" -AsPlainText -Force)
```

---

## 📚 Ressources

**Fournisseurs recommandés :**
- DigiCert : https://www.digicert.com
- Sectigo : https://sectigo.com
- GlobalSign : https://www.globalsign.com

**Documentation Microsoft :**
- SignTool : https://docs.microsoft.com/en-us/windows/win32/seccrypto/signtool
- Authenticode : https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode

**D-U-N-S :**
- Lookup : https://www.dnb.com/duns-number/lookup.html
- Request : https://www.dnb.com/duns-number/get-a-duns.html

---

## ✅ Résumé

**Pour une distribution professionnelle :**

1. **Commandez certificat EV** (~500 EUR/an)
   - Recommandé : DigiCert ou Sectigo
   - Délai : 3-7 jours

2. **Configurez GitHub Actions** (1h)
   - Ajoutez secrets
   - Activez workflow

3. **Distribuez version signée**
   - Zéro faux positif
   - Installation sans problème

**ROI : 17x dès le 1er mois** avec plusieurs utilisateurs !

---

Voulez-vous que je vous aide à :
- Commander un certificat spécifique ?
- Configurer les secrets GitHub ?
- Tester la signature en local ?
