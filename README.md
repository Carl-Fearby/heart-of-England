# Heart of England

Heart of England website built with Next.js, React, and TypeScript, including Quicken Tree pages and locally stored site assets.

## Local development

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Production

```sh
npm run build
npm start
```

## Checks

```sh
npm run lint
npm run build
```

## Project structure

- `app/`: routes, page content, and styles
- `components/`: shared interface components
- `public/`: images and other static assets
- `scripts/`: asset migration and report utilities

Publishing this repository to GitHub stores the source code; a hosting provider is required to serve the website publicly.
