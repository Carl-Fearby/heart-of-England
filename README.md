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
```

The production build exports the website to `out/`. Netlify uses the committed
`netlify.toml` to build and publish this directory. Other static hosts should
serve `out/` as their document root.

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

## Enquiries and deployment checks

The event enquiry form uses Netlify Forms. Before the next combined deployment,
confirm that form detection is enabled in the site's Netlify Forms settings.
After deployment, confirm that `event-enquiry` is listed and that the form accepts
a test submission. Set the sales team's notification recipient in Netlify;
notification delivery is not configured by this repository. A local preview can
exercise the interface but cannot verify Netlify acceptance or email delivery.

Run `npm run lint`, `npm run build`, `node tests/events.mjs`,
`node tests/rooms.mjs` and `python3 tests/check-export.py` locally
before pushing. The export check covers canonical URLs, sitemap destinations,
page assets and the static form definition. Push complete, checked batches to
avoid unnecessary Netlify builds.

## Events and images

Maintain event dates, prices and booking links in `app/events.ts`. Source details
were reviewed on 15 September 2026. The event listing removes expired events in
the browser using the Europe/London date and at build time; rebuild after content
changes so the exported HTML stays current for visitors without JavaScript.

Run `npm run images:optimise` after adding source images. Commit both
`public/optimised/` and `app/data/optimised-images.json` with the source changes.
This generates responsive WebP variants locally; deployments serve them directly
without an image optimisation service. The homepage video loads only when played.

Search metadata continues to use `https://heartofengland.uk` as the intended
production domain. The Netlify URL is the review address until domain cutover.
