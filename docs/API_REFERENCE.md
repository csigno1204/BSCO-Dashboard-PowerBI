# Référence API Bexio

Ce document décrit les endpoints de l'API Bexio utilisés par le projet et comment les personnaliser.

---

## 📚 Documentation Officielle

- **Documentation complète**: https://docs.bexio.com/
- **API Reference**: https://docs.bexio.com/legacy/resources/
- **OAuth 2.0**: https://docs.bexio.com/oauth/

---

## 🔑 Authentification

### Obtenir un Token API

1. Connectez-vous à https://office.bexio.com
2. Allez dans **Paramètres** → **Intégrations** → **API**
3. Créez une nouvelle application OAuth 2.0
4. Copiez le **Access Token**

### Utiliser le Token

Le token doit être inclus dans chaque requête:

```bash
Authorization: Bearer VOTRE_TOKEN_ICI
```

---

## 📊 Endpoints Disponibles

### Base URL
```
https://api.bexio.com/2.0
```

---

## 👥 Contacts

### GET /contact

Récupère la liste de tous les contacts (clients, fournisseurs).

**Endpoint:**
```
GET https://api.bexio.com/2.0/contact
```

**Réponse (exemple):**
```json
[
  {
    "id": 123,
    "nr": "10001",
    "name_1": "Entreprise SA",
    "name_2": "Jean Dupont",
    "email": "contact@entreprise.ch",
    "phone_fixed": "+41 21 123 45 67",
    "phone_mobile": "+41 79 123 45 67",
    "address": "Rue Example 10",
    "postcode": "1000",
    "city": "Lausanne",
    "country_id": 1,
    "contact_type_id": 1,
    "owner_id": 1,
    "user_id": 1
  }
]
```

**Champs importants:**
- `id`: Identifiant unique du contact
- `nr`: Numéro du contact
- `name_1`: Nom de l'entreprise
- `name_2`: Nom de la personne de contact
- `contact_type_id`: Type (1=Entreprise, 2=Particulier)

---

## 💰 Factures

### GET /kb_invoice

Récupère la liste des factures.

**Endpoint:**
```
GET https://api.bexio.com/2.0/kb_invoice
```

**Paramètres optionnels:**
- `order_by`: Tri (ex: `id`, `document_nr`)
- `limit`: Nombre maximum de résultats
- `offset`: Pagination

**Réponse (exemple):**
```json
[
  {
    "id": 456,
    "document_nr": "RE-2024-00123",
    "title": "Facture janvier 2024",
    "contact_id": 123,
    "user_id": 1,
    "project_id": 10,
    "language_id": 1,
    "bank_account_id": 1,
    "currency_id": 1,
    "header": "Merci pour votre commande",
    "footer": "Paiement sous 30 jours",
    "total_gross": 12000.00,
    "total_net": 10000.00,
    "total": 10000.00,
    "total_taxes": 770.00,
    "is_valid_from": "2024-01-15",
    "is_valid_to": "2024-02-15",
    "kb_item_status_id": 5,
    "api_reference": null,
    "viewed_by_client_at": null,
    "updated_at": "2024-01-15 10:30:00",
    "created_at": "2024-01-15 10:00:00"
  }
]
```

**Champs importants:**
- `id`: Identifiant unique
- `document_nr`: Numéro de facture
- `is_valid_from`: Date de facture
- `is_valid_to`: Date d'échéance
- `kb_item_status_id`: Statut (voir table des statuts)

**Statuts de facture (kb_item_status_id):**
- `1`: Brouillon
- `5`: En attente
- `9`: Partiellement payée
- `10`: Payée
- `18`: Annulée

---

## 📋 Devis

### GET /kb_offer

Récupère la liste des devis/offres.

**Endpoint:**
```
GET https://api.bexio.com/2.0/kb_offer
```

**Réponse (similaire aux factures):**
```json
[
  {
    "id": 789,
    "document_nr": "AN-2024-00045",
    "title": "Offre projet web",
    "contact_id": 123,
    "total": 25000.00,
    "is_valid_from": "2024-01-10",
    "is_valid_until": "2024-02-10",
    "kb_item_status_id": 4
  }
]
```

**Statuts de devis:**
- `1`: Brouillon
- `2`: En attente
- `4`: Accepté
- `5`: Refusé
- `6`: Expiré

---

## 📦 Commandes

### GET /kb_order

Récupère la liste des commandes.

**Endpoint:**
```
GET https://api.bexio.com/2.0/kb_order
```

Structure identique aux factures et devis.

---

## 💼 Projets

### GET /pr_project

Récupère la liste des projets.

**Endpoint:**
```
GET https://api.bexio.com/2.0/pr_project
```

**Réponse (exemple):**
```json
[
  {
    "id": 10,
    "nr": "P-2024-001",
    "name": "Développement application mobile",
    "start_date": "2024-01-01",
    "end_date": "2024-06-30",
    "comment": "Projet pour client XYZ",
    "pr_state_id": 1,
    "pr_project_type_id": 2,
    "contact_id": 123,
    "contact_sub_id": null,
    "pr_invoice_type_id": 3,
    "user_id": 1
  }
]
```

**Statuts de projet (pr_state_id):**
- `1`: Actif
- `2`: Archivé
- `3`: Annulé

---

## ⏱️ Feuilles de Temps

### GET /timesheet

Récupère les entrées de temps.

**Endpoint:**
```
GET https://api.bexio.com/2.0/timesheet
```

**Réponse (exemple):**
```json
[
  {
    "id": 1001,
    "user_id": 1,
    "status_id": 2,
    "date": "2024-01-15",
    "duration": 28800,
    "client_service_id": 5,
    "text": "Développement fonctionnalité X",
    "allowable_bill": true,
    "contact_id": 123,
    "pr_project_id": 10,
    "pr_package_id": null
  }
]
```

**Champs importants:**
- `duration`: Durée en secondes (28800 = 8 heures)
- `allowable_bill`: Facturable (true/false)
- `status_id`: Statut de l'entrée

---

## 📦 Articles

### GET /article

Récupère la liste des articles/produits/services.

**Endpoint:**
```
GET https://api.bexio.com/2.0/article
```

**Réponse (exemple):**
```json
[
  {
    "id": 50,
    "user_id": 1,
    "article_type_id": 1,
    "contact_id": null,
    "deliverer_code": "",
    "deliverer_name": "",
    "deliverer_description": "",
    "intern_code": "SVC-001",
    "intern_name": "Consultation",
    "intern_description": "Consultation technique",
    "purchase_price": 0.00,
    "sale_price": 150.00,
    "purchase_total": 0.00,
    "sale_total": 0.00,
    "currency_id": 1,
    "tax_id": 1,
    "unit_id": 1
  }
]
```

---

## 🔍 Recherche et Filtrage

### Filtrer les résultats

Utilisez les paramètres de recherche:

```bash
GET /kb_invoice?order_by=id&limit=100&offset=0
```

### Recherche par critères

Utilisez l'endpoint de recherche:

```bash
POST /kb_invoice/search
Content-Type: application/json

{
  "field": "contact_id",
  "value": 123,
  "criteria": "="
}
```

**Critères disponibles:**
- `=`: Égal
- `!=`: Différent
- `>`: Supérieur
- `<`: Inférieur
- `>=`: Supérieur ou égal
- `<=`: Inférieur ou égal
- `like`: Contient
- `not_like`: Ne contient pas

---

## 📊 Personnaliser l'Extraction

### Modifier les endpoints extraits

Éditez `.env`:

```env
# Extraire uniquement certaines données
BEXIO_ENDPOINTS=contacts,invoices

# Extraire toutes les données
BEXIO_ENDPOINTS=contacts,invoices,quotes,orders,projects,timesheets,articles
```

### Modifier la période d'extraction

```env
# Extraire seulement les 90 derniers jours
EXTRACTION_DAYS=90

# Extraire 2 ans de données
EXTRACTION_DAYS=730
```

### Ajouter un nouvel endpoint

Modifiez `scripts/bexio_extractor.py`:

```python
def extract_payments(self) -> List[Dict]:
    """Extrait les paiements"""
    print("Extraction des paiements...")
    return self._make_request('payment')
```

Puis dans `extract_all()`:

```python
endpoint_methods = {
    'contacts': self.extract_contacts,
    'invoices': lambda: self.extract_invoices(days),
    'payments': self.extract_payments,  # Nouveau
    # ... autres endpoints
}
```

---

## 🚫 Limites de l'API

### Rate Limiting

Bexio applique des limites de requêtes:

- **1000 requêtes par heure** par token
- **100 requêtes par minute** par token

### Pagination

Pour les grandes quantités de données, utilisez la pagination:

```python
def get_all_contacts(self):
    all_contacts = []
    offset = 0
    limit = 500  # Maximum 2000

    while True:
        params = {'limit': limit, 'offset': offset}
        batch = self._make_request('contact', params)

        if not batch:
            break

        all_contacts.extend(batch)
        offset += limit

    return all_contacts
```

---

## 🔐 Bonnes Pratiques

### 1. Gestion du Token

```python
# ✅ BON - Utiliser .env
BEXIO_API_TOKEN=abc123...

# ❌ MAUVAIS - Token en dur dans le code
token = "abc123..."
```

### 2. Gestion des Erreurs

```python
try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 401:
        print("Token invalide ou expiré")
    elif e.response.status_code == 429:
        print("Trop de requêtes, attendez avant de réessayer")
    else:
        print(f"Erreur HTTP: {e}")
except requests.exceptions.RequestException as e:
    print(f"Erreur de connexion: {e}")
```

### 3. Cache Local

Évitez de réextraire les mêmes données:

```python
import os
from datetime import datetime, timedelta

def should_refresh(file_path, max_age_hours=24):
    """Vérifie si le fichier doit être rafraîchi"""
    if not os.path.exists(file_path):
        return True

    file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
    age = datetime.now() - file_time

    return age > timedelta(hours=max_age_hours)
```

---

## 📖 Ressources Supplémentaires

- [Documentation API Bexio](https://docs.bexio.com/)
- [Forum Bexio](https://community.bexio.com/)
- [Exemples de code](https://github.com/bexio/bexio-api-php-client)
- [Postman Collection](https://www.postman.com/bexio)

---

## ❓ Questions Fréquentes

### Comment tester l'API ?

Utilisez curl:

```bash
curl -X GET "https://api.bexio.com/2.0/contact" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer VOTRE_TOKEN"
```

### Quelle version de l'API utiliser ?

Ce projet utilise l'**API 2.0** (la plus récente).

### Comment gérer plusieurs organisations Bexio ?

Créez plusieurs fichiers `.env`:
- `.env.client1`
- `.env.client2`

Puis chargez le bon fichier:

```python
from dotenv import load_dotenv
load_dotenv('.env.client1')
```

---

Bonne utilisation de l'API Bexio! 🚀
