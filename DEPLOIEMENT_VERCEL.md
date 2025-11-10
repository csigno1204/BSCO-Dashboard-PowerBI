# Guide de Déploiement sur Vercel

## ✅ Application Next.js Prête !

Votre nouvelle application Next.js a été créée et committée avec succès. Elle est maintenant prête pour un déploiement en 1 clic sur Vercel.

## 🚀 Déploiement sur Vercel (GRATUIT)

### Étape 1 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec votre compte GitHub

### Étape 2 : Importer le projet

1. Une fois connecté, cliquez sur **"Add New..."** → **"Project"**
2. Vercel va vous montrer vos repositories GitHub
3. Trouvez **"BSCO-Dashboard-PowerBI"** et cliquez sur **"Import"**

### Étape 3 : Configurer le projet

**IMPORTANT** : Configurez ces paramètres avant de déployer :

- **Framework Preset** : Next.js (détecté automatiquement)
- **Root Directory** : `nextjs-app` ⚠️ IMPORTANT !
- **Build Command** : `npm run build` (automatique)
- **Output Directory** : `.next` (automatique)

### Étape 4 : Déployer

1. Cliquez sur **"Deploy"**
2. Vercel va :
   - Installer les dépendances (`npm install`)
   - Builder l'application (`npm run build`)
   - Déployer sur un CDN global
3. **Durée** : 2-3 minutes

### Étape 5 : Accéder à l'application

Une fois le déploiement terminé, Vercel vous donnera :
- Une URL publique (ex: `https://bsco-dashboard-powerbi.vercel.app`)
- Un certificat SSL automatique (HTTPS)
- Déploiement automatique à chaque push sur GitHub

## 📱 Utiliser l'Application

### 1. Configuration initiale

1. Ouvrez l'application déployée
2. Cliquez sur **"Configuration"** dans le menu
3. Obtenez votre clé API Bexio :
   - Allez sur [office.bexio.com](https://office.bexio.com)
   - Menu **Paramètres** → **API**
   - Créez une nouvelle clé API
4. Copiez la clé et collez-la dans l'application
5. Cliquez sur **"Enregistrer"**

### 2. Synchronisation

1. Allez sur **"Synchronisation"**
2. Cliquez sur **"Synchroniser maintenant"**
3. L'application va extraire :
   - Vos contacts Bexio
   - Vos factures
   - Vos projets
4. Les statistiques s'afficheront en temps réel

### 3. Télécharger les données

1. Après une synchronisation réussie
2. Cliquez sur **"Télécharger Excel"**
3. Le fichier `.xlsx` sera téléchargé
4. Importez-le dans Power BI

## 🎨 Fonctionnalités

- **Dashboard** : Vue d'ensemble de l'application
- **Synchronisation** : Extraction des données Bexio avec barre de progression
- **Historique** : Historique des synchronisations (à venir)
- **Statistiques** : Visualisation des métriques clés
- **Configuration** : Gestion de la clé API

## 🔧 Avantages de Next.js + Vercel

✅ **Déploiement en 1 clic** - Pas de configuration complexe
✅ **HTTPS automatique** - Certificat SSL gratuit
✅ **Performance optimale** - CDN global
✅ **Mises à jour automatiques** - Push GitHub = déploiement
✅ **100% gratuit** - Pour les projets personnels
✅ **Pas d'exe** - Fonctionne directement dans le navigateur
✅ **Accessible partout** - URL publique partageable

## 📊 Structure du Projet

```
nextjs-app/
├── app/
│   ├── page.tsx              # 🏠 Dashboard
│   ├── sync/page.tsx         # 🔄 Synchronisation
│   ├── history/page.tsx      # 📁 Historique
│   ├── stats/page.tsx        # 📊 Statistiques
│   ├── config/page.tsx       # ⚙️ Configuration
│   └── api/
│       ├── config/route.ts   # Validation API key
│       ├── sync/route.ts     # Extraction Bexio
│       └── download/route.ts # Export Excel
├── components/
│   ├── Sidebar.tsx           # Navigation
│   └── AppProvider.tsx       # State management
└── package.json
```

## ❓ Questions Fréquentes

**Q : L'application est-elle sécurisée ?**
R : Oui, la clé API est stockée dans le localStorage du navigateur (jamais sur le serveur).

**Q : Puis-je personnaliser l'application ?**
R : Oui, tout le code est open-source. Modifiez les fichiers dans `nextjs-app/`.

**Q : Combien coûte Vercel ?**
R : GRATUIT pour les projets personnels (bande passante illimitée).

**Q : Puis-je utiliser un domaine personnalisé ?**
R : Oui, Vercel permet d'ajouter votre propre domaine gratuitement.

## 🆘 Support

- **Documentation Next.js** : [nextjs.org/docs](https://nextjs.org/docs)
- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **API Bexio** : [docs.bexio.com](https://docs.bexio.com)

---

**Développé avec ❤️ par BSCO Solutions**
