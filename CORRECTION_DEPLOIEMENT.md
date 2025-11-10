# ⚠️ CORRECTION : Erreur "No flask entrypoint found"

## Problème

Vercel essaie de déployer l'ancien code Python au lieu de l'application Next.js.

**Erreur** : `No flask entrypoint found`

## ✅ Solution : Configurer le Root Directory

Lors du déploiement sur Vercel, vous DEVEZ configurer le **Root Directory** pour pointer vers le dossier `nextjs-app`.

### Étapes à Suivre

#### 1. Supprimer le déploiement actuel (si existe)

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Trouvez le projet BSCO-Dashboard-PowerBI
3. Cliquez sur **Settings** → **General**
4. Tout en bas, cliquez sur **Delete Project**

#### 2. Créer un nouveau déploiement

1. Retournez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New..."** → **"Project"**
3. Importez le repository **BSCO-Dashboard-PowerBI**

#### 3. **IMPORTANT** : Configurer le Root Directory

Sur l'écran de configuration, **AVANT** de cliquer Deploy :

```
┌─────────────────────────────────────────────┐
│ Framework Preset: Next.js                   │  ← Doit être détecté automatiquement
├─────────────────────────────────────────────┤
│ Root Directory: nextjs-app     [Edit]       │  ← ⚠️ CLIQUEZ SUR [Edit]
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Root Directory                          │ │
│ │ nextjs-app                              │ │  ← Tapez "nextjs-app"
│ │ ✓ Include source files outside...      │ │  ← Cochez cette case
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Build Command: npm run build               │  ← Automatique
│ Output Directory: .next                     │  ← Automatique
│ Install Command: npm install                │  ← Automatique
└─────────────────────────────────────────────┘
```

**Checklist** :
- ✅ Root Directory = `nextjs-app`
- ✅ Framework Preset = `Next.js`
- ✅ Cocher "Include source files outside of the Root Directory"

#### 4. Déployer

Cliquez sur **"Deploy"** → Vercel va maintenant :
- ✅ Aller dans le dossier `nextjs-app/`
- ✅ Détecter Next.js
- ✅ Installer les dépendances
- ✅ Builder l'application
- ✅ Déployer sur CDN

**Durée** : 2-3 minutes

## 🎯 Résultat Attendu

Une fois le déploiement réussi, vous verrez :

```
✓ Build succeeded
✓ Deployment ready
🎉 https://bsco-dashboard-powerbi.vercel.app
```

## 🔧 Alternative : Déploiement via CLI

Si vous préférez utiliser la ligne de commande :

```bash
cd nextjs-app
npm install -g vercel
vercel
```

La CLI détectera automatiquement Next.js dans le dossier courant.

## 📋 Vérification Post-Déploiement

Une fois déployé, testez :
1. Ouvrez l'URL Vercel
2. Vous devriez voir le **Dashboard** avec le menu sidebar
3. Allez sur **Configuration**
4. Entrez votre clé API Bexio
5. Allez sur **Synchronisation**
6. Cliquez sur **Synchroniser maintenant**
7. Téléchargez le fichier Excel

## ❓ Pourquoi cette erreur ?

Le repository contient 2 applications :
- `webapp/` - Ancienne application Python/Flask (obsolète)
- `nextjs-app/` - Nouvelle application Next.js (à déployer)

Sans spécifier le Root Directory, Vercel regarde à la racine du repo, trouve des fichiers Python, et essaie de déployer comme une app Flask → **ERREUR**.

En configurant `Root Directory = nextjs-app`, Vercel ignore tout le reste et se concentre uniquement sur l'application Next.js.

## 🗑️ Nettoyage (Optionnel)

Pour éviter toute confusion future, vous pouvez :

```bash
# Archiver l'ancienne app Python
mkdir archive
mv webapp/ archive/
mv scripts/ archive/
mv railway.json.old archive/

# Commiter
git add -A
git commit -m "Archive old Python application"
git push
```

---

**Une fois ces étapes suivies, votre application Next.js sera déployée avec succès !** 🚀
