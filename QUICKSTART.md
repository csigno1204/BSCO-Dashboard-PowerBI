# 🚀 Démarrage Rapide - Dashboard Bexio → Power BI

Guide ultra-rapide pour être opérationnel en 10 minutes.

---

## ⏱️ En 5 étapes (10 minutes)

### 1️⃣ Installation (2 min)

```bash
# Cloner et installer
git clone <url-du-repo>
cd BSCO-Dashboard-PowerBI
pip install -r requirements.txt
```

### 2️⃣ Configuration (3 min)

```bash
# Copier le fichier de configuration
cp .env.example .env
```

Éditez `.env` et ajoutez votre token API Bexio:

```env
BEXIO_API_TOKEN=votre_token_ici
BEXIO_ENDPOINTS=contacts,invoices,quotes,projects
EXTRACTION_DAYS=365
```

**Comment obtenir le token:**
1. Allez sur https://office.bexio.com
2. **Paramètres** → **Intégrations** → **API**
3. Copiez le token

### 3️⃣ Extraction (2 min)

```bash
python scripts/run_pipeline.py
```

Attendez que l'extraction se termine. Un fichier Excel sera créé dans `data/`.

### 4️⃣ Power BI (2 min)

1. Ouvrez **Power BI Desktop**
2. **Obtenir des données** → **Excel**
3. Sélectionnez `data/bexio_data_XXXXXXXX.xlsx`
4. Cochez tous les onglets → **Charger**

### 5️⃣ Premier Dashboard (1 min)

Créez votre premier visuel:

1. Glissez `InvoiceDate` sur le canvas
2. Glissez `Total` sur le même visuel
3. Changez le type en **Graphique en courbes**
4. ✅ Votre premier graphique est prêt!

---

## 📊 Dashboard en 1 Clic

Pour créer rapidement un dashboard professionnel:

### Créer les mesures DAX essentielles

1. Dans Power BI, cliquez sur **Nouvelle mesure**
2. Copiez-collez ces 4 mesures:

```dax
Total Revenue = SUM(Invoices[Total])

Invoice Count = COUNTROWS(Invoices)

Average Invoice = DIVIDE([Total Revenue], [Invoice Count], 0)

Revenue Growth % =
DIVIDE(
    [Total Revenue] - CALCULATE([Total Revenue], PREVIOUSMONTH(Invoices[InvoiceDate])),
    CALCULATE([Total Revenue], PREVIOUSMONTH(Invoices[InvoiceDate])),
    0
)
```

### Créer le dashboard

**Ligne 1 - KPIs (Cartes):**
- Total Revenue
- Invoice Count
- Average Invoice
- Revenue Growth %

**Ligne 2 - Graphique principal:**
- Type: Courbes et colonnes groupées
- Axe: InvoiceDate (par mois)
- Colonnes: Total Revenue
- Ligne: Revenue Growth %

**Ligne 3 - Deux graphiques:**
- Gauche: Top 10 clients (barres)
- Droite: CA par projet (secteurs)

---

## 🔄 Actualisation Quotidienne

### Windows

Créez un fichier `sync_bexio.bat`:

```bat
@echo off
cd C:\chemin\vers\BSCO-Dashboard-PowerBI
python scripts\run_pipeline.py
```

Planifiez avec le Planificateur de tâches:
- Tâche: `C:\chemin\vers\sync_bexio.bat`
- Déclencheur: Quotidien à 6h00

### Mac/Linux

Ajoutez au crontab (`crontab -e`):

```bash
0 6 * * * cd /chemin/vers/BSCO-Dashboard-PowerBI && python scripts/run_pipeline.py
```

---

## 💡 Templates Prêts à l'Emploi

### Dashboard Financier Simple

**4 KPIs + 3 Graphiques = Dashboard complet**

```dax
// KPIs
Total CA = SUM(Invoices[Total])
Nb Factures = COUNTROWS(Invoices)
Panier Moyen = DIVIDE([Total CA], [Nb Factures])
Taux Retard = DIVIDE(CALCULATE(COUNTROWS(Invoices), Invoices[DaysOverdue] > 0), [Nb Factures])

// Graphiques
1. Évolution CA mensuelle (courbe)
2. Top 10 clients (barres)
3. Statut factures (secteurs)
```

### Dashboard Commercial

```dax
// KPIs
Devis = COUNTROWS(Quotes)
Valeur Pipeline = SUM(Quotes[Total])
Taux Conversion = DIVIDE(
    CALCULATE(COUNTROWS(Quotes), Quotes[StatusID] = 4),
    [Devis]
)

// Graphiques
1. Entonnoir conversion
2. Pipeline par commercial
3. Devis par mois
```

---

## 🎨 Personnalisation Rapide

### Changer les couleurs

Thème bleu professionnel:
- Primaire: `#0078D4`
- Succès: `#107C10`
- Danger: `#D13438`

### Ajouter un logo

1. **Insérer** → **Image**
2. Placez en haut à gauche
3. Redimensionnez (150x50 px environ)

### Filtres recommandés

Ajoutez ces 3 filtres (slicers):
- 📅 Année
- 👤 Client
- 💼 Projet

---

## 📖 Documentation Complète

Pour aller plus loin:

- [Guide d'Installation Complet](docs/GUIDE_INSTALLATION.md)
- [Templates de Dashboards](docs/GUIDE_DASHBOARDS.md)
- [Référence API Bexio](docs/API_REFERENCE.md)
- [Mesures DAX Avancées](powerbi/DAX_Measures.dax)
- [Requêtes Power Query](powerbi/PowerQuery_Examples.m)

---

## ❓ Problèmes Courants

### Erreur "Token invalide"
→ Vérifiez que le token dans `.env` est correct

### Aucune donnée extraite
→ Augmentez `EXTRACTION_DAYS` dans `.env`

### Power BI ne trouve pas le fichier
→ Utilisez le chemin absolu du fichier Excel

### Fichier Excel vide
→ Exécutez d'abord `python scripts/run_pipeline.py`

---

## 🎯 Prochaines Étapes

Maintenant que votre premier dashboard fonctionne:

- [ ] Personnalisez les visuels selon vos besoins
- [ ] Ajoutez plus de mesures DAX (voir `DAX_Measures.dax`)
- [ ] Configurez l'actualisation automatique
- [ ] Partagez le dashboard avec votre équipe
- [ ] Créez des alertes sur les KPIs critiques

---

## 💬 Besoin d'Aide?

- 📖 Consultez le [README.md](README.md) pour plus d'infos
- 📧 Contactez le support: support@example.com
- 🌐 Documentation Bexio: https://docs.bexio.com/

---

**C'est tout! Vous avez maintenant un dashboard Bexio fonctionnel dans Power BI** 🎉

Temps total: **~10 minutes** ⏱️
