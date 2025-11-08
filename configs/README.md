# Gestion Multi-Clients

Ce dossier permet de gérer plusieurs configurations pour différents clients Bexio.

## Utilisation

### 1. Créer une configuration par client

Créez un fichier `.env` pour chaque client :

```bash
# Client 1
configs/client1.env

# Client 2
configs/client2.env
```

### 2. Format du fichier

Chaque fichier contient la même structure que `.env` :

```env
# Client: ABC Consulting
BEXIO_API_TOKEN=token_client_abc_ici
BEXIO_ENDPOINTS=contacts,invoices,quotes,projects
EXTRACTION_DAYS=365
```

### 3. Extraire pour un client spécifique

**Méthode 1 - Variable d'environnement:**
```bash
export CLIENT=client1
python scripts/run_pipeline.py
```

**Méthode 2 - Argument en ligne de commande:**
```bash
python scripts/run_pipeline.py --client client1
```

**Méthode 3 - Menu interactif:**
```bash
# Le menu détectera automatiquement les configurations disponibles
menu.bat    # Windows
./menu.sh   # Linux/Mac
```

## Organisation Recommandée

```
configs/
├── README.md                  (ce fichier)
├── abc_consulting.env         (Client ABC)
├── xyz_services.env           (Client XYZ)
├── john_doe_sarl.env          (Client John Doe)
└── template.env               (Template pour nouveaux clients)
```

## Données par Client

Les données sont automatiquement séparées par client :

```
data/
├── abc_consulting/
│   ├── bexio_data_20250108.xlsx
│   └── ...
├── xyz_services/
│   ├── bexio_data_20250108.xlsx
│   └── ...
```

## Bonnes Pratiques

1. **Nommage** - Utilisez des noms explicites pour les fichiers de config
2. **Sécurité** - Ne commitez JAMAIS ces fichiers dans git
3. **Backup** - Sauvegardez régulièrement les tokens API
4. **Documentation** - Ajoutez un commentaire avec le nom du client en haut du fichier

## Exemple Template

```env
# ============================================================================
# Configuration Client: [NOM DU CLIENT]
# Contact: [PERSONNE DE CONTACT]
# Email: [EMAIL]
# Dernière mise à jour: [DATE]
# ============================================================================

# Token API Bexio
BEXIO_API_TOKEN=votre_token_ici

# Données à extraire
BEXIO_ENDPOINTS=contacts,invoices,quotes,projects

# Période (jours)
EXTRACTION_DAYS=365

# Notifications (optionnel)
EMAIL_NOTIFICATIONS=false
EMAIL_TO=votre.email@example.com
```

## Migration depuis Configuration Unique

Si vous avez déjà un fichier `.env` unique :

1. Copiez `.env` vers `configs/mon_client.env`
2. Le fichier `.env` principal servira de fallback
3. Spécifiez `--client mon_client` pour utiliser la nouvelle config
