# 🖥️ Guide d'Installation Locale

Ce guide détaille l'installation complète du projet sur votre PC en local.

---

## 🎯 Installation Ultra-Simple

### Windows

1. **Télécharger le projet**
   ```cmd
   git clone https://github.com/votre-repo/BSCO-Dashboard-PowerBI.git
   cd BSCO-Dashboard-PowerBI
   ```

2. **Double-cliquer sur `install.bat`**
   - Le script vérifie Python
   - Crée un environnement virtuel
   - Installe toutes les dépendances

3. **Configuration**
   ```cmd
   copy .env.example .env
   notepad .env
   ```
   Ajoutez votre token API Bexio

4. **Test**
   Double-cliquer sur `run_test.bat`

5. **Extraction**
   Double-cliquer sur `run_extraction.bat`

### Linux / Mac

1. **Télécharger le projet**
   ```bash
   git clone https://github.com/votre-repo/BSCO-Dashboard-PowerBI.git
   cd BSCO-Dashboard-PowerBI
   ```

2. **Lancer l'installation**
   ```bash
   bash install.sh
   ```

3. **Configuration**
   ```bash
   cp .env.example .env
   nano .env  # ou vim .env
   ```
   Ajoutez votre token API Bexio

4. **Test**
   ```bash
   ./run_test.sh
   ```

5. **Extraction**
   ```bash
   ./run_extraction.sh
   ```

---

## 📱 Menu Interactif

Pour une expérience encore plus simple, utilisez le menu interactif:

### Windows
```cmd
menu.bat
```

### Linux / Mac
```bash
./menu.sh
```

Le menu vous permet de:
- ✅ Installer les dépendances
- ✅ Tester la connexion API
- ✅ Générer des données de démonstration
- ✅ Extraire depuis Bexio
- ✅ Transformer les données
- ✅ Lancer le pipeline complet

---

## 🧪 Mode Démonstration (Sans API)

Si vous voulez tester sans avoir de token API Bexio:

### 1. Générer des données de test

**Windows:**
```cmd
venv\Scripts\activate
python scripts\generate_demo_data.py
```

**Linux/Mac:**
```bash
source venv/bin/activate
python scripts/generate_demo_data.py
```

Cela génère des données fictives:
- 50 contacts
- 200 factures
- 80 devis
- 20 projets
- 500 feuilles de temps
- 30 articles

### 2. Transformer les données

```cmd
python scripts\data_transformer.py
```

### 3. Importer dans Power BI

Le fichier Excel est prêt dans le dossier `data/` !

---

## 📁 Structure Après Installation

```
BSCO-Dashboard-PowerBI/
├── venv/                       # Environnement virtuel Python (créé)
├── data/                       # Données générées (créé)
│   ├── contacts_*.json
│   ├── invoices_*.json
│   └── bexio_data_*.xlsx      # Fichier pour Power BI
├── scripts/
│   ├── bexio_extractor.py
│   ├── data_transformer.py
│   ├── run_pipeline.py
│   ├── test_connection.py     # Nouveau: Test API
│   └── generate_demo_data.py  # Nouveau: Données démo
├── install.bat / install.sh    # Nouveau: Installation auto
├── menu.bat / menu.sh          # Nouveau: Menu interactif
├── run_test.bat / .sh          # Nouveau: Test rapide
├── run_extraction.bat / .sh    # Nouveau: Extraction rapide
└── .env                        # Configuration (à créer)
```

---

## ✅ Vérification de l'Installation

Utilisez le script de test pour vérifier que tout fonctionne:

```cmd
run_test.bat      # Windows
./run_test.sh     # Linux/Mac
```

Le script vérifie:
- ✅ Fichier .env présent
- ✅ Token API configuré
- ✅ Connexion à l'API Bexio
- ✅ Répertoire data créé
- ✅ Configuration endpoints

**Résultat attendu:**
```
======================================================================
  TEST DE CONFIGURATION - Dashboard Bexio → Power BI
======================================================================

[1/5] Vérification du fichier .env
✓ Fichier .env trouvé

[2/5] Vérification du token API
✓ Token API configuré (abc12345...xyz9)

[3/5] Test de connexion à l'API Bexio
ℹ Test de connexion à l'API Bexio...
✓ Connexion à l'API Bexio réussie!
ℹ Nombre de contacts disponibles: 1 (échantillon)

[4/5] Vérification du répertoire data
✓ Répertoire 'data' trouvé

[5/5] Vérification de la configuration
✓ Endpoints configurés: contacts, invoices, quotes, projects
✓ Période d'extraction: 365 jours

======================================================================
✓ TOUS LES TESTS SONT PASSÉS!

ℹ Vous pouvez maintenant lancer l'extraction:
    python scripts/run_pipeline.py
    ou
    run_extraction.bat  (Windows)
    ./run_extraction.sh (Linux/Mac)
======================================================================
```

---

## 🔧 Résolution de Problèmes

### Python non trouvé

**Windows:**
1. Téléchargez Python depuis https://www.python.org/downloads/
2. ⚠️ IMPORTANT: Cochez "Add Python to PATH" lors de l'installation
3. Redémarrez votre terminal
4. Vérifiez: `python --version`

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3 python3-pip python3-venv

# Fedora
sudo dnf install python3 python3-pip

# Arch
sudo pacman -S python python-pip
```

**Mac:**
```bash
brew install python3
```

### Erreur d'installation des dépendances

Si `pip install` échoue:

```bash
# Mettre à jour pip
python -m pip install --upgrade pip

# Installer une par une
pip install requests
pip install pandas
pip install openpyxl
pip install python-dotenv
pip install xlsxwriter
```

### Token API invalide

1. Vérifiez que vous avez copié le token complet
2. Générez un nouveau token sur https://office.bexio.com
3. Vérifiez qu'il n'y a pas d'espaces avant/après dans le .env

### Pas de données extraites

1. Vérifiez votre connexion Internet
2. Vérifiez que vous avez des données dans Bexio
3. Augmentez `EXTRACTION_DAYS` dans .env
4. Testez avec le mode démo: `python scripts/generate_demo_data.py`

---

## 🚀 Prochaines Étapes

Une fois l'installation réussie:

1. ✅ Lancez votre première extraction
2. ✅ Importez dans Power BI Desktop
3. ✅ Utilisez les requêtes Power Query (`powerbi/PowerQuery_Examples.m`)
4. ✅ Ajoutez les mesures DAX (`powerbi/DAX_Measures.dax`)
5. ✅ Créez votre premier dashboard

---

## 📖 Ressources

- **Démarrage rapide**: [QUICKSTART.md](../QUICKSTART.md)
- **Guide complet**: [GUIDE_INSTALLATION.md](GUIDE_INSTALLATION.md)
- **Templates dashboards**: [GUIDE_DASHBOARDS.md](GUIDE_DASHBOARDS.md)
- **API Bexio**: [API_REFERENCE.md](API_REFERENCE.md)

---

## 💬 Support

Si vous rencontrez des problèmes:

1. Consultez la section "Dépannage" ci-dessus
2. Vérifiez les logs d'erreur
3. Testez en mode démonstration
4. Consultez la documentation Bexio: https://docs.bexio.com/

---

**Installation réussie? Félicitations!** 🎉

Vous êtes maintenant prêt à créer vos dashboards Power BI avec les données Bexio.
