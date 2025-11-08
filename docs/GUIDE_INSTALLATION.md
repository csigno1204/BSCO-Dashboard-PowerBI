# Guide d'Installation - Dashboard Bexio → Power BI

## 📋 Prérequis

### Logiciels requis
- **Python 3.8+** - [Télécharger Python](https://www.python.org/downloads/)
- **Power BI Desktop** - [Télécharger Power BI](https://powerbi.microsoft.com/fr-fr/desktop/)
- **Compte Bexio** avec accès API

### Accès API Bexio
Vous devez obtenir un token d'API depuis votre compte Bexio:

1. Connectez-vous à [Bexio](https://office.bexio.com)
2. Allez dans **Paramètres** → **Intégrations** → **API**
3. Créez une nouvelle application OAuth ou utilisez un token existant
4. Copiez le **token d'accès** (vous en aurez besoin lors de la configuration)

📚 [Documentation API Bexio](https://docs.bexio.com/)

---

## 🚀 Installation

### Étape 1: Cloner le projet

```bash
git clone <url-du-repo>
cd BSCO-Dashboard-PowerBI
```

### Étape 2: Installer les dépendances Python

```bash
pip install -r requirements.txt
```

### Étape 3: Configuration

1. Copiez le fichier d'exemple de configuration:
```bash
cp .env.example .env
```

2. Éditez le fichier `.env` avec vos informations:
```bash
# Ouvrez .env avec votre éditeur préféré
notepad .env  # Windows
nano .env     # Linux/Mac
```

3. Remplissez les informations:
```env
BEXIO_API_TOKEN=votre_token_api_ici
BEXIO_ORGANIZATION_ID=votre_organization_id

# Choisissez les données à extraire (séparées par des virgules)
BEXIO_ENDPOINTS=contacts,invoices,quotes,projects

# Période d'extraction (jours)
EXTRACTION_DAYS=365
```

### Étape 4: Test de connexion

Testez que tout fonctionne:

```bash
python scripts/bexio_extractor.py
```

Si tout est correctement configuré, vous devriez voir:
```
=== Extracteur de données Bexio ===

Endpoints à extraire: contacts, invoices, quotes, projects
Période d'extraction: 365 jours

Extraction des contacts...
✓ XX enregistrement(s) sauvegardé(s) dans data/contacts_XXXXXXXX_XXXXXX.json
...
✓ Extraction terminée avec succès!
```

---

## 📊 Utilisation

### Méthode 1: Pipeline complet (Recommandé)

Exécutez le pipeline complet qui fait tout automatiquement:

```bash
python scripts/run_pipeline.py
```

Ce script va:
1. ✅ Extraire les données depuis Bexio
2. ✅ Transformer les données en format Excel
3. ✅ Générer un fichier `bexio_data_XXXXXXXX.xlsx`

Le fichier généré se trouvera dans le dossier `data/`.

### Méthode 2: Étape par étape

Si vous préférez exécuter les étapes séparément:

**1. Extraction des données:**
```bash
python scripts/bexio_extractor.py
```

**2. Transformation en Excel:**
```bash
python scripts/data_transformer.py
```

---

## 💼 Importer dans Power BI

### Étape 1: Ouvrir Power BI Desktop

1. Lancez **Power BI Desktop**
2. Cliquez sur **Obtenir des données** (ou **Get Data**)
3. Sélectionnez **Excel**

### Étape 2: Sélectionner le fichier

1. Naviguez vers le dossier `data/` du projet
2. Sélectionnez le fichier le plus récent: `bexio_data_XXXXXXXX.xlsx`
3. Cochez tous les onglets que vous souhaitez importer:
   - ✅ contacts
   - ✅ invoices
   - ✅ quotes
   - ✅ projects
   - etc.
4. Cliquez sur **Charger** (ou **Transform Data** pour plus d'options)

### Étape 3: Créer les relations

Dans l'onglet **Modèle** de Power BI, créez les relations suivantes:

| Table 1        | Colonne 1     | Table 2    | Colonne 2  | Cardinalité |
|----------------|---------------|------------|------------|-------------|
| Invoices       | ContactID     | Contacts   | ContactID  | Many-to-One |
| Invoices       | ProjectID     | Projects   | ProjectID  | Many-to-One |
| Quotes         | ContactID     | Contacts   | ContactID  | Many-to-One |
| Timesheets     | ProjectID     | Projects   | ProjectID  | Many-to-One |

💡 **Astuce**: Si vous créez une table Calendrier (voir `PowerQuery_Examples.m`), reliez-la à `InvoiceDate`.

---

## 🎨 Créer votre premier dashboard

### Visuels recommandés

**1. KPIs principaux (Cartes)**
- Chiffre d'affaires total
- Nombre de factures
- Nombre de clients actifs
- Taux de conversion devis → factures

**2. Graphiques temporels**
- Évolution du CA par mois (Graphique en courbes)
- Factures par trimestre (Graphique en barres)
- Tendance des devis (Graphique combiné)

**3. Analyses clients**
- Top 10 clients par CA (Graphique en barres)
- Répartition géographique (Carte)
- Segmentation clients (Graphique en secteurs)

**4. Projets**
- Projets actifs vs terminés (Jauge)
- Rentabilité par projet (Tableau)

### Utiliser les mesures DAX

1. Dans Power BI, cliquez sur **Nouvelle mesure**
2. Ouvrez le fichier `powerbi/DAX_Measures.dax`
3. Copiez-collez les mesures dont vous avez besoin
4. Utilisez ces mesures dans vos visuels

Exemples de mesures utiles:
- `Total Revenue`
- `Revenue Growth %`
- `Average Invoice Value`
- `Overdue Rate %`

---

## 🔄 Actualisation automatique

### Option 1: Actualisation manuelle

Dans Power BI:
1. Cliquez sur **Accueil** → **Actualiser**
2. Ou appuyez sur `F5`

### Option 2: Planification automatique

**Pour automatiser l'extraction:**

**Windows (Planificateur de tâches):**
1. Ouvrez le Planificateur de tâches Windows
2. Créez une nouvelle tâche
3. Action: `python C:\chemin\vers\scripts\run_pipeline.py`
4. Déclencheur: Quotidien à 6h du matin (par exemple)

**Linux/Mac (Cron):**
```bash
# Éditez le crontab
crontab -e

# Ajoutez cette ligne pour exécuter tous les jours à 6h
0 6 * * * cd /chemin/vers/BSCO-Dashboard-PowerBI && python scripts/run_pipeline.py
```

**Pour Power BI Service (Cloud):**
1. Publiez votre rapport sur powerbi.com
2. Configurez l'actualisation automatique dans les paramètres du dataset
3. Nécessite une **Power BI Gateway** pour accéder aux fichiers locaux

---

## ❓ Dépannage

### Erreur: "BEXIO_API_TOKEN non défini"
- Vérifiez que le fichier `.env` existe
- Vérifiez que le token est correctement configuré dans `.env`

### Erreur: "401 Unauthorized"
- Votre token API est invalide ou expiré
- Générez un nouveau token dans Bexio

### Erreur: "Module not found"
- Installez les dépendances: `pip install -r requirements.txt`

### Aucune donnée extraite
- Vérifiez votre connexion Internet
- Vérifiez que vous avez des données dans Bexio pour la période sélectionnée
- Augmentez `EXTRACTION_DAYS` dans `.env`

### Le fichier Excel est vide
- Exécutez d'abord `bexio_extractor.py`
- Vérifiez que les fichiers JSON existent dans `data/`

---

## 📞 Support

Pour toute question:
1. Consultez la documentation Bexio: https://docs.bexio.com/
2. Consultez la documentation Power BI: https://docs.microsoft.com/power-bi/
3. Ouvrez une issue dans ce projet

---

## 📝 Prochaines étapes

- [ ] Créer votre premier dashboard
- [ ] Personnaliser les mesures DAX selon vos besoins
- [ ] Planifier l'actualisation automatique
- [ ] Partager le dashboard avec votre équipe
- [ ] Créer des alertes sur les KPIs importants
