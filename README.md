# MonoFeed 🇵🇭

> Daily 100% verified facts about the Philippines in a minimal, high-contrast, offline-first Progressive Web App (PWA).

## Features

- **100% Fact-Checked Daily Cards**: Deeply researched, verified facts with primary sources (NAMRIA, National Museum, NHCP, UNESCO, *Nature*, USPTO).
- **Mobile-First & One-Handed Ergonomics**: Bottom thumb dock, horizontal swipe gestures, and double-tap to save.
- **PWA Ready**: Offline-capable service worker, Web App Manifest, installable on iOS and Android.
- **Social Sharing**: Direct post to Twitter/X and an in-app Instagram Card generator (1:1 feed and 9:16 story formats).
- **Accessibility**: High-contrast monochromatic themes (Dark, OLED Black, Paper Light), font scaling, and text-to-speech audio reader.

---

## Deploying to GitHub Pages

This repository is pre-configured with two deployment options:

### Option 1: Automated GitHub Actions (Recommended)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for MonoFeed"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. That's it! The included `.github/workflows/deploy.yml` workflow will automatically build and deploy your app to:
   ```
   https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```

---

### Option 2: One-Command CLI Deployment (`gh-pages`)

If you prefer deploying directly from your terminal to the `gh-pages` branch:

1. Ensure your git remote is set:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   ```
2. Run the deploy script:
   ```bash
   npm run deploy
   ```
3. In GitHub **Settings** → **Pages**, set **Source** to **Deploy from a branch** and select `gh-pages` branch (`/ (root)`).

---

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```
