# 📊 Guide du Template Power BI

Ce guide explique comment créer un fichier Power BI (.pbix) optimisé pour vos données Bexio.

---

## 🎯 Pourquoi un Template ?

Un template Power BI pré-configuré vous fait gagner des heures :
- ✅ Toutes les relations entre tables déjà créées
- ✅ Mesures DAX prêtes à l'emploi
- ✅ Visuels professionnels pré-configurés
- ✅ Design cohérent et moderne
- ✅ Actualisation des données en 1 clic

---

## 🚀 Création du Template (Étape par Étape)

### Étape 1: Importer les Données

1. Ouvrez **Power BI Desktop**
2. **Obtenir des données** → **Excel**
3. Sélectionnez `data/bexio_data_XXXXXXXX.xlsx`
4. Cochez **toutes les tables** :
   - ✅ contacts
   - ✅ invoices
   - ✅ quotes
   - ✅ projects
   - ✅ timesheets (si disponible)
   - ✅ articles (si disponible)
5. Cliquez sur **Transformer les données**

### Étape 2: Vérifier les Types de Données

Dans l'**Éditeur Power Query**, vérifiez les types :

**Table invoices:**
- InvoiceID → Nombre entier
- InvoiceDate → Date
- DueDate → Date
- Total, TotalGross, TotalNet → Nombre décimal
- ContactID, ProjectID, StatusID → Nombre entier

**Table contacts:**
- ContactID → Nombre entier
- ContactNumber → Texte
- CompanyName, ContactName, Email, City → Texte

**Table projects:**
- ProjectID → Nombre entier
- StartDate, EndDate → Date

Cliquez sur **Fermer et appliquer**

### Étape 3: Créer les Relations

Dans l'onglet **Modèle**, créez ces relations :

| Table 1    | Colonne 1 | Table 2   | Colonne 2  | Cardinalité   |
|------------|-----------|-----------|------------|---------------|
| invoices   | ContactID | contacts  | ContactID  | Plusieurs-à-Un|
| invoices   | ProjectID | projects  | ProjectID  | Plusieurs-à-Un|
| quotes     | ContactID | contacts  | ContactID  | Plusieurs-à-Un|
| timesheets | ProjectID | projects  | ProjectID  | Plusieurs-à-Un|

**Toutes les relations doivent être en direction simple (→)**

### Étape 4: Créer une Table Calendrier

**Nouvelle table DAX** (Modélisation → Nouvelle table) :

```dax
Calendrier =
ADDCOLUMNS(
    CALENDARAUTO(),
    "Année", YEAR([Date]),
    "Trimestre", "T" & QUARTER([Date]),
    "Mois", MONTH([Date]),
    "NomMois", FORMAT([Date], "MMMM"),
    "Jour", DAY([Date]),
    "NomJour", FORMAT([Date], "DDDD"),
    "NumSemaine", WEEKNUM([Date]),
    "EstWeekend", WEEKDAY([Date]) IN {1, 7}
)
```

**Relation :**
- Calendrier[Date] → invoices[InvoiceDate]

### Étape 5: Ajouter les Mesures DAX

Créez un **groupe de mesures** nommé "_Mesures" :

Copiez-collez les mesures depuis `DAX_Measures.dax` :

**Mesures essentielles à créer :**
```dax
Total CA = SUM(invoices[Total])

Nombre Factures = COUNTROWS(invoices)

Panier Moyen = DIVIDE([Total CA], [Nombre Factures], 0)

CA YTD = TOTALYTD([Total CA], Calendrier[Date])

Croissance % =
VAR CAActuel = [Total CA]
VAR CAMoisPrecedent = CALCULATE([Total CA], PREVIOUSMONTH(Calendrier[Date]))
RETURN DIVIDE(CAActuel - CAMoisPrecedent, CAMoisPrecedent, 0)

Factures en Retard = CALCULATE(COUNTROWS(invoices), invoices[DaysOverdue] > 0)

Taux de Retard = DIVIDE([Factures en Retard], [Nombre Factures], 0)
```

---

## 🎨 Pages Recommandées du Dashboard

### Page 1: Vue d'Ensemble Financière

**KPIs (Cartes) :**
- Total CA
- Croissance %
- Nombre Factures
- Panier Moyen

**Graphiques :**
1. **Évolution CA mensuelle** (Courbes et colonnes)
   - Axe X: Calendrier[NomMois]
   - Colonnes: Total CA
   - Ligne: Croissance %

2. **Top 10 Clients** (Barres horizontales)
   - Axe Y: contacts[CompanyName]
   - Axe X: Total CA
   - Tri: Décroissant

3. **CA par Projet** (Secteurs ou Treemap)
   - Catégorie: projects[ProjectName]
   - Valeurs: Total CA

### Page 2: Trésorerie

**KPIs :**
- Factures en Retard
- Montant en Retard
- Taux de Retard
- Délai Moyen Paiement

**Graphiques :**
1. **Statut des factures** (Graphique en anneau)
   - Légende: invoices[StatusID]
   - Valeurs: Nombre Factures

2. **Évolution retards** (Courbe)
   - Axe X: Calendrier[Date]
   - Axe Y: Montant en Retard

3. **Top clients en retard** (Table)
   - Colonnes: CompanyName, Montant dû, Jours retard

### Page 3: Analyse Clients

**KPIs :**
- Clients Actifs
- Nouveaux Clients
- CA par Client
- Part Top 20%

**Graphiques :**
1. **Segmentation ABC** (Barres empilées)
2. **Carte géographique** (Carte avec bulles)
3. **Matrice clients** (Table croisée)

### Page 4: Performance Commerciale

**KPIs :**
- Devis en Cours
- Valeur Pipeline
- Taux de Conversion
- Cycle de Vente Moyen

**Graphiques :**
1. **Entonnoir conversion**
2. **Pipeline par mois**
3. **Performance par commercial**

### Page 5: Projets et Temps

**KPIs :**
- Heures Facturables
- Taux d'Utilisation
- Projets Actifs
- Taux Horaire Moyen

**Graphiques :**
1. **Répartition temps** (Secteurs)
2. **Heures par projet** (Barres)
3. **Rentabilité** (Table détaillée)

---

## 🎨 Design et Thème

### Palette de Couleurs Recommandée

**Couleurs principales :**
- Primaire: `#0078D4` (Bleu Microsoft)
- Succès: `#107C10` (Vert)
- Attention: `#FFB900` (Orange)
- Danger: `#D13438` (Rouge)
- Neutre: `#5A5A5A` (Gris)

**Arrière-plan :**
- Fond page: `#F3F2F1` (Gris très clair)
- Fond visuels: `#FFFFFF` (Blanc)

### Format et Style

**Police :**
- Titres: Segoe UI Bold, 16pt
- Sous-titres: Segoe UI Semibold, 12pt
- Texte: Segoe UI, 10pt

**Marges :**
- Entre visuels: 10-15px
- Bords de page: 20px

---

## 🔄 Actualisation des Données

### Méthode 1: Actualisation Manuelle

1. Cliquez sur **Accueil** → **Actualiser**
2. Ou appuyez sur **F5**

Power BI recharge automatiquement le fichier Excel le plus récent.

### Méthode 2: Actualisation Automatique

**Pour fichiers locaux :**

Créez un script batch/shell qui :
1. Lance l'extraction : `run_extraction.bat`
2. Actualise Power BI Desktop (non automatisable)

**Pour Power BI Service (Cloud) :**

1. Publiez le rapport sur powerbi.com
2. Configurez une **actualisation planifiée**
3. Installez une **Gateway** pour accéder aux fichiers locaux

---

## 📱 Version Mobile

Pour optimiser l'affichage mobile :

1. **Affichage** → **Affichage mobile**
2. Glissez les visuels importants
3. Privilégiez :
   - Cartes (KPIs)
   - Graphiques simples
   - Filtres en haut

---

## 💾 Sauvegarder le Template

1. **Fichier** → **Enregistrer sous**
2. Nom suggéré: `Dashboard_Bexio_Template.pbix`
3. Emplacement: dossier `powerbi/`

**Pour créer un vrai template (.pbit) :**
1. **Fichier** → **Exporter** → **Modèle Power BI**
2. Ajoutez une description
3. Sauvegardez avec extension `.pbit`

Le fichier .pbit demandera le chemin du fichier Excel à chaque ouverture.

---

## 🚀 Utilisation du Template

1. Double-cliquez sur le .pbix ou .pbit
2. Si .pbit: Indiquez le chemin du fichier Excel
3. Cliquez sur **Actualiser**
4. Vos données sont à jour !

---

## 🎓 Ressources Supplémentaires

- [Documentation Power BI](https://docs.microsoft.com/power-bi/)
- [Galerie de visuels](https://appsource.microsoft.com/marketplace/apps?product=power-bi-visuals)
- [Communauté Power BI](https://community.powerbi.com/)
- [Formations gratuites](https://learn.microsoft.com/training/powerbi/)

---

## 💡 Astuces Pro

1. **Performances** : Limitez le nombre de visuels par page (< 10)
2. **Filtres** : Utilisez des segments (slicers) plutôt que des filtres de page
3. **Hiérarchies** : Créez Année > Trimestre > Mois pour drill-down
4. **Info-bulles** : Ajoutez des pages d'info-bulles pour détails au survol
5. **Signets** : Créez des signets pour navigation rapide
6. **Favoris** : Marquez les pages importantes en favoris

---

**Votre template est prêt !** 🎉

Pour toute question, consultez les autres guides dans `docs/`.
