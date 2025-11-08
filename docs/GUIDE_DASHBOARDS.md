# Guide de Création de Dashboards

## 📊 Templates de Dashboards Recommandés

Ce guide présente plusieurs templates de dashboards adaptés à différents besoins métier.

---

## 🎯 Dashboard 1: Vue d'Ensemble Financière

**Public cible:** Direction, CFO
**Objectif:** Suivre les indicateurs financiers clés

### KPIs Principaux

| Indicateur | Mesure DAX | Visuel |
|------------|------------|--------|
| CA Total | `Total Revenue` | Carte |
| Croissance vs N-1 | `YoY Growth %` | Carte avec flèche |
| CA YTD | `Revenue YTD` | Carte |
| Objectif Atteint | `Target Achievement %` | Jauge |

### Graphiques

1. **Évolution mensuelle du CA**
   - Type: Graphique en courbes + colonnes
   - Axe X: Mois
   - Axe Y: Chiffre d'affaires
   - Ligne: Moyenne mobile 3 mois

2. **CA par trimestre**
   - Type: Graphique en barres
   - Comparaison N vs N-1

3. **Top 10 Clients**
   - Type: Graphique en barres horizontales
   - Tri: CA décroissant

4. **Répartition CA par projet**
   - Type: Graphique en secteurs ou Treemap

### Filtres (Slicers)
- Année
- Trimestre
- Type de client
- Responsable commercial

---

## 💰 Dashboard 2: Gestion de Trésorerie

**Public cible:** Comptabilité, Trésorerie
**Objectif:** Suivre les encaissements et retards de paiement

### KPIs Principaux

| Indicateur | Mesure DAX | Visuel |
|------------|------------|--------|
| Factures en Retard | `Overdue Invoices` | Carte (rouge) |
| Montant en Retard | `Overdue Amount` | Carte (rouge) |
| Taux de Retard | `Overdue Rate %` | Jauge |
| Délai Moyen Paiement | `Average Payment Delay Days` | Carte |

### Graphiques

1. **Factures par statut**
   - Type: Graphique en barres empilées
   - Catégories: Payé, En retard, À échoir

2. **Évolution des retards de paiement**
   - Type: Graphique en courbes
   - Axe X: Mois
   - Axe Y: Montant en retard

3. **Top 10 clients en retard**
   - Type: Table
   - Colonnes: Client, Montant dû, Jours de retard

4. **Prévisions d'encaissement**
   - Type: Graphique en courbes
   - Par date d'échéance

### Actions recommandées
- Définir des alertes sur retards > 30 jours
- Code couleur: Vert (< 15j), Orange (15-30j), Rouge (> 30j)

---

## 👥 Dashboard 3: Analyse Clients

**Public cible:** Commercial, Marketing
**Objectif:** Comprendre le portefeuille clients

### KPIs Principaux

| Indicateur | Mesure DAX | Visuel |
|------------|------------|--------|
| Clients Actifs | `Active Customers` | Carte |
| CA par Client | `Revenue Per Customer` | Carte |
| Part Top 20% | `Top 20% Revenue Share` | Jauge |
| Nouveaux Clients | Custom | Carte |

### Graphiques

1. **Segmentation ABC**
   - Type: Graphique en barres empilées
   - A: Top 20% clients (80% CA)
   - B: 30% suivants (15% CA)
   - C: 50% restants (5% CA)

2. **Carte géographique**
   - Type: Carte
   - Bulles: CA par ville/région

3. **Matrice RFM** (Récence, Fréquence, Montant)
   - Type: Matrice
   - Lignes: Récence (dernier achat)
   - Colonnes: Fréquence (nb factures)
   - Valeurs: Montant total

4. **Évolution du portefeuille**
   - Type: Graphique en aires
   - Nouveaux clients vs clients perdus

### Filtres
- Région
- Secteur d'activité
- Segment (A/B/C)
- Date de première vente

---

## 📈 Dashboard 4: Suivi Commercial

**Public cible:** Équipe commerciale
**Objectif:** Suivre le pipeline et les conversions

### KPIs Principaux

| Indicateur | Mesure DAX | Visuel |
|------------|------------|--------|
| Devis en Cours | `Quote Count` | Carte |
| Valeur Pipeline | `Total Quote Value` | Carte |
| Taux de Conversion | `Conversion Rate %` | Jauge |
| Cycle de Vente Moyen | `Average Sales Cycle Days` | Carte |

### Graphiques

1. **Tunnel de conversion**
   - Type: Graphique en entonnoir
   - Étapes: Devis → Devis acceptés → Factures → Payé

2. **Devis par statut**
   - Type: Graphique en colonnes empilées
   - Statuts: En attente, Accepté, Refusé, Expiré

3. **Performance commerciale**
   - Type: Table
   - Colonnes: Commercial, Nb devis, Valeur, Taux conversion

4. **Évolution du pipeline**
   - Type: Graphique en aires
   - Par mois et par statut

### Alertes
- Devis sans réponse > 15 jours
- Taux de conversion < objectif

---

## ⏱️ Dashboard 5: Gestion du Temps et Projets

**Public cible:** Chefs de projet, RH
**Objectif:** Suivre la rentabilité et le temps passé

### KPIs Principaux

| Indicateur | Mesure DAX | Visuel |
|------------|------------|--------|
| Heures Facturables | `Total Billable Hours` | Carte |
| Taux d'Utilisation | `Utilization Rate %` | Jauge |
| Taux Horaire Moyen | `Average Hourly Rate` | Carte |
| Projets Actifs | `Active Projects` | Carte |

### Graphiques

1. **Répartition du temps**
   - Type: Graphique en secteurs
   - Facturable vs Non-facturable

2. **Heures par projet**
   - Type: Graphique en barres
   - Avec seuil d'alerte (budget dépassé)

3. **Rentabilité par projet**
   - Type: Table
   - Colonnes: Projet, Heures, CA, Taux horaire, Marge

4. **Charge de travail par personne**
   - Type: Graphique en barres empilées
   - Par semaine/mois

5. **Évolution du taux d'utilisation**
   - Type: Graphique en courbes
   - Objectif: > 75%

---

## 🎨 Bonnes Pratiques de Design

### Couleurs

**Palette recommandée:**
```
Primaire: #0078D4 (Bleu)
Succès: #107C10 (Vert)
Attention: #FFB900 (Orange)
Danger: #D13438 (Rouge)
Neutre: #5A5A5A (Gris)
```

**Code couleur pour les KPIs:**
- 🟢 Vert: Objectif atteint (>= 100%)
- 🟠 Orange: Attention (80-99%)
- 🔴 Rouge: Critique (< 80%)

### Mise en Page

**Structure recommandée:**
```
┌─────────────────────────────────────────┐
│           TITRE DU DASHBOARD            │
├─────────┬─────────┬─────────┬───────────┤
│  KPI 1  │  KPI 2  │  KPI 3  │   KPI 4   │
├─────────┴─────────┴─────────┴───────────┤
│                                         │
│         Graphique Principal             │
│                                         │
├──────────────────┬──────────────────────┤
│   Graphique 2    │    Graphique 3      │
├──────────────────┴──────────────────────┤
│           Table Détaillée               │
└─────────────────────────────────────────┘
```

### Filtres

**Positionnement:**
- Filtres globaux: En haut ou à gauche
- Filtres spécifiques: À côté du visuel concerné

**Types de filtres à prévoir:**
- 📅 Date (Toujours présent)
- 👤 Responsable/Commercial
- 🏢 Client/Catégorie client
- 📍 Région/Pays
- 💼 Projet/Service

---

## 📱 Version Mobile

Pour optimiser l'affichage sur mobile:

1. Créez une vue mobile dans Power BI
2. Privilégiez les visuels verticaux
3. Limitez à 4-6 KPIs par page
4. Utilisez des cartes plutôt que des graphiques complexes

---

## 🔄 Actualisation

### Fréquence recommandée par dashboard:

| Dashboard | Fréquence | Raison |
|-----------|-----------|--------|
| Vue Financière | Quotidienne | Suivi opérationnel |
| Trésorerie | 2x/jour | Gestion des retards |
| Analyse Clients | Hebdomadaire | Évolution lente |
| Suivi Commercial | Quotidienne | Décisions rapides |
| Gestion Temps | En temps réel | Si possible via API |

---

## 📋 Checklist de Déploiement

Avant de partager un dashboard:

- [ ] Tous les visuels s'affichent correctement
- [ ] Les relations entre tables sont correctes
- [ ] Les mesures DAX fonctionnent sans erreur
- [ ] Les filtres sont pertinents et fonctionnels
- [ ] Le format des nombres est correct (CHF, %, etc.)
- [ ] Les couleurs sont cohérentes
- [ ] Un titre clair est défini
- [ ] La mise en page est responsive
- [ ] Les données sensibles sont masquées si nécessaire
- [ ] Un mode "lecture seule" est configuré pour les utilisateurs

---

## 🎓 Ressources Supplémentaires

- [Galerie de visuels Power BI](https://appsource.microsoft.com/marketplace/apps?product=power-bi-visuals)
- [Modèles de dashboards](https://community.powerbi.com/t5/Data-Stories-Gallery/bd-p/DataStoriesGallery)
- [Best practices Power BI](https://docs.microsoft.com/power-bi/guidance/)

---

## 💡 Conseils Pratiques

1. **Commencez simple**: Un dashboard avec 5 KPIs bien choisis vaut mieux qu'un dashboard surchargé
2. **Testez avec les utilisateurs**: Montrez des versions beta et recueillez les feedbacks
3. **Documentez**: Ajoutez des infobulles pour expliquer les indicateurs
4. **Itérez**: Un dashboard évolue avec les besoins métier
5. **Formez les utilisateurs**: Organisez des sessions de formation

---

Bon dashboard! 🚀
