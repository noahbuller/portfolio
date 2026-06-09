# Noah Buller — Portfolio

Immersive coastal city homepage with scrollable projects and experience pages.

**Stack:** Next.js 16 · React 19 · TypeScript · Space Grotesk

**Live:** [whoisnoahbuller.com](https://whoisnoahbuller.com)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

CI runs the same on push/PR (`.github/workflows/ci.yml`).

## Structure

- `/` — immersive city scene (no scroll)
- `/projects` — project index and case studies
- `/experience` — internships, education, coursework
- Content lives in `src/data/` (`projects.ts`, `experience.ts`, `ctas.ts`)
