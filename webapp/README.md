# 🌐 Application Web - Dashboard Bexio → Power BI

## 📋 Vue d'ensemble

**Nouvelle interface web moderne** pour synchroniser vos données Bexio vers Power BI.

**2 modes disponibles :**

| Mode | Description | Taille exe | Avantages |
|------|-------------|------------|-----------|
| **Mode Web** (Nouveau) | Interface web sur localhost | ~15-20 MB | ✅ Interface moderne<br>✅ Exe ultra-léger<br>✅ Moins de faux positifs antivirus<br>✅ Multiplateforme |
| **Mode Desktop** (Existant) | Interface Tkinter | ~100 MB | ✅ Interface native Windows<br>✅ Pas besoin de navigateur |

---

## 🚀 Lancement Rapide - Mode Web

### Méthode 1 : Avec Python (Développement)

```bash
# Installer les dépendances (si pas déjà fait)
pip install -r requirements.txt

# Lancer l'application web
python web_launcher.py

# OU directement avec Flask
cd webapp
python app.py
```

L'application s'ouvrira automatiquement dans votre navigateur sur **http://localhost:8000**

### Méthode 2 : Avec l'Exe (Production)

1. Compilez le Web Launcher :
   ```bash
   pyinstaller --clean installer/BexioDashboard_WebLauncher.spec
   ```

2. Lancez l'exe :
   ```bash
   dist/BexioDashboard_WebLauncher/BexioDashboard_WebLauncher.exe
   ```

3. Le navigateur s'ouvre automatiquement

---

## 📐 Architecture

```
webapp/
├── app.py                 # Backend Flask
├── templates/
│   └── index.html        # Interface HTML
├── static/
│   ├── css/
│   │   └── style.css     # Styles modernes
│   └── js/
│       └── app.js        # Logique frontend
└── README.md             # Ce fichier

web_launcher.py           # Launcher minimaliste (compilé en exe)
```

---

## 🎨 Fonctionnalités de l'Interface Web

### Page d'accueil

- ✅ **Configuration API** : Entrez votre clé API Bexio
- ✅ **Synchronisation** : Un clic pour synchroniser toutes les données
- ✅ **Barre de progression** en temps réel
- ✅ **Statistiques visuelles** :
  - Nombre de contacts
  - Nombre de factures
  - Nombre de projets
  - Chiffre d'affaires total
- ✅ **Téléchargement direct** du fichier Power BI

### Interface Moderne

- 🎨 Design moderne avec gradients
- 📱 Responsive (fonctionne sur mobile/tablette)
- ⚡ Mise à jour en temps réel via AJAX
- 🌈 Animations fluides

---

## 🔧 API Endpoints (Backend)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/` | GET | Page principale |
| `/api/status` | GET | Obtenir le statut actuel |
| `/api/config` | GET/POST | Configuration API Bexio |
| `/api/sync` | POST | Lancer la synchronisation |
| `/api/download` | GET | Télécharger le fichier Power BI |
| `/api/stats` | GET | Obtenir les statistiques |

---

## 💻 Utilisation

### 1. Configuration

1. Lancez l'application (Python ou exe)
2. Entrez votre **clé API Bexio**
3. Cliquez sur "Enregistrer la configuration"

### 2. Synchronisation

1. Cliquez sur "Synchroniser les données"
2. Observez la progression en temps réel
3. Les statistiques s'affichent au fur et à mesure

### 3. Téléchargement

1. Une fois la synchronisation terminée
2. Cliquez sur "Télécharger le fichier Power BI"
3. Ouvrez le fichier `.pbix` dans Power BI Desktop

---

## 🔒 Sécurité

- ✅ **Exécution locale** : Tout tourne sur votre machine (localhost)
- ✅ **Pas de données envoyées** à l'extérieur
- ✅ **API key stockée** en mémoire uniquement (pas de fichier)
- ✅ **Connexion sécurisée** à l'API Bexio (HTTPS)

---

## 🐛 Dépannage

### Port 8000 déjà utilisé

Si le port 8000 est déjà occupé, modifiez dans `web_launcher.py` :

```python
run_webapp(port=8001, open_browser_on_start=True)  # Utilisez 8001 ou autre
```

### Le navigateur ne s'ouvre pas automatiquement

Ouvrez manuellement : **http://localhost:8000**

### Erreur "Module flask not found"

Installez les dépendances :
```bash
pip install -r requirements.txt
```

---

## 📦 Compilation en Exe

### Web Launcher (Léger - Recommandé)

```bash
# Compiler le launcher web (~15-20 MB)
pyinstaller --clean installer/BexioDashboard_WebLauncher.spec
```

**Résultat** : `dist/BexioDashboard_WebLauncher/BexioDashboard_WebLauncher.exe`

**Avantages** :
- ✅ Exe ultra-léger (~15-20 MB vs 100 MB)
- ✅ Moins de faux positifs antivirus
- ✅ Interface web moderne
- ✅ Plus facile à maintenir

### Desktop GUI (Lourd)

```bash
# Compiler le GUI Tkinter (~100 MB)
pyinstaller --clean installer/BexioDashboard.spec
```

**Résultat** : `dist/BexioDashboard/BexioDashboard.exe`

---

## 🎯 Comparaison : Web vs Desktop

| Critère | Mode Web | Mode Desktop |
|---------|----------|--------------|
| **Taille exe** | ~15-20 MB | ~100 MB |
| **Interface** | HTML/CSS moderne | Tkinter natif |
| **Faux positifs AV** | ⚠️ Moins probables | ⚠️⚠️ Plus probables |
| **Maintenance** | ✅ Facile | ⚠️ Plus complexe |
| **Multiplateforme** | ✅ Oui | ⚠️ Windows only |
| **Navigateur requis** | Oui | Non |
| **UX moderne** | ✅✅✅ Excellent | ⚠️ Basique |

**Recommandation** : Utilisez le **Mode Web** pour distribution, gardez le Mode Desktop comme alternative.

---

## 🚀 Workflow GitHub Actions

Le workflow peut compiler **les deux modes** :

```yaml
# Mode Web (léger)
- name: Build Web Launcher
  run: pyinstaller --clean installer/BexioDashboard_WebLauncher.spec

# Mode Desktop (lourd)
- name: Build Desktop GUI
  run: pyinstaller --clean installer/BexioDashboard.spec
```

**Artéfacts générés** :
- `BexioDashboard-WebLauncher` (~15-20 MB)
- `BexioDashboard-Desktop` (~100 MB)

L'utilisateur choisit celui qu'il préfère !

---

## 📚 Documentation Technique

### État de l'Application (Backend)

```python
app_state = {
    'api_key': None,           # Clé API Bexio
    'last_sync': None,         # Timestamp dernière sync
    'status': 'idle',          # idle|configured|syncing|success|error
    'progress': 0,             # 0-100%
    'message': '',             # Message de progression
    'stats': {
        'contacts': 0,
        'invoices': 0,
        'projects': 0,
        'total_revenue': 0
    }
}
```

### Flow de Synchronisation

1. **Frontend** : Clique sur "Synchroniser"
2. **POST** `/api/sync` → Lance thread de synchronisation
3. **Backend** : Thread exécute `run_sync()`
4. **Frontend** : Poll `/api/status` toutes les 2 secondes
5. **Mise à jour UI** : Progression, stats, messages
6. **Terminé** : Status = success, affiche bouton téléchargement

---

## 🎓 Pour les Développeurs

### Ajouter une nouvelle fonctionnalité

1. **Backend** : Ajoutez un endpoint dans `app.py`
2. **Frontend** : Ajoutez la fonction JS dans `app.js`
3. **UI** : Modifiez `index.html` et `style.css`

### Exemple : Ajouter un filtre de dates

**Backend (`app.py`) :**
```python
@app.route('/api/sync', methods=['POST'])
def sync_data():
    data = request.json
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    # ... filtrer les données ...
```

**Frontend (`app.js`) :**
```javascript
async function startSync() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate, end_date: endDate })
    });
}
```

---

## 📞 Support

- **Issues** : https://github.com/csigno1204/BSCO-Dashboard-PowerBI/issues
- **Documentation** : `/docs`

---

**🎉 Profitez de l'interface web moderne !**
