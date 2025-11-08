# 📊 Dashboard Bexio → Power BI

Solution complète pour extraire vos données Bexio et créer des dashboards dynamiques dans Power BI.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Power BI](https://img.shields.io/badge/Power_BI-Compatible-yellow.svg)
![Bexio API](https://img.shields.io/badge/Bexio_API-2.0-green.svg)

---

## 🎯 Fonctionnalités

✅ **Extraction automatique** depuis l'API Bexio
✅ **Transformation optimisée** pour Power BI
✅ **Fichiers Excel multi-onglets** prêts à l'emploi
✅ **Requêtes Power Query (M)** pré-configurées
✅ **Mesures DAX** pour KPIs et analyses
✅ **Templates de dashboards** professionnels
✅ **Documentation complète** en français

---

## 📦 Données Supportées

Le système peut extraire et transformer:

- 👥 **Contacts** (clients, fournisseurs)
- 💰 **Factures** (invoices)
- 📋 **Devis** (quotes)
- 📦 **Commandes** (orders)
- 💼 **Projets** (projects)
- ⏱️ **Feuilles de temps** (timesheets)
- 📦 **Articles** (produits/services)

---

## 🚀 Démarrage Rapide

### Installation Automatique

**Windows:**
```cmd
# 1. Télécharger le projet
git clone <url-du-repo>
cd BSCO-Dashboard-PowerBI

# 2. Double-cliquer sur install.bat
# ou en ligne de commande:
install.bat

# 3. Configurer (copiez et éditez .env)
copy .env.example .env
notepad .env

# 4. Tester
run_test.bat

# 5. Extraire
run_extraction.bat
```

**Linux / Mac:**
```bash
# 1. Télécharger le projet
git clone <url-du-repo>
cd BSCO-Dashboard-PowerBI

# 2. Installer
bash install.sh

# 3. Configurer
cp .env.example .env
nano .env

# 4. Tester
./run_test.sh

# 5. Extraire
./run_extraction.sh
```

### 🎮 Menu Interactif

Pour encore plus de simplicité, utilisez le menu:

```cmd
menu.bat      # Windows
./menu.sh     # Linux/Mac
```

### 🧪 Mode Démonstration (Sans API)

Testez sans API Bexio avec des données fictives:

```bash
python scripts/generate_demo_data.py
python scripts/data_transformer.py
```

### Importer dans Power BI

1. Ouvrez Power BI Desktop
2. **Obtenir des données** → **Excel**
3. Sélectionnez `data/bexio_data_XXXXXXXX.xlsx`
4. Importez les onglets souhaités
5. Créez vos visualisations !

---

## 📁 Structure du Projet

```
BSCO-Dashboard-PowerBI/
├── scripts/
│   ├── bexio_extractor.py      # Extraction API Bexio
│   ├── data_transformer.py     # Transformation des données
│   ├── run_pipeline.py         # Pipeline complet
│   ├── test_connection.py      # Test de connexion API (NOUVEAU)
│   └── generate_demo_data.py   # Génération données démo (NOUVEAU)
├── data/
│   └── *.xlsx                  # Fichiers générés (ignorés par git)
├── powerbi/
│   ├── PowerQuery_Examples.m   # Requêtes Power Query
│   └── DAX_Measures.dax        # Mesures DAX pour KPIs
├── docs/
│   ├── GUIDE_INSTALLATION.md   # Guide complet d'installation
│   ├── GUIDE_DASHBOARDS.md     # Templates de dashboards
│   ├── API_REFERENCE.md        # Référence API Bexio
│   └── INSTALLATION_LOCALE.md  # Guide installation locale (NOUVEAU)
├── install.bat / install.sh    # Installation automatique (NOUVEAU)
├── menu.bat / menu.sh          # Menu interactif (NOUVEAU)
├── run_test.bat / .sh          # Test rapide connexion (NOUVEAU)
├── run_extraction.bat / .sh    # Extraction rapide (NOUVEAU)
├── .env.example                # Template de configuration
├── requirements.txt            # Dépendances Python
├── QUICKSTART.md               # Guide démarrage rapide
└── README.md                   # Ce fichier
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ Démarrage ultra-rapide (10 min) |
| **[Installation Locale](docs/INSTALLATION_LOCALE.md)** | 🖥️ Installation sur PC (NOUVEAU) |
| [Guide d'Installation](docs/GUIDE_INSTALLATION.md) | Installation pas à pas et configuration |
| [Guide des Dashboards](docs/GUIDE_DASHBOARDS.md) | Templates et bonnes pratiques |
| [Requêtes Power Query](powerbi/PowerQuery_Examples.m) | Exemples de requêtes M |
| [Mesures DAX](powerbi/DAX_Measures.dax) | KPIs et calculs avancés |
| [API Reference](docs/API_REFERENCE.md) | Documentation API Bexio |

---

## 💡 Exemples d'Utilisation

### Extraire uniquement les factures

```python
from scripts.bexio_extractor import BexioExtractor

extractor = BexioExtractor()
invoices = extractor.extract_invoices(days=90)
extractor.save_to_json({'invoices': invoices})
```

### Transformer des données spécifiques

```python
from scripts.data_transformer import BexioTransformer

transformer = BexioTransformer()
dataframes = transformer.transform_all()
transformer.save_to_excel(dataframes)
```

---

## 📊 Dashboards Recommandés

Le projet inclut 5 templates de dashboards:

1. **📈 Vue d'Ensemble Financière** - KPIs et tendances CA
2. **💰 Gestion de Trésorerie** - Factures et retards de paiement
3. **👥 Analyse Clients** - Segmentation et géographie
4. **📈 Suivi Commercial** - Pipeline et conversions
5. **⏱️ Gestion du Temps** - Projets et rentabilité

Voir le [Guide des Dashboards](docs/GUIDE_DASHBOARDS.md) pour plus de détails.

---

## 🔄 Actualisation Automatique

### Windows (Planificateur de tâches)

```powershell
# Créer une tâche planifiée quotidienne
schtasks /create /tn "Bexio Sync" /tr "python C:\chemin\vers\scripts\run_pipeline.py" /sc daily /st 06:00
```

### Linux/Mac (Cron)

```bash
# Ajouter au crontab (tous les jours à 6h)
0 6 * * * cd /chemin/vers/BSCO-Dashboard-PowerBI && python scripts/run_pipeline.py
```

---

## 🛠️ Technologies Utilisées

- **Python 3.8+** - Extraction et transformation
- **Pandas** - Manipulation des données
- **Requests** - Appels API REST
- **OpenPyXL** - Génération Excel
- **Power BI** - Visualisation
- **Bexio API 2.0** - Source de données

---

## 📋 Prérequis

- Python 3.8 ou supérieur
- Power BI Desktop (gratuit)
- Compte Bexio avec accès API
- Windows, macOS ou Linux

---

## ❓ FAQ

### Comment obtenir un token API Bexio ?
Connectez-vous à Bexio → Paramètres → Intégrations → API

### Combien de temps prend l'extraction ?
Entre 30 secondes et 5 minutes selon le volume de données

### Les données sont-elles stockées en local ?
Oui, tous les fichiers sont générés dans le dossier `data/`

### Puis-je personnaliser les données extraites ?
Oui, éditez `BEXIO_ENDPOINTS` dans `.env`

### Power BI Pro est-il nécessaire ?
Non, Power BI Desktop (gratuit) suffit. Pro est requis uniquement pour le partage cloud.

---

## 🔐 Sécurité

- ⚠️ Ne commitez **jamais** votre fichier `.env` (token API)
- ⚠️ Les fichiers de données sont exclus du git via `.gitignore`
- ⚠️ Utilisez des variables d'environnement pour les tokens
- ⚠️ Limitez les permissions de votre token API Bexio

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer:

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📞 Support

- 📧 Email: support@example.com
- 📖 Documentation Bexio: https://docs.bexio.com/
- 📖 Documentation Power BI: https://docs.microsoft.com/power-bi/

---

## ⭐ Remerciements

- [Bexio](https://www.bexio.com/) pour leur excellente API
- [Microsoft Power BI](https://powerbi.microsoft.com/) pour l'outil de visualisation
- La communauté Python pour les bibliothèques utilisées

---

**Fait avec ❤️ pour simplifier votre gestion d'entreprise**