# 🚀 Nouvelles Fonctionnalités - Dashboard Bexio PowerBI

Guide complet de toutes les fonctionnalités avancées du projet.

---

## ⚡ Nouvelles Fonctionnalités Majeures

### 1. 🕒 Planificateur d'Actualisation Automatique

**Script:** `scripts/setup_scheduler.py`

Configure l'extraction automatique selon votre rythme.

**Utilisation:**
```bash
python scripts/setup_scheduler.py
```

**Options:**
- Quotidien (recommandé)
- Deux fois par jour
- Hebdomadaire
- Mensuel

**Plateformes supportées:**
- ✅ Windows (Planificateur de tâches)
- ✅ Linux (Cron)
- ✅ macOS (Cron)

---

### 2. 📝 Historique et Logs Détaillés

**Scripts:**
- `scripts/logger.py` - Système de logging
- `scripts/view_history.py` - Visualiseur d'historique

**Voir l'historique:**
```bash
python scripts/view_history.py

# Afficher plus d'entrées
python scripts/view_history.py 20
```

**Fonctionnalités:**
- ✅ Historique JSON des 100 dernières extractions
- ✅ Logs quotidiens dans `logs/`
- ✅ Statistiques de succès/échec
- ✅ Temps d'exécution
- ✅ Nombre d'enregistrements par extraction

**Fichiers générés:**
```
logs/
├── extraction_20250108.log
├── extraction_20250107.log
└── extraction_history.json
```

---

### 3. 📧 Notifications par Email

**Script:** `scripts/email_notifier.py`

Recevez des notifications automatiques sur l'état des extractions.

**Configuration dans `.env`:**
```env
EMAIL_NOTIFICATIONS=true
EMAIL_TO=votre.email@example.com
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe_app
```

**Types de notifications:**
- ✅ Extraction réussie (avec résumé)
- ❌ Extraction échouée (avec erreur)
- ⚠️ Alertes métier personnalisées

**Gmail:** Utilisez un [mot de passe d'application](https://support.google.com/accounts/answer/185833)

---

### 4. 📤 Export Multi-Formats

**Script:** `scripts/export_data.py`

Exportez vos données vers différents formats.

**Utilisation:**
```bash
# CSV (défaut)
python scripts/export_data.py --format csv

# JSON
python scripts/export_data.py --format json

# SQL (SQLite par défaut)
python scripts/export_data.py --format sql

# SQL vers base externe
python scripts/export_data.py --format sql --database postgresql://user:pass@localhost/db

# Parquet (Big Data)
python scripts/export_data.py --format parquet

# Tous les formats
python scripts/export_data.py --format all
```

**Formats supportés:**
- ✅ CSV (Excel-compatible)
- ✅ JSON (Web APIs)
- ✅ SQL (SQLite, PostgreSQL, MySQL, etc.)
- ✅ Parquet (Big Data, optimisé)

---

### 5. 👥 Gestion Multi-Clients

**Dossier:** `configs/`

Gérez plusieurs clients Bexio depuis une seule installation.

**Structure:**
```
configs/
├── client_abc.env
├── client_xyz.env
└── client_123.env
```

**Utilisation:**
```bash
# Méthode 1: Variable d'environnement
export CLIENT=client_abc
python scripts/run_pipeline.py

# Méthode 2: Argument
python scripts/run_pipeline.py --client client_abc
```

**Organisation des données:**
```
data/
├── client_abc/
│   └── bexio_data_20250108.xlsx
├── client_xyz/
│   └── bexio_data_20250108.xlsx
```

📖 **Documentation complète:** `configs/README.md`

---

### 6. 🧙 Assistant de Configuration Interactive

**Script:** `scripts/setup_wizard.py`

Configuration guidée étape par étape.

**Utilisation:**
```bash
python scripts/setup_wizard.py
```

**Ce qu'il fait:**
1. ✅ Configuration du token API Bexio
2. ✅ Sélection des données à extraire
3. ✅ Choix de la période
4. ✅ Configuration des notifications email
5. ✅ Profil d'utilisation
6. ✅ Génération automatique du fichier `.env`

**Interface conviviale avec:**
- 🎨 Couleurs et émojis
- ❓ Questions guidées
- ✅ Validation des choix
- 📄 Récapitulatif avant sauvegarde

---

### 7. 🩺 Vérificateur de Santé du Système

**Script:** `scripts/health_check.py`

Diagnostic complet de votre installation.

**Utilisation:**
```bash
python scripts/health_check.py
```

**Vérifie:**
- ✅ Version de Python (3.8+)
- ✅ Dépendances installées
- ✅ Fichier .env configuré
- ✅ Token API valide
- ✅ Structure des dossiers
- ✅ Espace disque disponible
- ✅ Dernière extraction
- ⚠️ Factures en retard

**Résultat:**
```
🔍 DIAGNOSTIC COMPLET DU SYSTÈME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1/6] Python et dépendances
✓ Python 3.11.0
✓ Package 'requests' installé
...

Score de santé: 95/100 - EXCELLENT
```

---

### 8. 🌐 Dashboard Web de Monitoring

**Script:** `scripts/web_dashboard.py`

Interface web pour visualiser l'état des extractions.

**Utilisation:**
```bash
python scripts/web_dashboard.py

# Port personnalisé
python scripts/web_dashboard.py 8080
```

**Ouvrez:** `http://localhost:5000`

**Affiche:**
- 📊 Dernière extraction (temps écoulé)
- 📈 Nombre d'enregistrements
- ✅ Taux de succès (7 derniers jours)
- 📁 Nombre de fichiers générés
- 📜 Historique récent (5 dernières extractions)
- 🔄 Auto-actualisation (60 secondes)

**Design moderne:**
- 🎨 Interface élégante avec gradients
- 📱 Responsive (mobile-friendly)
- ✨ Indicateurs colorés de statut
- ⚡ Léger (aucune dépendance externe)

---

## 🛠️ Outils Complémentaires

### Scripts Utilitaires

| Script | Description | Commande |
|--------|-------------|----------|
| **test_connection.py** | Test connexion API | `python scripts/test_connection.py` |
| **generate_demo_data.py** | Données de test | `python scripts/generate_demo_data.py` |
| **setup_scheduler.py** | Planificateur | `python scripts/setup_scheduler.py` |
| **view_history.py** | Historique | `python scripts/view_history.py` |
| **export_data.py** | Export formats | `python scripts/export_data.py -f csv` |
| **setup_wizard.py** | Assistant config | `python scripts/setup_wizard.py` |
| **health_check.py** | Diagnostic | `python scripts/health_check.py` |
| **web_dashboard.py** | Dashboard web | `python scripts/web_dashboard.py` |

### Raccourcis Rapides

**Windows:**
- `install.bat` - Installation automatique
- `menu.bat` - Menu interactif
- `run_test.bat` - Test rapide
- `run_extraction.bat` - Extraction rapide

**Linux/Mac:**
- `./install.sh` - Installation automatique
- `./menu.sh` - Menu interactif
- `./run_test.sh` - Test rapide
- `./run_extraction.sh` - Extraction rapide

---

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| **FEATURES.md** (ce fichier) | Guide des fonctionnalités |
| **QUICKSTART.md** | Démarrage rapide (10 min) |
| **docs/INSTALLATION_LOCALE.md** | Installation PC locale |
| **docs/GUIDE_INSTALLATION.md** | Installation détaillée |
| **docs/GUIDE_DASHBOARDS.md** | 5 templates de dashboards |
| **docs/API_REFERENCE.md** | Documentation API Bexio |
| **powerbi/TEMPLATE_GUIDE.md** | Créer template Power BI |
| **powerbi/PowerQuery_Examples.m** | Requêtes Power Query |
| **powerbi/DAX_Measures.dax** | 30+ mesures DAX |
| **configs/README.md** | Gestion multi-clients |

---

## 🎯 Cas d'Usage Avancés

### Scénario 1: Extraction Automatique Quotidienne avec Notifications

```bash
# 1. Configurer le planificateur
python scripts/setup_scheduler.py
# → Choisir "Quotidien" à 6h du matin

# 2. Activer les notifications dans .env
EMAIL_NOTIFICATIONS=true
EMAIL_TO=boss@example.com

# 3. Tester
python scripts/run_pipeline.py
# → Vous recevrez un email de confirmation
```

### Scénario 2: Gestion de Plusieurs Clients

```bash
# 1. Créer les configurations
cp .env configs/client_a.env
cp .env configs/client_b.env

# 2. Modifier les tokens dans chaque fichier

# 3. Extraire pour chaque client
python scripts/run_pipeline.py --client client_a
python scripts/run_pipeline.py --client client_b

# 4. Les données sont séparées automatiquement
data/client_a/bexio_data_*.xlsx
data/client_b/bexio_data_*.xlsx
```

### Scénario 3: Export vers Base de Données

```bash
# 1. Installer SQLAlchemy
pip install sqlalchemy psycopg2-binary

# 2. Exporter vers PostgreSQL
python scripts/export_data.py \
  --format sql \
  --database postgresql://user:pass@localhost:5432/bexio
```

### Scénario 4: Monitoring en Temps Réel

```bash
# 1. Lancer le dashboard web
python scripts/web_dashboard.py &

# 2. Ouvrir le navigateur
http://localhost:5000

# 3. Configurer l'extraction automatique
# → Le dashboard se met à jour automatiquement
```

---

## 💡 Astuces et Bonnes Pratiques

### 1. Performance

- Limitez `EXTRACTION_DAYS` si vous avez beaucoup de données
- Utilisez le format Parquet pour les gros volumes
- Activez seulement les endpoints nécessaires

### 2. Sécurité

- Ne commitez JAMAIS les fichiers `.env`
- Utilisez des mots de passe d'application (Gmail)
- Limitez les permissions du token API Bexio
- Sauvegardez régulièrement les configs

### 3. Monitoring

- Vérifiez l'historique hebdomadairement
- Activez les notifications pour les erreurs
- Utilisez `health_check.py` avant chaque démo
- Surveillez l'espace disque

### 4. Multi-Clients

- Nommez clairement les fichiers de config
- Documentez chaque client dans le fichier
- Planifiez les extractions à des heures différentes
- Séparez les dashboards Power BI par client

---

## 🔮 Fonctionnalités à Venir

Consultez le [README.md](README.md) pour la roadmap complète :

### Phase Futur
- 🐳 Version Docker
- 🔌 API REST
- 🤖 Alertes intelligentes
- 📊 Plus de templates Power BI
- ☁️ Support Cloud (AWS, Azure)

---

## ❓ Questions Fréquentes

**Q: Les notifications email ne fonctionnent pas?**
R: Vérifiez que vous utilisez un mot de passe d'application pour Gmail, pas votre mot de passe principal.

**Q: Comment voir toutes les extractions échouées?**
R: `python scripts/view_history.py 100 | grep "✗"`

**Q: Puis-je exporter vers Google Sheets?**
R: Pas directement, mais vous pouvez exporter en CSV puis importer dans Sheets.

**Q: Le dashboard web ne démarre pas?**
R: Vérifiez que le port 5000 n'est pas déjà utilisé. Utilisez un autre port: `python scripts/web_dashboard.py 8080`

**Q: Comment nettoyer les vieux logs?**
R: Les logs sont automatiquement limités. Vous pouvez supprimer manuellement les fichiers dans `logs/` de plus de 30 jours.

---

## 🆘 Support

- 📖 Documentation: Consultez les guides dans `docs/`
- 🐛 Bugs: Ouvrez une issue sur GitHub
- 💬 Questions: Consultez les FAQ ci-dessus

---

**Profitez de toutes ces fonctionnalités !** 🎉

Mis à jour: Janvier 2025
