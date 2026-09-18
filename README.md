# Settlers 4 Build Configurator

A small project to calculate the amount of buildings you need to fulfill your T3 unit supply chain for the game Settlers 4.

Features:

- All 4 civilizations
- Solve from either end: "I have N of this building" or "I want N T3 soldiers/min"
- Supports dynamic amounts of toolsmiths
- Supports stone mining, either as a mine count or as a stone/min target
- Supports double-deposit iron and stone mines
- Includes the fisher, so the gold chain is fully fed

This project is hosted with Github pages. You can find it [here](https://sir-hennihau.github.io/Settlers-4-Build-Configurator/).

## Development

```bash
npm install
npm start                      # dev server
npm test -- --watchAll=false   # tests
npm run build                  # production build
```

The production chain is described declaratively in `src/domain/model/recipes.ts`, and each civilization contributes one tick value per building in `src/domain/data/civilizations.ts`. All input rates are derived from those, so there is a single source of truth for the model. See `CLAUDE.md` for the architecture notes.
