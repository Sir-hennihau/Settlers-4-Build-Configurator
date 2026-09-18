# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page calculator for the game Settlers 4: given either a building count or a target soldier rate, it sizes every building needed to sustain the tier-3 (T3) soldier production chain. Supports all 4 civilizations, variable toolsmiths, optional stone mining, and double-deposit mines. Deployed to GitHub Pages at https://sir-hennihau.github.io/Settlers-4-Build-Configurator/.

## Commands

Create React App (react-scripts 5), TypeScript, no ejection.

```bash
npm start                                      # dev server on :3000
npm run build                                  # production build to build/
npm test                                       # Jest watch mode
npm test -- --watchAll=false                   # single run, e.g. for CI
npm test -- --testPathPattern domain           # domain tests only
npm test -- -t "round-trips"                   # run tests by name
npx tsc --noEmit                               # typecheck without building
npm run deploy                                 # builds, then gh-pages -d build
```

No standalone lint script; ESLint runs via the `react-app` config during `start`/`build`.

## Architecture

The whole calculator is a **declarative production graph plus one generic solver**. Nothing about the chain is hardcoded in procedural form — adding a building or a constraint is a data change in `src/domain/model/recipes.ts`.

### Layers

```
src/domain/model/    resources, buildings, recipes, graph (Kahn sort), rates
src/domain/data/     per-civilization tick tables
src/domain/solve/    allocators -> forward -> breakpoints -> inverse -> solve
src/domain/fixtures/ published-rate and legacy-behaviour fixtures (not tests)
src/state/           useReducer + two contexts; useSolution()
src/components/      presentation only
```

`src/domain` is pure and has no React import. That is where essentially all the test coverage lives (~520 tests); UI tests are deliberately thin smoke tests.

### The two invariants everything rests on

**1. Recipe ratios are civilization-independent, and exactly integral.** Verified against the game's ticks-per-resource table for all four civs — e.g. the Roman iron mine satisfies `4 × 1080 ticks-in = 15 × 288 ticks-out = 4320`. Consequently a civilization needs only **one number per building** (`ticksPerCycle`), and every input rate is *derived* in `inputRatePerMinute`, never stored. `rates.test.ts` checks all 112 derived cells against the published per-minute table.

**2. The forward map is continuous, monotone and piecewise-linear**, so the inverse is obtained by sampling the forward solver at its breakpoints and interpolating — exactly, not approximately. There is only ever one implementation of the model.

### Things that will bite you

- **`Recipe.outputQty` is a ratio numerator; `BuildingTiming.unitsPerCycle` is a batch size.** They are not the same thing. The coal mine's recipe is `15 coal : 2 bread` but its cycle produces one coal. Only `animalRanch` has `unitsPerCycle: 3` — because `1685/3` is not an integer and the published `561.66` is a rounded value. Conflating the two silently breaks the ranch.
- **Do not hardcode the resolution order.** `graph.ts` derives it with Kahn's algorithm. The invariant "coal resolves after all four of its consumers" *is* `indegree(coal) === 4`; a hardcoded list would be a second source of truth that rots silently.
- **The published rate table rounds in some cells and truncates in others** (18 vs 38 of 112). Any comparison against it needs a ±0.001 tolerance. Note `toBeCloseTo(x, 3)` means ±0.0005 and is too strict.
- **The tick table is ordered R, W, M, T, U while the per-minute table is ordered W, R, M, T, U** — Romans and Vikings are swapped between them. "Trojans" means the Ubo (U) column throughout.
- **Only one non-linearity exists: iron ore.** Double-deposit mines consume the same input for double output, which makes input demand proportional to *building count* rather than to output. That is confined to `doubleEfficiencyAllocator`. `assertNoKinkedAncestors()` (run at module load) guards the precondition that keeps the inverse closed-form; if it ever fires, `bisect.ts` is the fallback — it currently exists only as a test oracle.
- **Stone behaves differently in the two stone modes.** With a mine *count*, double stone mines are a deliberate no-op on every building count (same mines, same bread) and only raise stone output. With a stone-per-minute *target*, they cut mines and bread. This is pinned in `doubleMines.test.ts` so the no-op stays a decision.
- **`stoneMine` and `toolSmith` are excluded from `ANCHOR_BUILDINGS`.** They are exogenous inputs with zero slope, so they cannot be inverted.

### State flow

`src/state/inputs.ts` holds **only what the user typed**; derived values are recomputed by `useSolution()`. The reducer returns the identical state object for no-op actions so the memo does not churn, and it is the single place raw input is sanitised (`clampNonNegative`). View-only state such as "is the stone section expanded" stays in component `useState`.

## Conventions

- MUI v5 with `sx` props, no theme customization. `src/index.css` is minimal.
- Components in kebab-case folders with camelCase files, named exports (`App` is the exception).
- Building amounts are unrounded floats; `getPreviewString` rounds to 1 decimal at display time only.
- Give every MUI `Select` an `id`/`labelId` pair and every `TextField` an explicit `id`, or `getByLabelText` in tests cannot find them.
