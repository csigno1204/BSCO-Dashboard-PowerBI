# 📁 Dossier Certificats

Ce dossier contient les certificats de signature de code générés.

## 📋 Contenu (après génération)

```
certificates/
├── BSCO_CodeSigning_SelfSigned.pfx    ← Certificat avec clé privée (pour signer)
├── BSCO_CodeSigning_SelfSigned.cer    ← Certificat public (pour utilisateurs)
├── CERTIFICATE_INFO.txt               ← Informations sur le certificat
└── README.md                          ← Ce fichier
```

## 🚀 Génération du Certificat

```powershell
# Depuis la racine du projet
.\scripts\generate_selfsigned_certificate.ps1
```

**Résultat :**
- Certificat généré et exporté dans ce dossier
- Certificat installé dans votre Windows Store (Trusted Root)
- Valide pendant 3 ans

## 🔏 Signature d'un Exécutable

```powershell
# Depuis la racine du projet
.\scripts\sign_executable.ps1 -ExePath "dist\BexioDashboard\BexioDashboard.exe"
```

## 📖 Documentation

- **Guide complet** : `docs/CERTIFICAT_AUTOSIGNE.md`
- **Instructions utilisateurs** : `INSTALLATION_CERTIFICAT.txt`

## ⚠️ Sécurité

**Fichiers sensibles :**
- `.pfx` : Contient la clé privée → **NE PAS PARTAGER**
- `.cer` : Clé publique uniquement → OK pour distribution

**Ce dossier est dans `.gitignore`** pour éviter de commit accidentellement les certificats.

## 🔐 Mot de Passe Par Défaut

**Mot de passe du .pfx :** `MotDePasseSecurise123!`

⚠️ **Changez ce mot de passe** en modifiant la variable `$certExportPassword` dans le script `generate_selfsigned_certificate.ps1` !

## 📊 Limites du Certificat Auto-signé

✅ **Avantages :**
- Gratuit et immédiat
- Bon pour tests et distribution interne
- Prouve l'intégrité du fichier

❌ **Limitations :**
- N'élimine PAS les faux positifs antivirus
- Nécessite installation manuelle par chaque utilisateur
- Aucune réputation SmartScreen

**→ Pour distribution professionnelle :** Certificat EV (~500 EUR/an)
**→ Voir :** `docs/CODE_SIGNING_GUIDE.md`
