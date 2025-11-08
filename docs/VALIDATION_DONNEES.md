## 🔍 Guide de Validation des Données Bexio → Power BI

Ce guide vous aide à vous assurer que vos données sont correctement extraites et compatibles avec Power BI.

---

## ⚠️ Pourquoi C'est Important ?

L'API Bexio peut retourner des structures de données différentes selon:
- La version de votre compte Bexio
- Les champs personnalisés que vous avez ajoutés
- La configuration de votre organisation

**Il est ESSENTIEL de valider avec VOS données réelles.**

---

## ✅ Processus de Validation en 4 Étapes

### Étape 1: Test de Connexion

```bash
python scripts/test_connection.py
```

**Vérifiez:**
- ✅ Le token API fonctionne
- ✅ La connexion à Bexio est stable
- ✅ Vous avez accès aux données

### Étape 2: Extraction Test

```bash
# Extraire un petit échantillon (7 jours)
# Modifiez temporairement .env:
EXTRACTION_DAYS=7

python scripts/run_pipeline.py
```

**Vérifiez les fichiers générés dans `data/`:**
- Fichiers JSON avec vos données
- Fichier Excel final

### Étape 3: Validation Automatique

```bash
python scripts/validate_data_structure.py
```

**Le script vérifie:**
- ✅ Structure des données JSON
- ✅ Types de colonnes dans Excel
- ✅ Relations entre tables
- ✅ Compatibilité Power BI

**Résultat attendu:**
```
Score de compatibilité: 95/100
🟢 Excellent - Prêt pour Power BI
```

### Étape 4: Import Power BI Test

1. Ouvrez **Power BI Desktop**
2. **Obtenir des données** → **Excel**
3. Sélectionnez le fichier dans `data/`
4. Importez **TOUTES** les tables

**Vérifiez dans Power BI:**

#### a) Types de Données

Onglet **Modèle**, vérifiez chaque table:

| Colonne | Type Attendu | Comment Corriger |
|---------|--------------|------------------|
| InvoiceID | Nombre entier | Clic droit → Type → Nombre entier |
| InvoiceDate | Date | Clic droit → Type → Date |
| Total | Nombre décimal | Clic droit → Type → Nombre décimal |
| ContactID | Nombre entier | Clic droit → Type → Nombre entier |

#### b) Relations

Créez les relations suivantes dans l'onglet **Modèle**:

| Table 1 | Colonne 1 | Table 2 | Colonne 2 | Cardinalité |
|---------|-----------|---------|-----------|-------------|
| invoices | ContactID | contacts | ContactID | Plusieurs à Un |
| invoices | ProjectID | projects | ProjectID | Plusieurs à Un |
| quotes | ContactID | contacts | ContactID | Plusieurs à Un |

**Vérifiez:**
- ✅ Les relations se créent sans erreur
- ✅ Cardinalité correcte
- ✅ Direction simple (→)

#### c) Test Visuel

Créez un **graphique simple**:
- Axe: contacts[CompanyName]
- Valeur: SUM(invoices[Total])

**Si ça fonctionne = ✅ VALIDÉ**

---

## 🔧 Problèmes Courants & Solutions

### Problème 1: Champs Manquants

**Symptôme:**
```
⚠️ Champs manquants: document_nr, is_valid_from
```

**Solution:**
1. Vérifiez les noms exacts dans l'API Bexio
2. Modifiez `scripts/data_transformer.py`:

```python
# Trouvez la fonction transform_invoices()
columns_mapping = {
    # Ancien nom (si API différente)
    'invoice_nr': 'InvoiceNumber',  # au lieu de 'document_nr'
    'date': 'InvoiceDate',           # au lieu de 'is_valid_from'
}
```

### Problème 2: Dates Non Reconnues

**Symptôme:** Dates affichées comme texte dans Power BI

**Solution:**

Dans `scripts/data_transformer.py`:

```python
# Ligne ~120
# Convertir les dates avec format explicite
if 'InvoiceDate' in df.columns:
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'],
                                       format='%Y-%m-%d',
                                       errors='coerce')
```

### Problème 3: IDs Non Numériques

**Symptôme:** Relations Power BI impossibles à créer

**Solution:**

```python
# Forcer la conversion en entier
if 'ContactID' in df.columns:
    df['ContactID'] = pd.to_numeric(df['ContactID'],
                                    errors='coerce',
                                    downcast='integer')
```

### Problème 4: Montants Incorrects

**Symptôme:** Montants multiplés par 100 (centimes au lieu de francs)

**Solution:**

```python
# Si l'API retourne des centimes
amount_columns = ['Total', 'TotalGross', 'TotalNet']
for col in amount_columns:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col]) / 100  # Convertir centimes → francs
```

### Problème 5: Données Imbriquées

**Symptôme:** Certains champs sont des dictionnaires

```json
{
  "contact": {
    "id": 123,
    "name": "ABC Company"
  }
}
```

**Solution:**

```python
# Aplatir la structure
if 'contact' in data[0] and isinstance(data[0]['contact'], dict):
    for item in data:
        item['contact_id'] = item['contact']['id']
        item['contact_name'] = item['contact']['name']
        del item['contact']
```

---

## 🧪 Mode Debug

Pour investiguer les problèmes, activez le mode debug:

```python
# Dans run_pipeline.py, ajoutez après l'extraction:

import json

# Sauvegarder un échantillon pour inspection
with open('debug_sample.json', 'w', encoding='utf-8') as f:
    json.dump(data['invoices'][0], f, indent=2, ensure_ascii=False)

print("✓ Échantillon sauvegardé dans debug_sample.json")
```

Puis examinez le fichier `debug_sample.json` pour voir la structure exacte.

---

## 📊 Checklist de Validation Complète

Avant de passer en production:

- [ ] Test de connexion API réussi
- [ ] Extraction de 7 jours réussie
- [ ] Script de validation montre 85%+ de compatibilité
- [ ] Import Power BI sans erreur
- [ ] Tous les types de colonnes corrects
- [ ] Relations créées et fonctionnelles
- [ ] Graphique test avec données réelles fonctionne
- [ ] Pas de valeurs nulles inattendues
- [ ] Montants affichés correctement (CHF)
- [ ] Dates au bon format
- [ ] KPIs cohérents avec Bexio

**Si tous les points sont cochés → ✅ Vous pouvez passer en production !**

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes spécifiques:

### 1. Générer un Rapport de Debug

```bash
python scripts/validate_data_structure.py > validation_report.txt
```

Envoyez ce fichier pour obtenir de l'aide.

### 2. Vérifier les Logs

```bash
cat logs/extraction_YYYYMMDD.log
```

### 3. Comparer avec l'API Directement

```bash
# Test manuel avec curl
curl -H "Accept: application/json" \
     -H "Authorization: Bearer VOTRE_TOKEN" \
     https://api.bexio.com/2.0/contact?limit=1
```

---

## 💡 Bonnes Pratiques

1. **Testez toujours avec un petit échantillon** (7-30 jours) avant une extraction complète
2. **Vérifiez les totaux** entre Bexio et Power BI
3. **Documentez les ajustements** que vous faites dans les scripts
4. **Créez une version de test** de votre dashboard Power BI
5. **Validez avec plusieurs types de données** (factures payées, en retard, annulées)

---

## 🚀 Validation Réussie ?

Une fois que tout fonctionne:

1. ✅ Augmentez `EXTRACTION_DAYS` à 365
2. ✅ Configurez l'actualisation automatique
3. ✅ Créez votre dashboard Power BI final
4. ✅ Activez les notifications
5. ✅ Planifiez l'extraction quotidienne

**Félicitations ! Votre système est prêt pour la production.** 🎉

---

## 📞 Support

- Documentation API Bexio: https://docs.bexio.com/
- Forum Power BI: https://community.powerbi.com/
- Script de validation: `python scripts/validate_data_structure.py`

---

**Mis à jour:** Janvier 2025
