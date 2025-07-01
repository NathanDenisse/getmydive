# GetMyDive - Site de Plongée

Ceci est un projet [Next.js](https://nextjs.org) pour un site web de plongée avec des spots, clubs et expériences.

## 🚀 Démarrage Rapide

Pour lancer le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## 🛠️ Technologies Utilisées

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Supabase** - Base de données
- **Leaflet** - Cartes interactives
- **React Icons** - Icônes

## 📁 Structure du Projet

```
├── app/                 # Pages et routes Next.js
├── src/
│   ├── components/      # Composants React
│   ├── data/           # Données JSON
│   ├── hooks/          # Hooks personnalisés
│   ├── lib/            # Utilitaires et configurations
│   └── types/          # Types TypeScript
├── public/             # Assets statiques
└── supabase/           # Configuration Supabase
```

## 🌐 Déploiement

### Déploiement sur Netlify

Ce projet est configuré pour être déployé automatiquement sur Netlify via GitHub.

#### Étapes de configuration :

1. **Créer un dépôt GitHub** :
   ```bash
   git remote add origin https://github.com/votre-username/getmydive.git
   git push -u origin main
   ```

2. **Connecter à Netlify** :
   - Allez sur [netlify.com](https://netlify.com)
   - Cliquez sur "New site from Git"
   - Connectez votre compte GitHub
   - Sélectionnez votre dépôt `getmydive`
   - Les paramètres de build sont automatiquement configurés via `netlify.toml`

3. **Variables d'environnement** (si nécessaire) :
   - Dans les paramètres Netlify, ajoutez vos variables d'environnement Supabase

#### Déploiement automatique :
- Chaque push sur la branche `main` déclenche automatiquement un nouveau déploiement
- Les modifications sont déployées en quelques minutes

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Netlify](https://docs.netlify.com)
- [Documentation Supabase](https://supabase.com/docs)
# Redéploiement avec variables d'environnement
