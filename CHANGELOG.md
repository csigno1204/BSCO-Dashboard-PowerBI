# 📝 Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Versioning Sémantique](https://semver.org/lang/fr/).

---

## [1.0.0] - 2025-01-15

### 🎉 Version Initiale - Release Complète

#### ✨ Ajouté

**Fonctionnalités Principales**
- Extraction API Bexio (contacts, factures, devis, projets, feuilles de temps)
- Transformation automatique des données pour Power BI
- Export Excel optimisé avec relations entre tables
- Interface graphique (GUI) Desktop avec Tkinter
- Interface Web pour monitoring
- Installation automatique (install.bat/sh)
- Menu interactif (menu.bat/sh)

**Installeur Windows**
- 🆕 Installeur .exe professionnel avec Inno Setup
- 🆕 Compilation automatique avec PyInstaller
- 🆕 Script build_installer.bat pour automatisation complète
- 🆕 Support multi-langues (FR, EN, DE, IT) dans l'installeur
- 🆕 Création automatique des raccourcis (Bureau, Menu Démarrer)
- 🆕 Désinstallation propre via Panneau de configuration

**Configuration & Tests**
- Assistant de configuration guidé (setup_wizard.py)
- Script de test de connexion API (test_connection.py)
- Générateur de données de démonstration (generate_demo_data.py)
- Validation automatique de la structure des données (validate_data_structure.py)
- Health check système (health_check.py)

**Automatisation**
- Planificateur d'extractions (Windows Task Scheduler / Cron)
- Extraction automatique quotidienne/hebdomadaire configurable
- Notifications email (succès/échec)
- Système de logs centralisé avec historique JSON
- Visualiseur d'historique (view_history.py)

**Alertes Intelligentes**
- 🆕 Système d'alertes configurables (alerts.yaml)
- 8 règles métier préconfigurées :
  - CA mensuel faible
  - Factures en retard critiques
  - Baisse du CA
  - Nouveau client
  - Client inactif
  - Objectif atteint
  - Taux de retard élevé
  - Pic de factures
- Support multi-canaux (Email, Slack, Teams)
- Système de cooldown pour éviter le spam

**Rapports**
- 🆕 Génération de rapports PDF exécutifs (generate_pdf_report.py)
- Export multi-format (CSV, JSON, SQL, Parquet)
- Support PostgreSQL/SQLite pour export SQL
- Rapports HTML avec KPIs visuels

**Validation des Données**
- 🆕 Script de validation Bexio ↔ Power BI
- Score de compatibilité (0-100)
- Détection des relations orphelines
- Vérification des types de colonnes
- Guide complet de validation (VALIDATION_DONNEES.md)

**Multi-Client**
- Support de plusieurs clients (configs/)
- Configuration par client (.env séparés)
- Bascule facile entre clients

**Power BI**
- 30+ mesures DAX prêtes à l'emploi
- 7 exemples Power Query
- Documentation des relations entre tables
- Templates de visualisation

**Documentation**
- 🆕 Guide de construction de l'installeur (BUILD_INSTALLER.md)
- 🆕 Roadmap avec 15 améliorations proposées (ROADMAP.md)
- Guide d'installation (INSTALLATION.md)
- Guide d'utilisation (USAGE.md)
- Guide de validation (VALIDATION_DONNEES.md)
- Architecture technique (ARCHITECTURE.md)
- FAQ complète (FAQ.md)
- Documentation des fonctionnalités (FEATURES.md)
- Guide du scheduler (SCHEDULER.md)
- Guide d'export (EXPORT.md)
- Guide de monitoring (MONITORING.md)
- Guide de dépannage (TROUBLESHOOTING.md)
- Guide des alertes (ALERTS.md)

#### 🔧 Technique

**Structure du Projet**
```
BSCO-Dashboard-PowerBI/
├── scripts/            - 15+ scripts Python
├── docs/              - 13 guides de documentation
├── installer/         - Fichiers pour créer l'installeur .exe
├── powerbi/           - Fichiers DAX et Power Query
├── configs/           - Configurations multi-clients
├── data/              - Données extraites
├── logs/              - Logs et historique
└── assets/            - Assets (icônes, images)
```

**Technologies Utilisées**
- Python 3.8+
- Tkinter (GUI Desktop)
- Pandas (transformation données)
- OpenPyXL/XlsxWriter (export Excel)
- Requests (API Bexio)
- PyYAML (configuration)
- ReportLab (PDF)
- PyInstaller (compilation .exe)
- Inno Setup (installeur Windows)

**Scripts Principaux**
- `bexio_extractor.py` - Extraction API Bexio
- `data_transformer.py` - Transformation pour Power BI
- `run_pipeline.py` - Pipeline complet
- `gui_app.py` - Interface graphique
- `alert_manager.py` - Gestion des alertes
- `generate_pdf_report.py` - Génération rapports PDF
- `validate_data_structure.py` - Validation données
- `setup_wizard.py` - Configuration guidée
- `logger.py` - Système de logs
- `email_notifier.py` - Notifications email
- `export_data.py` - Export multi-format
- `health_check.py` - Diagnostic système
- `web_dashboard.py` - Dashboard web
- `view_history.py` - Historique
- `setup_scheduler.py` - Automatisation

#### 📊 Statistiques

- **Nombre de fichiers Python:** 15
- **Lignes de code:** ~5000
- **Guides de documentation:** 13
- **Mesures DAX:** 30+
- **Exemples Power Query:** 7
- **Alertes préconfigurées:** 8
- **Formats d'export:** 4 (Excel, CSV, JSON, SQL)

#### 🎯 Points Forts

- ✅ Solution complète clé en main
- ✅ Installation Windows professionnelle (.exe)
- ✅ Interface graphique intuitive
- ✅ Documentation exhaustive en français
- ✅ Support multi-clients
- ✅ Alertes intelligentes configurables
- ✅ Validation automatique des données
- ✅ Compatibilité Power BI garantie
- ✅ Open-source et extensible

#### 🚀 Utilisations

**Pour PME Suisses:**
- Extraire vos données Bexio quotidiennement
- Créer des dashboards Power BI dynamiques
- Recevoir des alertes métier automatiques
- Générer des rapports PDF exécutifs

**Pour Consultants:**
- Gérer plusieurs clients (multi-tenant)
- Installer chez le client en 1 clic (.exe)
- Personnaliser les alertes par client
- Exporter vers différents formats

**Pour Développeurs:**
- Base de code propre et documentée
- Facilement extensible (plugins)
- Scripts Python modifiables
- API REST future prête

---

## [Unreleased] - Roadmap

### 🔮 Améliorations Futures Proposées

#### Phase 1: Quick Wins (2 semaines)
- [ ] Backup automatique des données
- [ ] Comparateur de données (diff entre extractions)
- [ ] API REST basique
- [ ] OAuth2 Bexio (authentification moderne)

#### Phase 2: Intelligence (3 semaines)
- [ ] Prévisions avec Machine Learning (forecasting)
- [ ] Détection d'anomalies automatique
- [ ] Webhooks Bexio (synchronisation temps réel)
- [ ] Versioning des données (Git-like)

#### Phase 3: Écosystème (4 semaines)
- [ ] Plugin Power BI natif (connecteur custom)
- [ ] Export multi-BI (Tableau, Qlik, Looker)
- [ ] Chiffrement des données (conformité RGPD)
- [ ] Audit trail complet
- [ ] Dashboard mobile (PWA ou React Native)

#### Phase 4: Enterprise (optionnel)
- [ ] Intégration ERP (SAP, Sage, Odoo)
- [ ] Cache intelligent (réduction appels API)
- [ ] Application mobile native

**Détails:** Voir `docs/ROADMAP.md`

---

## Format de Versioning

**Versioning Sémantique:** MAJOR.MINOR.PATCH

- **MAJOR:** Changements incompatibles avec versions précédentes
- **MINOR:** Nouvelles fonctionnalités compatibles
- **PATCH:** Corrections de bugs compatibles

**Exemples:**
- `1.0.0` → `1.0.1` = Correction de bugs
- `1.0.1` → `1.1.0` = Nouvelle fonctionnalité
- `1.1.0` → `2.0.0` = Changement incompatible (breaking change)

---

## Liens

- **Repository:** https://github.com/csigno1204/BSCO-Dashboard-PowerBI
- **Issues:** https://github.com/csigno1204/BSCO-Dashboard-PowerBI/issues
- **Documentation:** `docs/`
- **Releases:** https://github.com/csigno1204/BSCO-Dashboard-PowerBI/releases

---

**Note:** Pour des questions ou suggestions, ouvrez une issue sur GitHub.

**Licence:** Voir fichier `LICENSE`

**Auteur:** BSCO Solutions

**Date de Release:** Janvier 2025
