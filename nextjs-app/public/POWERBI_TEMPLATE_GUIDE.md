# 📊 Guide de Création du Template Power BI

## Vue d'Ensemble

Ce guide explique comment créer un template Power BI (.pbix) optimisé pour les données Bexio exportées depuis ce dashboard.

## Structure du Fichier Excel Exporté

Le fichier `bexio_complete_YYYY-MM-DD.xlsx` contient 11 feuilles :

1. **Dashboard** - KPIs résumés
2. **Contacts** - Liste complète des contacts
3. **Factures** - Toutes les factures
4. **Offres** - Toutes les offres/devis
5. **Commandes** - Toutes les commandes
6. **Projets** - Liste des projets
7. **Temps** - Temps trackés
8. **Articles** - Catalogue articles
9. **Top Clients** - Top 10 clients par CA
10. **Tendances** - CA mensuel sur 12 mois
11. **Analyse Factures** - Factures avec statuts enrichis

---

## Étape 1 : Import des Données

### Dans Power BI Desktop

1. Fichier → Obtenir des données → Excel
2. Sélectionner toutes les feuilles sauf "Dashboard" (données agrégées)
3. Cliquer sur "Transformer les données"

### Transformations Recommandées

**Pour toutes les tables :**
- Promouvoir les en-têtes
- Détecter les types de données automatiquement
- Supprimer les colonnes vides

**Table Factures :**
```powerquery
// Convertir les dates
= Table.TransformColumnTypes(#"Promoted Headers",{
    {"is_valid_from", type date},
    {"is_valid_until", type date}
})

// Ajouter colonne Année
= Table.AddColumn(#"Changed Type", "Année", each Date.Year([is_valid_from]))

// Ajouter colonne Mois
= Table.AddColumn(#"Added Year", "Mois", each Date.Month([is_valid_from]))
```

**Table Tendances :**
```powerquery
// Parser la colonne Mois (format YYYY-MM)
= Table.TransformColumns(#"Promoted Headers",{
    {"Mois", each Date.From(Text.From(_) & "-01"), type date}
})
```

---

## Étape 2 : Créer le Modèle de Données

### Relations à Créer

```
Factures[contact_id] → Contacts[id] (Many-to-One)
Offres[contact_id] → Contacts[id] (Many-to-One)
Commandes[contact_id] → Contacts[id] (Many-to-One)
Projets[contact_id] → Contacts[id] (Many-to-One)
```

### Mesures DAX Recommandées

**Mesures Financières :**

```dax
// Chiffre d'affaires total
CA Total = SUM(Factures[total])

// CA Payé
CA Payé =
CALCULATE(
    SUM(Factures[total]),
    Factures[Statut] = "Payée"
)

// CA En Attente
CA En Attente =
CALCULATE(
    SUM(Factures[total]),
    Factures[Statut] = "En attente"
)

// CA En Retard
CA En Retard =
CALCULATE(
    SUM(Factures[total]),
    Factures[Statut] = "En retard"
)

// Facture Moyenne
Facture Moyenne =
DIVIDE(
    [CA Total],
    COUNTROWS(Factures),
    0
)
```

**Mesures Offres :**

```dax
// Taux de Conversion
Taux Conversion =
DIVIDE(
    COUNTROWS(FILTER(Offres, Offres[kb_item_status_id] = 8)),
    COUNTROWS(Offres),
    0
) * 100

// Valeur Offres Acceptées
Valeur Offres Acceptées =
CALCULATE(
    SUM(Offres[total]),
    Offres[kb_item_status_id] = 8
)
```

**Mesures Temps :**

```dax
// Heures Totales
Heures Totales = SUM(Temps[duration])

// Taux de Facturation
Taux Facturation =
DIVIDE(
    COUNTROWS(FILTER(Temps, Temps[allowable_bill] = 1)),
    COUNTROWS(Temps),
    0
) * 100
```

**Mesures Clients :**

```dax
// Nombre de Clients
Nombre Clients = DISTINCTCOUNT(Contacts[id])

// CA Moyen par Client
CA Moyen Client =
DIVIDE(
    [CA Total],
    [Nombre Clients],
    0
)
```

---

## Étape 3 : Créer les Pages du Rapport

### Page 1 : Dashboard Principal

**Layout :**
```
┌─────────────────────────────────────────┐
│  KPI Cards (4 cartes)                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ CA   │ │Factur│ │Clients│ │Projets│  │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│                                          │
│  Graphique Tendances (Ligne)            │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Top 5 Clients (Barres horizontales)    │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Visuels :**
1. **Carte KPI** : CA Total
   - Champ : `[CA Total]`
   - Format : `# ##0 CHF`

2. **Carte KPI** : Nombre de Factures
   - Champ : `COUNTROWS(Factures)`

3. **Carte KPI** : Nombre de Clients
   - Champ : `[Nombre Clients]`

4. **Carte KPI** : Projets Actifs
   - Champ : `COUNTROWS(Projets)`
   - Filtre : `pr_state_id IN (1, 2)`

5. **Graphique en Courbes** : Tendances
   - Axe X : `Tendances[Mois]`
   - Valeurs : `Tendances[Chiffre d'affaires]`
   - Couleur : Gradient bleu

6. **Barres Horizontales** : Top 5 Clients
   - Axe Y : `Top Clients[Nom]`
   - Axe X : `Top Clients[Chiffre d'affaires]`
   - Top N : 5
   - Couleur : Violet

### Page 2 : Analyse Financière

**Layout :**
```
┌─────────────────────────────────────────┐
│  Statut Factures (Camembert)            │
│  ┌──────────────┐ ┌──────────────┐      │
│  │              │ │              │      │
│  │  Statut      │ │  Répartition │      │
│  │  Factures    │ │  CA          │      │
│  └──────────────┘ └──────────────┘      │
│                                          │
│  Tableau Factures Détaillé              │
│  ┌──────────────────────────────────┐   │
│  │ N° │ Client │ Montant │ Statut  │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Segment : Période                       │
│  [▼ 2024] [▼ Tous les mois]             │
└─────────────────────────────────────────┘
```

**Visuels :**
1. **Camembert** : Statut Factures
   - Légende : `Analyse Factures[Statut]`
   - Valeurs : `COUNTROWS(Analyse Factures)`

2. **Camembert** : Répartition CA
   - Légende : `Analyse Factures[Statut]`
   - Valeurs : `SUM(Analyse Factures[Montant])`

3. **Tableau** : Factures Détaillées
   - Colonnes : N° Facture, Client, Montant, Date, Statut
   - Tri : Par date décroissante

4. **Segment** : Année
5. **Segment** : Mois

### Page 3 : Analyse Clients

**Layout :**
```
┌─────────────────────────────────────────┐
│  Top 10 Clients (Barres)                │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Matrice Clients                         │
│  ┌──────────────────────────────────┐   │
│  │ Client │ CA │ Factures │ Offres │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Carte : Répartition Géographique       │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Page 4 : Projets & Temps

**Layout :**
```
┌─────────────────────────────────────────┐
│  Statut Projets (Anneau)                │
│  ┌──────────────┐ ┌──────────────┐      │
│  │              │ │  Heures      │      │
│  │  Projets     │ │  Totales     │      │
│  └──────────────┘ └──────────────┘      │
│                                          │
│  Tableau Projets                         │
│  ┌──────────────────────────────────┐   │
│  │ Projet │ Client │ Heures │ Statut│   │
│  └──────────────────────────────────┘   │
│                                          │
│  Graphique : Heures par Mois            │
│  ┌──────────────────────────────────┐   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Étape 4 : Personnalisation

### Thème de Couleurs

```json
{
  "name": "Bexio Dashboard Theme",
  "dataColors": [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#4facfe",
    "#43e97b",
    "#fa709a",
    "#fee140"
  ],
  "background": "#FFFFFF",
  "foreground": "#1F2937",
  "tableAccent": "#667eea"
}
```

### Polices Recommandées
- Titres : **Segoe UI Bold** 16pt
- Sous-titres : **Segoe UI Semibold** 12pt
- Corps : **Segoe UI** 10pt

### Palette de Couleurs
- Bleu Primary : `#667eea`
- Violet Secondary : `#764ba2`
- Vert Success : `#43e97b`
- Orange Warning : `#fa709a`
- Rouge Danger : `#f85032`

---

## Étape 5 : Export et Partage

### Sauvegarder comme Template

1. Fichier → Enregistrer sous
2. Nom : `Bexio_Dashboard_Template.pbix`
3. Emplacement : Dossier partagé

### Publier sur Power BI Service

1. Fichier → Publier → Power BI Service
2. Sélectionner l'espace de travail
3. Configurer l'actualisation planifiée :
   - Fréquence : Quotidienne
   - Heure : 06:00 (avant arrivée équipe)

### Créer une Application

1. Dans Power BI Service, aller dans l'espace de travail
2. Créer une application
3. Ajouter les rapports souhaités
4. Partager avec les utilisateurs finaux

---

## Maintenance et Mises à Jour

### Actualisation des Données

**Manuelle :**
1. Exporter nouveau fichier Excel depuis le dashboard
2. Ouvrir le .pbix
3. Transformer les données → Paramètres de source
4. Pointer vers le nouveau fichier
5. Actualiser

**Automatique (Power BI Pro requis) :**
1. Configurer Power Automate pour télécharger automatiquement le fichier
2. Le placer dans un dossier OneDrive/SharePoint
3. Configurer Power BI pour pointer vers ce dossier
4. Activer l'actualisation planifiée

---

## Dépannage

### Problème : Relations ne fonctionnent pas
**Solution :** Vérifier que les types de données correspondent (ID entiers)

### Problème : Erreur lors de l'import
**Solution :** Vérifier que le fichier Excel n'est pas ouvert ailleurs

### Problème : Visualisations lentes
**Solution :** Réduire le nombre de lignes importées avec des filtres

### Problème : Données manquantes
**Solution :** Vérifier que la synchronisation Bexio s'est bien déroulée

---

## Ressources Complémentaires

- [Documentation Power BI](https://learn.microsoft.com/fr-fr/power-bi/)
- [DAX Guide](https://dax.guide/)
- [Power BI Community](https://community.powerbi.com/)
- [Tutoriels YouTube](https://www.youtube.com/results?search_query=power+bi+tutorial)

---

**Version :** 1.0
**Date :** 2025-11-10
**Compatible avec :** Power BI Desktop (Novembre 2024 ou ultérieur)
