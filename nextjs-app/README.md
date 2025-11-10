# Dashboard Bexio → Power BI (Next.js)

Application web moderne pour extraire les données Bexio et les exporter vers Power BI.

## Fonctionnalités

- 🔐 Configuration sécurisée de la clé API Bexio
- 🔄 Synchronisation des contacts, factures et projets
- 📊 Visualisation des statistiques en temps réel
- 📥 Export Excel pour Power BI
- 📁 Historique des synchronisations
- 🎨 Interface moderne avec navigation sidebar

## Installation locale

```bash
cd nextjs-app
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel (Recommandée)

1. Créez un compte gratuit sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez ce repository GitHub
4. Vercel détectera automatiquement Next.js
5. Configurez le **Root Directory** : `nextjs-app`
6. Cliquez sur "Deploy"

### Méthode 2 : Via CLI Vercel

```bash
npm i -g vercel
cd nextjs-app
vercel
```

## Configuration

1. Accédez à la page **Configuration** dans l'application
2. Obtenez votre clé API Bexio : [Bexio → Paramètres → API](https://office.bexio.com/index.php/settings/api)
3. Entrez la clé et enregistrez
4. L'application est prête à synchroniser vos données

## Structure

```
nextjs-app/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── sync/page.tsx         # Synchronisation
│   ├── history/page.tsx      # Historique
│   ├── stats/page.tsx        # Statistiques
│   ├── config/page.tsx       # Configuration
│   ├── api/
│   │   ├── config/route.ts   # Validation API key
│   │   ├── sync/route.ts     # Extraction Bexio
│   │   └── download/route.ts # Export Excel
│   └── layout.tsx
├── components/
│   ├── Sidebar.tsx           # Navigation
│   └── AppProvider.tsx       # State management
└── lib/
    └── dataStore.ts          # Data storage
```

## Technologies

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne
- **Axios** - Requêtes HTTP
- **XLSX** - Export Excel
- **Vercel** - Hébergement gratuit

## API Bexio

L'application utilise les endpoints Bexio suivants :

- `GET /2.0/contact` - Liste des contacts
- `GET /2.0/kb_invoice` - Liste des factures
- `GET /2.0/pr_project` - Liste des projets

## License

MIT - Open Source

---

Développé par BSCO Solutions
