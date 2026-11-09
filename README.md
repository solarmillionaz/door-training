# DOOR TRAINING! — AZ Power Program

Mobile-first forehead-guessing training game for door-to-door solar teams: Objections • Smokescreens • Concerns.

Live: https://solarmillionaz.github.io/door-training/

- Vite + React + TypeScript + Tailwind CSS, static site, no login (localStorage only)
- `npm run dev` / `npm run build` / `npx vitest run` / `node e2e/run.mjs http://localhost:4173/`
- Card content: hand-written homeowner lines in `src/data/lines/*.ts` (tagged by situation), situations + coaching in `src/data/{objections,smokescreens,concerns}.ts`, original 96 cards in `src/data/core.ts`. Run `npx tsx scripts/count.ts` for counts and any near-duplicates dropped; coach styles: `src/data/coaches.ts`

Coaching tips are original and inspired by general publicly known ideas from well-known sales trainers; not affiliated with or endorsed by them.
