# 🌐 Déploiement Web - Dashboard Bexio → Power BI

## 🎯 Tester l'Application Web Gratuitement

Votre application est prête à être déployée sur **Render.com** - **100% GRATUIT** !

---

## 🚀 Méthode 1 : Render.com (Recommandé - 100% Gratuit)

### Étape 1 : Créer un Compte Render

1. Allez sur **https://render.com**
2. Cliquez sur **"Get Started"**
3. Inscrivez-vous avec **GitHub** (recommandé)
4. Autorisez Render à accéder à vos repos GitHub

### Étape 2 : Déployer l'Application

**Option A : Déploiement Automatique (Plus Simple)**

1. Une fois connecté, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository GitHub : `csigno1204/BSCO-Dashboard-PowerBI`
3. Sélectionnez la branche : `claude/powerbi-bexio-dashboard-011CUw7GAqcxKxDbQXGq6416`
4. Render détecte automatiquement :
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `gunicorn --bind 0.0.0.0:$PORT webapp.app:app`
5. Cliquez sur **"Create Web Service"**

**Option B : Utiliser render.yaml (Blueprint)**

1. Render détecte automatiquement le fichier `render.yaml`
2. Cliquez sur **"Apply"**
3. C'est tout ! Render déploie automatiquement

### Étape 3 : Attendre le Déploiement

- Render installe les dépendances (~2-3 minutes)
- Compile l'application
- Affiche l'URL publique : **https://bexio-dashboard-xyz.onrender.com**

### Étape 4 : Tester l'Application

1. Cliquez sur l'URL fournie par Render
2. L'interface web s'ouvre dans votre navigateur
3. Entrez votre clé API Bexio
4. Synchronisez vos données !

---

## ⚡ Méthode 2 : Railway.app (Alternative Gratuite)

### Étape 1 : Créer un Compte

1. Allez sur **https://railway.app**
2. Inscrivez-vous avec GitHub
3. Créez un nouveau projet

### Étape 2 : Déployer

1. Cliquez sur **"Deploy from GitHub repo"**
2. Sélectionnez `csigno1204/BSCO-Dashboard-PowerBI`
3. Branche : `claude/powerbi-bexio-dashboard-011CUw7GAqcxKxDbQXGq6416`
4. Railway configure automatiquement
5. Cliquez sur **"Deploy"**

### Étape 3 : Obtenir l'URL

1. Allez dans **"Settings"** → **"Networking"**
2. Cliquez sur **"Generate Domain"**
3. Railway génère une URL : **https://bexio-dashboard.up.railway.app**

---

## 🌍 Méthode 3 : Replit (Test Rapide)

### Étape 1 : Créer un Repl

1. Allez sur **https://replit.com**
2. Cliquez sur **"Create Repl"**
3. Sélectionnez **"Import from GitHub"**
4. Collez l'URL : `https://github.com/csigno1204/BSCO-Dashboard-PowerBI`

### Étape 2 : Configuration

1. Dans le terminal Replit, tapez :
   ```bash
   pip install -r requirements.txt
   python web_launcher.py
   ```

2. Replit ouvre automatiquement un navigateur web

---

## 📋 Fichiers de Configuration Créés

### `Procfile`
```
web: gunicorn --bind 0.0.0.0:$PORT webapp.app:app
```
→ Dit à Render/Railway/Heroku comment lancer l'application

### `render.yaml`
```yaml
services:
  - type: web
    name: bexio-dashboard
    env: python
    region: frankfurt
    plan: free
```
→ Configuration automatique pour Render

### `requirements.txt`
→ Déjà configuré avec `gunicorn>=21.0.0` pour production

---

## 🎨 Ce Que Vous Obtenez

**URL publique HTTPS** : `https://votre-app.onrender.com`

**Interface web moderne** accessible depuis n'importe où :
- ✅ Configuration API Bexio
- ✅ Synchronisation en temps réel
- ✅ Statistiques visuelles
- ✅ Téléchargement Excel

**Gratuit à vie** :
- ✅ Render : 750h/mois gratuit (largement suffisant)
- ✅ Railway : 5$/mois de crédit gratuit
- ✅ Replit : Accès gratuit pour test

---

## ⚠️ Limitations du Plan Gratuit

### Render.com
- Application se met en veille après 15 min d'inactivité
- Redémarre automatiquement à la prochaine visite (~30 secondes)
- 750h/mois gratuit (= toujours actif)

### Railway.app
- 5$/mois de crédit gratuit
- Consomme ~0.01$/heure
- = ~500h/mois gratuit

### Replit
- Application publique
- Pas de domaine custom gratuit
- Parfait pour tests

---

## 🔒 Sécurité

**Vos données Bexio sont sécurisées :**
- ✅ La clé API est stockée en mémoire uniquement
- ✅ Connexion HTTPS automatique
- ✅ Pas de logs de la clé API
- ✅ Données extraites non stockées sur le serveur

**Remarque :** Les fichiers Excel générés sont temporaires et supprimés au redémarrage.

---

## 🚀 Déploiement en 3 Minutes

**Résumé ultra-rapide :**

1. Allez sur **https://render.com**
2. **Inscrivez-vous** avec GitHub
3. **New +** → **Web Service**
4. Sélectionnez le repo **BSCO-Dashboard-PowerBI**
5. Branche : `claude/powerbi-bexio-dashboard-011CUw7GAqcxKxDbQXGq6416`
6. **Create Web Service**
7. Attendez 2-3 minutes
8. **Ouvrez l'URL** fournie par Render
9. **Testez votre application !**

---

## 📞 Support

**Problème avec le déploiement ?**

### Render.com
- Documentation : https://render.com/docs
- Support : https://render.com/support

### Railway.app
- Documentation : https://docs.railway.app
- Discord : https://discord.gg/railway

### Replit
- Documentation : https://docs.replit.com
- Forum : https://replit.com/talk

---

## 💡 Après le Test

**Si l'application fonctionne bien :**

1. **Migrez vers un plan payant** (optionnel) :
   - Render : 7$/mois (pas de veille)
   - Railway : 5$/mois de crédit

2. **Achetez un domaine custom** :
   - `dashboard.votre-entreprise.ch`
   - Configurez dans Render/Railway

3. **Ajoutez des fonctionnalités** :
   - Authentification utilisateur
   - Base de données
   - Planification automatique

---

## 🎯 Prochaines Étapes

1. ✅ **Déployez sur Render** (5 minutes)
2. ✅ **Testez l'interface web**
3. ✅ **Synchronisez vos données Bexio**
4. ✅ **Téléchargez le fichier Excel**
5. ✅ **Ouvrez dans Power BI Desktop**

---

**🎉 Votre application est maintenant accessible depuis n'importe où dans le monde !**

**URL de test :** Sera fournie par Render après déploiement
