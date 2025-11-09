# 🔄 Comparateur de Données

## 📋 Vue d'Ensemble

Le **Comparateur de Données** permet de comparer deux extractions Bexio pour détecter instantanément tous les changements :
- 🆕 Nouveaux enregistrements (clients, factures, etc.)
- 🗑️ Enregistrements supprimés
- ✏️ Enregistrements modifiés (quels champs ont changé)
- 💰 Évolution du CA et autres métriques business

**Valeur métier énorme** : Détectez immédiatement ce qui a changé dans votre activité !

---

## 🎯 Cas d'Usage

### 1. Suivi Quotidien
Comparez l'extraction d'aujourd'hui avec celle d'hier :
- Nouvelles factures créées ?
- Factures payées ?
- Nouveaux clients ?
- Montants modifiés ?

### 2. Audit & Conformité
Vérifiez les modifications :
- Qui a changé quoi ?
- Quelles factures ont été modifiées ?
- Montants incorrects corrigés ?

### 3. Reporting
Générez des rapports de changements :
- Pour la direction
- Pour les clients
- Pour l'équipe

### 4. Détection d'Anomalies
Identifiez rapidement :
- Factures supprimées par erreur
- Modifications suspectes
- Données manquantes

---

## 🚀 Utilisation

### Méthode 1 : Interface Graphique (GUI)

**Le plus simple !**

1. **Lancez l'interface graphique**
   ```bash
   python scripts/gui_app.py
   # OU
   ./run_gui.sh
   ```

2. **Cliquez sur "🔄 Comparer Données"**

3. **Sélectionnez l'ancienne extraction**
   - Dialogue de sélection de fichier
   - Par défaut dans le dossier `data/`

4. **Sélectionnez la nouvelle extraction**
   - Autre dialogue de sélection

5. **Visualisez les résultats**
   - Résumé dans les logs
   - Rapport HTML généré automatiquement
   - Export JSON pour intégrations

6. **Ouvrez le rapport**
   - Popup demande si vous voulez ouvrir
   - S'ouvre dans votre navigateur
   - Design professionnel avec couleurs

---

### Méthode 2 : Ligne de Commande (CLI)

**Pour automatisations**

```bash
# Syntaxe de base
python scripts/data_comparator.py <ancien_fichier.xlsx> <nouveau_fichier.xlsx>

# Exemple
python scripts/data_comparator.py \
    data/bexio_20250101.xlsx \
    data/bexio_20250115.xlsx
```

**Ce qui se passe :**
1. ✅ Compare les deux fichiers
2. ✅ Affiche résumé dans la console
3. ✅ Génère rapport HTML (`reports/comparison_report_*.html`)
4. ✅ Exporte JSON (`reports/comparison_*.json`)

---

### Méthode 3 : Python (Programmatique)

**Pour intégrations personnalisées**

```python
from scripts.data_comparator import DataComparator

# Créer le comparateur
comparator = DataComparator()

# Comparer deux fichiers
results = comparator.compare_files(
    'data/bexio_old.xlsx',
    'data/bexio_new.xlsx'
)

# Accéder aux résultats
for table_name, diff in results['tables'].items():
    print(f"{table_name}:")
    print(f"  Nouveaux: {diff['summary']['new_count']}")
    print(f"  Supprimés: {diff['summary']['deleted_count']}")
    print(f"  Modifiés: {diff['summary']['modified_count']}")

# Générer rapports
html_file = comparator.generate_html_report()
json_file = comparator.export_json()

print(f"Rapport: {html_file}")
```

---

## 📊 Ce Qui Est Détecté

### Nouveaux Enregistrements (🆕)

**Pour chaque table (contacts, invoices, etc.)**, détecte les nouveaux IDs présents dans la nouvelle extraction mais pas dans l'ancienne.

**Exemple :**
```
Invoices:
  🆕 15 nouvelles factures

Contacts:
  🆕 3 nouveaux clients
```

---

### Enregistrements Supprimés (🗑️)

Détecte les IDs présents dans l'ancienne extraction mais plus dans la nouvelle.

**Exemple :**
```
Invoices:
  🗑️ 2 factures supprimées
```

⚠️ **Attention** : Peut indiquer :
- Suppression volontaire
- Erreur d'extraction
- Changement de périmètre

---

### Enregistrements Modifiés (✏️)

Pour les enregistrements présents dans les deux, détecte **chaque champ** qui a changé.

**Exemple détaillé :**
```
Invoice #RE-2025-00123:
  Status: Draft → Paid
  Total: 1000.00 → 1200.00
  DueDate: 2025-01-15 → 2025-01-20
```

**Quels changements sont détectés :**
- ✅ Montants
- ✅ Dates
- ✅ Statuts
- ✅ Textes
- ✅ Tous les champs

---

### Métriques Business (💰)

Calcule automatiquement des **KPI métier** :

#### 1. Évolution du CA

```
CA: 150'000 CHF → 165'000 CHF
Évolution: ↑ +15'000 CHF (+10.0%)
```

Basé sur la somme des montants des factures.

#### 2. Nouveaux Clients

```
Nouveaux clients: 5
```

Nombre de contacts ajoutés.

#### 3. Factures Payées

```
Factures payées: 12
```

Factures dont le statut est passé à "Paid"/"Payé".

#### 4. Retards de Paiement

```
Retards: +3 factures en retard
```

*(À venir dans version future)*

---

## 📄 Rapports Générés

### 1. Rapport HTML

**Fichier :** `reports/comparison_report_YYYYMMDD_HHMMSS.html`

**Contenu :**
- En-tête avec noms des fichiers comparés
- Cartes de métriques business (CA, nouveaux clients, etc.)
- Tableau détaillé par table
- Design professionnel avec couleurs
- Badges visuels (🆕, 🗑️, ✏️, ✓)

**Avantages :**
- ✅ Visuel et professionnel
- ✅ Partageable (envoyer par email)
- ✅ Imprimable
- ✅ Ouvrable dans n'importe quel navigateur

**Capture d'écran du rapport :**

```
╔═══════════════════════════════════════════════╗
║   📊 Rapport de Comparaison                   ║
║   Dashboard Bexio → Power BI                  ║
║   bexio_old.xlsx ➔ bexio_new.xlsx            ║
╚═══════════════════════════════════════════════╝

┌─────────────────┐ ┌─────────────────┐
│ Évolution CA    │ │ Nouveaux Clients│
│ +15'000 CHF     │ │       5         │
│ ↑ +10.0%        │ │  🆕 Ajoutés     │
└─────────────────┘ └─────────────────┘

Invoices
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type              | Nombre | Détails
──────────────────|--------|──────────
🆕 Nouveaux       |   15   | Enr. ajoutés
✏️ Modifiés       |    8   | Enr. modifiés
✓ Inchangés       |  120   | Aucune modif
```

---

### 2. Export JSON

**Fichier :** `reports/comparison_YYYYMMDD_HHMMSS.json`

**Structure :**
```json
{
  "comparison_date": "2025-01-15T10:30:00",
  "old_file": "bexio_old.xlsx",
  "new_file": "bexio_new.xlsx",
  "tables": {
    "invoices": {
      "summary": {
        "total_old": 135,
        "total_new": 143,
        "new_count": 15,
        "deleted_count": 2,
        "modified_count": 8,
        "unchanged_count": 120
      },
      "new_records": [...],
      "deleted_records": [...],
      "modified_records": [
        {
          "InvoiceID": 123,
          "changes": {
            "Status": {
              "old": "Draft",
              "new": "Paid"
            },
            "Total": {
              "old": "1000.00",
              "new": "1200.00"
            }
          }
        }
      ]
    }
  },
  "business_metrics": {
    "revenue_change": {
      "old": 150000,
      "new": 165000,
      "change": 15000,
      "change_percent": 10.0
    },
    "new_clients_count": 5,
    "invoices_paid": 12
  }
}
```

**Utilisation :**
- ✅ Intégration avec autres systèmes
- ✅ Traitement automatisé
- ✅ Stockage dans base de données
- ✅ Alertes automatiques

---

### 3. Affichage Console

**Pour CLI :** Résumé textuel dans le terminal

```
🔍 Comparaison de données
============================================================
📁 Ancien: bexio_20250101.xlsx
📁 Nouveau: bexio_20250115.xlsx
============================================================

📊 Comparaison table: invoices
   • 135 → 143 enregistrements
   • 🆕 15 nouveaux
   • 🗑️ 2 supprimés
   • ✏️ 8 modifiés
   • ✓ 120 inchangés

============================================================
📊 RÉSUMÉ DE LA COMPARAISON
============================================================

💰 Métriques Business:
   • CA: 150'000 CHF → 165'000 CHF
   • Évolution: ↑ +15'000 CHF (+10.0%)
   • Nouveaux clients: 5
   • Factures payées: 12

📋 Changements par Table:

   Invoices:
      🆕 15 nouveaux
      🗑️ 2 supprimés
      ✏️ 8 modifiés
      ✓ 120 inchangés

============================================================

✅ Rapport HTML généré: reports/comparison_report_*.html
✅ Résultats JSON exportés: reports/comparison_*.json
✅ Comparaison terminée avec succès!
```

---

## 🛠️ Configuration

### Tables Supportées

Le comparateur détecte automatiquement les tables suivantes :

| Table | Colonne ID | Description |
|-------|------------|-------------|
| **contacts** | ContactID | Clients/Fournisseurs |
| **invoices** | InvoiceID | Factures |
| **quotes** | QuoteID | Devis |
| **projects** | ProjectID | Projets |
| **timesheets** | TimesheetID | Feuilles de temps |

**Ajout de nouvelles tables :**

Éditez `scripts/data_comparator.py` :

```python
id_columns = {
    'contacts': 'ContactID',
    'invoices': 'InvoiceID',
    'ma_table': 'MonID',  # ← Ajoutez ici
}
```

---

### Personnalisation des Métriques

Vous pouvez ajouter vos propres métriques business dans `_calculate_business_metrics()` :

```python
# Exemple : Taux de conversion devis → factures
if 'quotes' in old_data and 'invoices' in new_data:
    old_quotes = len(old_data['quotes'])
    new_invoices_from_quotes = ...  # Votre logique

    metrics['conversion_rate'] = {
        'value': new_invoices_from_quotes / old_quotes * 100
    }
```

---

## 💡 Conseils d'Utilisation

### 1. Fréquence de Comparaison

**Recommandations :**

| Fréquence | Cas d'usage | Avantages |
|-----------|-------------|-----------|
| **Quotidienne** | Suivi opérationnel | Détection rapide des problèmes |
| **Hebdomadaire** | Reporting management | Vision des tendances |
| **Mensuelle** | Analyse stratégique | Évolutions long terme |
| **Avant/Après événement** | Audit ponctuel | Vérification impact |

---

### 2. Nommage des Fichiers

**Convention recommandée :**

```
data/
├── bexio_20250101_120000.xlsx  ← YYYYMMDD_HHMMSS
├── bexio_20250102_120000.xlsx
├── bexio_20250103_120000.xlsx
└── ...
```

**Avantages :**
- ✅ Tri chronologique automatique
- ✅ Facile à identifier
- ✅ Pas de confusion

---

### 3. Workflow Recommandé

**Routine quotidienne :**

```bash
# 1. Extraction du jour
python scripts/run_pipeline.py

# 2. Comparaison avec hier
python scripts/data_comparator.py \
    data/bexio_$(date -d yesterday +%Y%m%d).xlsx \
    data/bexio_$(date +%Y%m%d).xlsx

# 3. Consulter le rapport
# S'ouvre automatiquement dans le navigateur
```

**Automatisation avec cron (Linux/Mac) :**

```bash
# Chaque jour à 9h
0 9 * * * cd /path/to/project && ./scripts/daily_comparison.sh
```

---

### 4. Interprétation des Résultats

#### 🆕 Beaucoup de nouveaux enregistrements

**Normal si :**
- Forte activité commerciale
- Période de facturation
- Import de données

**Alerte si :**
- Doublon possible
- Erreur d'import

#### 🗑️ Enregistrements supprimés

**⚠️ ATTENTION** - À investiguer :
- Suppression accidentelle ?
- Erreur d'extraction ?
- Changement de périmètre ?

**Action :** Vérifier dans Bexio

#### ✏️ Modifications massives

**Normal si :**
- Correction de données
- Mise à jour statuts
- Encaissement de factures

**Alerte si :**
- Modifications non autorisées
- Changements suspects de montants

---

## 🎨 Personnalisation du Rapport HTML

### Changer les Couleurs

Éditez `scripts/data_comparator.py`, fonction `generate_html_report()` :

```css
<style>
    /* Gradient principal */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    /* Changer pour vos couleurs */
    background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
</style>
```

---

### Ajouter Votre Logo

Dans le HTML généré, ajoutez :

```html
<div class="header">
    <img src="votre_logo.png" alt="Logo" style="max-width: 200px;">
    <h1>📊 Rapport de Comparaison</h1>
</div>
```

---

## 🔧 Dépannage

### Erreur : "Colonne ID non trouvée"

**Cause :** La colonne ID configurée n'existe pas dans le fichier.

**Solution :**
1. Vérifiez les noms de colonnes :
   ```bash
   python -c "import pandas as pd; print(pd.read_excel('data/file.xlsx').columns.tolist())"
   ```

2. Ajustez dans `id_columns` :
   ```python
   id_columns = {
       'ma_table': 'MonNouveauNomDeColonne'
   }
   ```

---

### Erreur : "Fichier non trouvé"

**Cause :** Chemin incorrect

**Solution :**
- Utilisez des chemins absolus
- Ou lancez depuis la racine du projet
- Vérifiez avec `ls data/`

---

### Pas de changements détectés (mais il devrait y en avoir)

**Causes possibles :**

1. **Mêmes fichiers comparés**
   - Vérifiez les noms de fichiers

2. **Colonnes ID différentes**
   - Les IDs doivent correspondre

3. **Format de données différent**
   - Dates, nombres peuvent avoir formats différents

**Solution :**
```python
# Activer le debug
comparator = DataComparator()
comparator.debug = True  # Affiche plus d'informations
```

---

### Rapport HTML ne s'ouvre pas

**Causes :**

1. **Navigateur par défaut non configuré**
   - Ouvrez manuellement : `reports/comparison_report_*.html`

2. **Chemin avec espaces**
   - Entourez de guillemets

---

## 📈 Exemples d'Utilisation

### Exemple 1 : Suivi Mensuel du CA

```python
from scripts.data_comparator import DataComparator
import glob

# Récupérer les fichiers du mois
files = sorted(glob.glob('data/bexio_202501*.xlsx'))

# Comparer début et fin de mois
comparator = DataComparator()
results = comparator.compare_files(files[0], files[-1])

# Évolution du CA
bm = results['business_metrics']
if bm['revenue_change']:
    print(f"CA mensuel: {bm['revenue_change']['change_percent']:+.1f}%")
```

---

### Exemple 2 : Alertes Automatiques

```python
# Comparer
comparator = DataComparator()
results = comparator.compare_files('old.xlsx', 'new.xlsx')

# Vérifier alertes
if results['tables']['invoices']['summary']['deleted_count'] > 0:
    # Envoyer email d'alerte
    send_alert("🚨 Factures supprimées détectées!")

# CA en baisse
bm = results['business_metrics']
if bm['revenue_change']['change'] < 0:
    send_alert(f"⚠️ CA en baisse de {abs(bm['revenue_change']['change_percent']):.1f}%")
```

---

### Exemple 3 : Export vers Base de Données

```python
import json
from sqlalchemy import create_engine

# Comparer
comparator = DataComparator()
results = comparator.compare_files('old.xlsx', 'new.xlsx')

# Export JSON
json_file = comparator.export_json()

# Charger dans DB
engine = create_engine('postgresql://user:pass@localhost/db')
with open(json_file) as f:
    data = json.load(f)

# Insérer dans table "comparisons"
# ... votre logique SQL ...
```

---

## 🚀 Améliorations Futures

### Fonctionnalités Prévues

- [ ] **Comparaison multi-fichiers** (comparer 3+ fichiers)
- [ ] **Détection de patterns** (tendances automatiques)
- [ ] **Alertes intelligentes** (ML pour anomalies)
- [ ] **Export Power BI** (table de différences importable)
- [ ] **Historique de comparaisons** (dashboard évolution)
- [ ] **Comparaison par période** (hebdo, mensuel, annuel)
- [ ] **Export Excel avec surlignage** (cellules modifiées en couleur)
- [ ] **Webhooks** (notification Slack/Teams automatique)

---

## 📞 Support

### Questions Fréquentes

**Q: Puis-je comparer des fichiers de formats différents ?**
R: Actuellement, uniquement Excel (.xlsx). JSON/CSV à venir.

**Q: Quelle est la taille maximale de fichier ?**
R: Testé jusqu'à 50'000 lignes sans problème. Au-delà, peut être lent.

**Q: Les rapports sont-ils sécurisés ?**
R: Oui, générés localement. Aucune donnée envoyée sur internet.

**Q: Puis-je personnaliser les métriques business ?**
R: Oui ! Éditez `_calculate_business_metrics()` dans le code.

---

### Ressources

- **Documentation complète** : `docs/`
- **Code source** : `scripts/data_comparator.py`
- **Exemples** : `docs/COMPARATEUR.md` (ce fichier)
- **Issues** : https://github.com/csigno1204/BSCO-Dashboard-PowerBI/issues

---

## ✅ Résumé

**Le Comparateur de Données vous permet de :**

✅ Comparer deux extractions en quelques clics
✅ Détecter tous les changements automatiquement
✅ Visualiser l'évolution du CA et KPI métier
✅ Générer des rapports professionnels (HTML + JSON)
✅ Identifier rapidement les anomalies
✅ Gagner un temps énorme en audit

**3 façons de l'utiliser :**
1. GUI (le plus simple)
2. CLI (pour automatisation)
3. Python (pour intégrations)

**Rapports générés :**
- HTML professionnel
- JSON pour intégrations
- Console pour monitoring

---

**Créé le :** Janvier 2025
**Dernière mise à jour :** Janvier 2025
**Version :** 1.0.0

© 2025 BSCO Solutions - Dashboard Bexio Power BI
