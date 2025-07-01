# Instructions de déploiement sur Netlify

## Configuration effectuée

✅ Fichier `netlify.toml` créé avec la configuration appropriée pour Next.js
✅ Configuration Next.js mise à jour pour l'export statique
✅ Script d'export ajouté dans `package.json`

## Variables d'environnement à configurer

Votre projet utilise les variables d'environnement suivantes. Vous devrez les configurer dans Netlify :

### Variables publiques (NEXT_PUBLIC_*)
- `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé anonyme de Supabase

### Variables privées (optionnelles selon vos besoins)
- `OPENWEATHER_API_KEY` - Clé API OpenWeather
- `STORMGLASS_API_KEY` - Clé API Stormglass
- `MARINE_API_KEY` - Clé API Marine
- `DIVING_SPOTS_API_URL` - URL de l'API des spots de plongée

## Étapes pour finaliser le déploiement

### 1. Pousser les changements sur GitHub
```bash
git add .
git commit -m "Configuration Netlify ajoutée"
git push origin main
```

### 2. Connecter le projet sur Netlify

1. Allez sur [netlify.com](https://netlify.com) et connectez-vous
2. Cliquez sur "New site from Git"
3. Choisissez GitHub comme provider
4. Sélectionnez votre repository `NathanDenisse/getmydive`
5. Configurez les paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `out`
6. Cliquez sur "Deploy site"

### 3. Configurer les variables d'environnement

1. Dans votre dashboard Netlify, allez dans "Site settings" > "Environment variables"
2. Ajoutez les variables d'environnement listées ci-dessus
3. Redéployez le site après avoir ajouté les variables

### 4. Vérifier le déploiement

Une fois le déploiement terminé, votre site sera accessible à l'URL fournie par Netlify.

## Dépannage

### Erreur de build
- Vérifiez que toutes les variables d'environnement sont configurées
- Consultez les logs de build dans Netlify pour identifier les erreurs

### Problèmes avec les images
- Les images sont configurées en mode non-optimisé pour l'export statique
- Assurez-vous que toutes les images sont dans le dossier `public/`

### Problèmes avec les API
- Vérifiez que les URLs des API sont accessibles depuis Netlify
- Configurez les CORS si nécessaire

## Support

Si vous rencontrez des problèmes, consultez :
- [Documentation Netlify](https://docs.netlify.com/)
- [Documentation Next.js Export](https://nextjs.org/docs/advanced-features/static-html-export) 