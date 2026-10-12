# Haiti Redesign

Initiative open source pour moderniser les interfaces web des entreprises et des institutions en Haïti : des expériences rapides, accessibles et élégantes.

[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-yellow.svg)](#-licence)

---

## ✨ Vision

Beaucoup de sites institutionnels et commerciaux haïtiens portent encore une expérience datée : lente, peu lisible sur mobile, difficile à maintenir. **Haiti Redesign** est une initiative personnelle et open source qui propose une autre référence.

Chaque projet du monorepo est une refonte concrète : une landing page ou une interface repensée pour une entreprise ou une institution, avec une UX claire, une UI soignée, des performances solides et une accessibilité prise au sérieux. Le premier chantier est [Zed Airlines](#-projets). D'autres suivront, au fil des suggestions de la communauté.

L'objectif est simple : **élever le standard du web haïtien**, un site à la fois, et partager le code pour que d'autres puissent s'en inspirer, le réutiliser ou le prolonger.

---

## 🗂️ Structure du monorepo

Le dépôt est un workspace [pnpm](https://pnpm.io) orchestré par [Turborepo](https://turbo.build). Les scripts racine (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`) parcourent chaque application de `apps/*` dès qu'elle déclare le script correspondant. Une nouvelle application se branche en ajoutant `apps/<nom>/package.json` : le workspace et Turborepo la prennent en compte sans modifier la racine.

```text
haiti-redesign/
├── apps/
│   └── zed-airlines/          # Landing page Zed Airlines (Next.js, FR / EN)
├── packages/                  # Bibliothèques partagées (workspace prêt)
├── package.json               # Scripts racine, engines, packageManager
├── pnpm-workspace.yaml        # apps/* et packages/*
├── pnpm-lock.yaml
├── turbo.json                 # Pipeline build, dev, lint, test
└── README.md
```

| Dossier | Rôle |
| --- | --- |
| `apps/zed-airlines` | Premier projet de refonte, en cours. |
| `apps/*` | Emplacement des prochaines refontes (une application par entreprise ou institution). |
| `packages/` | Point d'entrée des packages partagés. Le premier prévu est `packages/ui` (composants et design system), aux côtés d'éventuelles configs TypeScript, ESLint ou Tailwind. |

---

## ✈️ Projets

### En cours

| Projet | Chemin | Démo | Stack | Statut |
| --- | --- | --- | --- | --- |
| **Zed Airlines** | [`apps/zed-airlines`](apps/zed-airlines) | [localhost:3000/fr](http://localhost:3000/fr) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, next-intl | En développement |

Zed Airlines est une landing page bilingue (français par défaut, anglais sur `/en`). Elle couvre la recherche de vols, les destinations, l'enregistrement, les bagages et les informations pratiques, avec une direction visuelle contemporaine.

La démo publique sera ajoutée dans ce tableau dès la mise en ligne sur Vercel.

Lancer uniquement cette application :

```bash
pnpm --filter zed-airlines dev
```

### À venir

Les prochaines refontes vivront dans `apps/<nom>`. Une idée d'entreprise, d'institution ou de service public haïtien est la bienvenue : ouvrez une issue avec le nom du site, le lien actuel et ce qui mérite d'être repensé.

---

## 🛠️ Stack

| Couche | Choix |
| --- | --- |
| Applications | Next.js (App Router), TypeScript, React |
| UI | Tailwind CSS, shadcn/ui |
| Monorepo | pnpm workspaces, Turborepo |
| Hébergement | Vercel |
| CI | GitHub Actions (à brancher sur le dépôt) |

---

## 🚀 Installation locale

### Prérequis

- [Node.js](https://nodejs.org) **20.9** ou plus récent
- [pnpm](https://pnpm.io) **10.18** (version fixée dans `packageManager`)

```bash
corepack enable
corepack prepare pnpm@10.18.0 --activate
```

### Démarrer

Depuis la racine du dépôt :

```bash
git clone <url-de-ce-dépôt>
cd haiti-redesign
pnpm install
pnpm dev
```

`pnpm dev` lance chaque application de `apps/*`. Zed Airlines écoute sur le port **3000** :

- Français : [http://localhost:3000/fr](http://localhost:3000/fr)
- Anglais : [http://localhost:3000/en](http://localhost:3000/en)

Une application ajoutée ensuite choisit un autre port dans son script `dev`, par exemple `next dev --port 3001`.

### Build et qualité

```bash
pnpm build    # build de production de chaque application
pnpm start    # sert le build (après pnpm build)
pnpm lint
pnpm test
```

---

## ☁️ Déploiement Vercel

Créer un projet Vercel à partir de ce dépôt, puis régler :

| Réglage | Valeur |
| --- | --- |
| Root Directory | `apps/zed-airlines` |
| Framework Preset | Next.js |
| Install Command | détectée (`pnpm install`) |
| Build Command | `turbo run build` (détectée via `turbo.json`) |
| Ignored Build Step | `npx turbo-ignore --fallback=HEAD^1` |

Le fichier `apps/zed-airlines/vercel.json` fixe déjà l'étape ignorée. Laissez activée l'option « Include source files outside of the Root Directory » : Vercel doit pouvoir lire `turbo.json`, `pnpm-workspace.yaml` et le lockfile à la racine du dépôt.

Chaque future application de `apps/*` aura son propre projet Vercel, avec son propre Root Directory.

---

## 🤝 Contribution

La communauté tech haïtienne et internationale est invitée à faire avancer le projet.

- **Proposer une entreprise ou une institution** à reconcevoir : nom, URL actuelle, et ce qui bloque l'expérience aujourd'hui.
- **Contribuer au code** : une issue, puis une pull request ciblée (accessibilité, performance, contenu, nouveau composant partagé).
- **Donner un retour** sur Zed Airlines ou sur la direction visuelle des prochaines refontes.

Pour une contribution locale :

```bash
pnpm install
pnpm --filter zed-airlines dev
pnpm lint
```

Gardez les changements petits, cohérents avec l'application concernée, et décrivez dans la pull request ce que la personne qui visite le site gagne.

---

## 📄 Licence

Ce projet est distribué sous licence **MIT**. Le code peut être utilisé, modifié et partagé, y compris dans un cadre commercial, à condition de conserver la notice de copyright.

Copyright (c) 2026 Luvalin Lulin Dery Juslin

---

## 📬 Contact

**Luvalin Lulin Dery Juslin** — auteur du projet.

- Site : [deryjuslin.com](https://deryjuslin.com)
- LinkedIn : [linkedin.com/in/deryjuslin](https://www.linkedin.com/in/deryjuslin)
- Courriel : [contactderyjuslin@gmail.com](mailto:contactderyjuslin@gmail.com)

Une suggestion de refonte, une question ou une envie de contribuer : un message ou une issue sur ce dépôt GitHub suffit.
