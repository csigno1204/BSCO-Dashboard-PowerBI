# 📥 Installation - Dashboard Bexio → Power BI

## ⚠️ Message "Unknown Publisher" - C'EST NORMAL !

Lorsque vous lancez `BexioDashboard_Setup.exe` ou `BexioDashboard.exe`, Windows affiche :

```
Éditeur inconnu (Unknown Publisher)
Voulez-vous autoriser cette application à apporter des modifications à votre appareil ?
```

**🔐 C'EST TOTALEMENT NORMAL ET ATTENDU !**

### Pourquoi ce message apparaît-il ?

Ce logiciel est signé avec un **certificat auto-signé** (gratuit) au lieu d'un **certificat EV professionnel** (~500 EUR/an).

**Analogie simple :**
- Certificat auto-signé = Vous dites "Je garantis que c'est moi qui ai créé ce logiciel"
- Certificat EV = Une autorité reconnue (DigiCert, etc.) dit "Nous garantissons que BSCO Solutions a créé ce logiciel"

Windows fait PLUS confiance aux certificats EV car une entreprise externe a vérifié l'identité du développeur.

### Est-ce sécurisé ?

**OUI, totalement sécurisé !** Voici pourquoi :

✅ **Le fichier est signé numériquement** - Vous pouvez vérifier qu'il provient bien de BSCO Solutions
✅ **Le certificat s'auto-installe** - Au premier lancement, le certificat est ajouté à votre Windows Store
✅ **Code source disponible** - [Sur GitHub](https://github.com/csigno1204/BSCO-Dashboard-PowerBI)
✅ **Aucun code malveillant** - Uniquement Python + PyInstaller pour extraire données Bexio → Power BI

### Comment vérifier la signature ?

**Méthode 1 : Propriétés du fichier**

1. Clic droit sur `BexioDashboard_Setup.exe`
2. Propriétés → Onglet "Signatures numériques"
3. Vous devriez voir :
   - **Signé par :** CN=BSCO Solutions, O=BSCO Solutions, L=Geneva, S=Geneva, C=CH
   - **Statut :** ⚠️ Cette signature numérique est correcte mais... (c'est normal avec auto-signé)

**Méthode 2 : PowerShell**

```powershell
Get-AuthenticodeSignature "BexioDashboard_Setup.exe" | Format-List *
```

Résultat attendu :
- Status: Valid (après installation du certificat) ou UnknownError (avant)
- SignerCertificate: CN=BSCO Solutions...

---

## 🚀 Installation - 2 Méthodes

### Méthode 1 : Installeur Complet (Recommandé)

**Fichier :** `BexioDashboard_Setup_v*.exe` (~100 MB)

**Étapes :**

1. **Téléchargez** `BexioDashboard_Setup_v*.exe`

2. **Double-cliquez** sur le fichier

3. **Windows UAC** affiche "Unknown Publisher"
   → **Cliquez sur "Oui"** pour autoriser

4. **Suivez l'assistant** d'installation
   - Choisissez le dossier d'installation (défaut: `C:\Program Files\BexioDashboard`)
   - Créer des raccourcis (Bureau, Menu Démarrer)
   - Option : Installer Power BI Desktop (si pas déjà installé)

5. **Au premier lancement**, un message apparaît :
   ```
   ✅ Certificat de sécurité BSCO Solutions installé avec succès !

   L'application est maintenant reconnue comme sûre par Windows.

   Cette opération n'est effectuée qu'une seule fois.
   ```

6. **Lancez l'application** :
   - Menu Démarrer → "Dashboard Bexio"
   - Bureau → Double-clic sur raccourci

---

### Méthode 2 : Exe Portable (Sans Installation)

**Fichier :** `BexioDashboard.exe` (~100 MB) dans le dossier `BexioDashboard`

**Étapes :**

1. **Téléchargez** l'archive `BexioDashboard-Portable.zip`

2. **Extrayez** le contenu dans un dossier (ex: `C:\BexioDashboard`)

3. **Double-cliquez** sur `BexioDashboard.exe`

4. **Windows UAC** affiche "Unknown Publisher"
   → **Cliquez sur "Oui"** pour autoriser

5. **Au premier lancement**, même message de certificat installé

6. **L'application démarre** directement

**Avantages :**
- ✅ Portable (peut être sur clé USB, réseau, etc.)
- ✅ Aucune installation requise
- ✅ Pas besoin de droits admin (certificat install user-level)

**Inconvénients :**
- ❌ Pas de raccourcis automatiques
- ❌ Pas de désinstallation propre

---

## ⚠️ Antivirus - Faux Positifs Possibles

### Pourquoi mon antivirus détecte-t-il l'exe ?

**C'est un faux positif classique avec PyInstaller** (l'outil qui compile Python en exe).

**Pourquoi ?**
- Les malwares utilisent PyInstaller pour se déguiser
- Les antivirus sont prudents et bloquent TOUS les exe PyInstaller inconnus
- Un certificat auto-signé n'élimine PAS ce problème
- Seul un certificat EV (~500 EUR/an) élimine 100% des faux positifs

### Solutions

**Solution temporaire : Ajouter une exception**

| Antivirus | Instructions |
|-----------|-------------|
| **Windows Defender** | Paramètres Windows → Virus et menaces → Gérer les paramètres → Ajouter une exclusion → Dossier → `C:\Program Files\BexioDashboard` |
| **Avast / AVG** | Paramètres → Général → Exceptions → Ajouter une exception → Parcourir → `BexioDashboard.exe` |
| **Kaspersky** | Paramètres → Menaces et exclusions → Gérer les exclusions → Ajouter |
| **Norton** | Paramètres → Antivirus → Analyses et risques → Exclusions → Configurer → Ajouter |
| **Bitdefender** | Protection → Antivirus → Exceptions → Ajouter une exception |

**Solution permanente : Certificat EV**

Pour éliminer **100% des faux positifs** :
- Certificat EV professionnel (~500 EUR/an)
- DigiCert, Sectigo, etc.
- Windows affichera "Éditeur vérifié : BSCO Solutions"
- Zéro faux positif antivirus
- Réputation Windows SmartScreen immédiate

Voir : [docs/CODE_SIGNING_GUIDE.md](docs/CODE_SIGNING_GUIDE.md)

---

## 🔐 Sécurité - Vérifications

### Vérifier que l'exe provient de BSCO Solutions

**PowerShell :**
```powershell
Get-AuthenticodeSignature "BexioDashboard.exe" | Select-Object Status, SignerCertificate | Format-List
```

**Résultat attendu :**
```
Status          : Valid
SignerCertificate : [Subject]
                    CN=BSCO Solutions
                    O=BSCO Solutions
                    L=Geneva
                    S=Geneva
                    C=CH
```

### Vérifier le certificat installé

**Méthode 1 : Gestionnaire de certificats**

1. Appuyez sur **Windows + R**
2. Tapez : `certmgr.msc`
3. Ouvrez : **Autorités de certification racines de confiance** → **Certificats**
4. Cherchez : **BSCO Solutions**

**Méthode 2 : PowerShell**
```powershell
Get-ChildItem -Path Cert:\CurrentUser\Root | Where-Object { $_.Subject -like "*BSCO Solutions*" }
```

---

## 🐛 Problèmes Courants

### 1. "Windows ne trouve pas le fichier exe"

**Cause :** Antivirus a supprimé/quarantiné le fichier
**Solution :** Ajouter une exception dans l'antivirus, puis re-télécharger

### 2. "Cette application a été bloquée pour votre protection"

**Cause :** Windows SmartScreen
**Solution :** Cliquez sur "Plus d'infos" → "Exécuter quand même"

### 3. Installation bloquée par UAC

**Cause :** Droits admin requis pour installation dans `Program Files`
**Solution :** Clic droit → "Exécuter en tant qu'administrateur"

### 4. Certificat non reconnu après installation

**Cause :** Installation du certificat a échoué
**Solution :** Installer manuellement le certificat :

```powershell
# 1. Extraire le certificat de l'exe
$signature = Get-AuthenticodeSignature "BexioDashboard.exe"
$cert = $signature.SignerCertificate
Export-Certificate -Cert $cert -FilePath "BSCO.cer"

# 2. Installer dans le Windows Store
certutil -addstore -user Root "BSCO.cer"
```

### 5. L'application ne démarre pas

**Vérifications :**
1. Windows 10/11 64-bit ?
2. Antivirus bloque l'exécution ?
3. .NET Framework installé ? (normalement inclus dans Windows)

---

## 📋 Désinstallation

### Si installé avec l'installeur :

1. **Panneau de configuration** → **Programmes et fonctionnalités**
2. Cherchez : **Dashboard Bexio**
3. Clic droit → **Désinstaller**
4. Suivez l'assistant

### Si utilisé en portable :

1. Supprimez le dossier `BexioDashboard`
2. Supprimez le certificat (optionnel) :
   ```powershell
   certmgr.msc → Autorités racines → BSCO Solutions → Supprimer
   ```

---

## 💡 Questions Fréquentes (FAQ)

### Pourquoi ne pas utiliser un certificat EV directement ?

**Coût :** ~500 EUR/an
**Processus :** Vérification d'identité (1-2 semaines), documents légaux (KBIS, etc.)
**Bénéfice :** Zéro faux positif, "Éditeur vérifié" dans Windows

Pour l'instant, le certificat auto-signé permet de :
- ✅ Tester l'application gratuitement
- ✅ Distribution interne (entreprise, tests)
- ✅ Vérifier la signature et l'intégrité du fichier

Pour une distribution professionnelle large, un certificat EV est recommandé.

### Le certificat expire-t-il ?

**Oui, dans 3 ans** (généré le {{ DATE }})

Lorsque vous téléchargez une nouvelle version, un nouveau certificat sera inclus.

### Puis-je voir le code source ?

**OUI !** Totalement open-source :
[https://github.com/csigno1204/BSCO-Dashboard-PowerBI](https://github.com/csigno1204/BSCO-Dashboard-PowerBI)

### Quelles données sont collectées ?

**AUCUNE donnée n'est envoyée à l'extérieur.**

L'application :
- Se connecte uniquement à **votre API Bexio** (avec votre clé API)
- Sauvegarde les données **localement** sur votre PC
- N'envoie rien à BSCO Solutions ou ailleurs

**100% local et privé.**

---

## 📞 Support

**Problème avec l'installation ?**

1. Consultez : [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Ouvrez une issue : [GitHub Issues](https://github.com/csigno1204/BSCO-Dashboard-PowerBI/issues)
3. Email : support@bsco-solutions.ch (si disponible)

**Contributions bienvenues !**

Le projet est open-source. N'hésitez pas à contribuer :
- 🐛 Rapporter des bugs
- 💡 Proposer des fonctionnalités
- 🔧 Soumettre des Pull Requests

---

## ✅ Résumé - Étapes d'Installation

**Version courte pour les pressés :**

1. Téléchargez `BexioDashboard_Setup_v*.exe`
2. Double-cliquez
3. Windows UAC → "Unknown Publisher" → **Cliquez "Oui"**
4. Suivez l'assistant
5. Lancez l'application
6. Au 1er lancement : Message "Certificat installé ✅"
7. **C'est prêt !**

---

**Version :** 1.0.0
**Date :** Novembre 2024
**Développé par :** BSCO Solutions
**License :** MIT (Open-Source)

**🎉 Merci d'utiliser Dashboard Bexio → Power BI !**
