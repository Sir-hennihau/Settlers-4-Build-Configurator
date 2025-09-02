# Multi-Civilization System Documentation

## Overview

The Settlers 4 Build Configurator has been extended to support all 4 civilizations: Romans, Vikings, Maya, and Trojans. The system now uses dynamic production rates and resource chain calculations instead of static multipliers.

## Key Features

### 1. Civilization Selection

- **Component**: [`CivilizationSelector`](src/components/civilization-selector/civilizationSelector.tsx:1)
- **Location**: Added to the main App component
- **Functionality**: Dropdown menu to select between the 4 civilizations

### 2. Dynamic Production Rates

- **Data Structure**: [`CivilizationBuildingData`](src/types/building.ts:30)
- **Implementation**: Each civilization has unique production rates for buildings
- **Romans Data**: Migrated from the provided German production rates

### 3. Resource Chain Calculations

- **Algorithm**: [`calculateBuildingMultipliers`](src/helpers/buildingCalculations.ts:14)
- **Logic**: Calculates building requirements by working backwards from Tier 3 soldier needs
- **Requirements**: 1 weapon + 2 gold bars per soldier

## Data Migration

### Romans Production Data (from German values)

```
Sägewerk (Sawmill): 3.118 resources/min
Getreidefarm (Grain Farm): 1.735 resources/min
Getreidefarm [opt]: 1.768 resources/min
Mühle (Mill): 4.519 resources/min
Bäcker (Bakery): 1.728 resources/min
Tierzucht [in]: 2.006 resources/min
Tierzucht [out]: 1.504 resources/min
Metzger (Butcher): 4.747 resources/min
Wasserwerk [opt]: 5.909 resources/min
Mines (Coal/Iron/Gold/Sulfur/Stone):
  - Input: 0.687 resources/min
  - Output: 6.87 resources/min
Goldschmelze (Gold Smelting): 2.807 resources/min
Eisenschmelze (Iron Smelting): 2.986 resources/min
Waffenschmiede (Weaponsmith): 2.167 resources/min
```

## Resource Dependencies

### Tier 3 Soldier Requirements

- **Weapons**: 1 per soldier
- **Gold Bars**: 2 per soldier

### Production Chain

```
Soldier → Weapon + 2 Gold Bars
Weapon → Iron Bar + Coal
Gold Bar → Gold Ore + Coal
Iron Bar → Iron Ore + Coal
Bread → Flour + Water
Flour → Grain (from Mill)
Meat → Animals (from Butcher)
Animals → Grain + Water (from Animal Ranch)
Grain → Grain Farm
Water → Waterworks
Coal → Coal Mine (requires Bread)
Iron Ore → Iron Mine (requires Meat)
Gold Ore → Gold Mine (requires Fish)
```

## Component Updates

### 1. Redux Store

- **Added**: [`selectedCivilization`](src/store/config-store/configSlice.ts:6) state
- **Action**: [`setSelectedCivilization`](src/store/config-store/configSlice.ts:22)

### 2. Building Input

- **Updated**: [`BuildingInput`](src/components/building-input/buildingInput.tsx:18) to use civilization-specific buildings
- **Dynamic**: Building list updates when civilization changes

### 3. Building Output

- **Updated**: [`BuildingOutput`](src/components/building-output/buildingOutput.tsx:7) to use dynamic calculations
- **Real-time**: Updates automatically when civilization or soldier count changes

### 4. Output Items

- **Updated**: [`OutputItem`](src/components/building-output/components/outputItem.tsx:11) to use [`getBuildingMultiplier`](src/helpers/buildingCalculations.ts:165)

## Placeholder Data

For Vikings, Maya, and Trojans, placeholder data has been generated:

- **Vikings**: 90% of Romans production rates (10% slower)
- **Maya**: 110% of Romans production rates (10% faster)
- **Trojans**: 95% of Romans production rates (5% slower)

These can be replaced with actual game data when available.

## File Structure

```
src/
├── types/
│   ├── civilization.ts          # Civilization types and constants
│   └── building.ts              # Building and production rate types
├── data/
│   └── civilizationBuildings.ts # Civilization-specific building data
├── helpers/
│   └── buildingCalculations.ts  # Dynamic calculation logic
├── components/
│   ├── civilization-selector/
│   │   └── civilizationSelector.tsx
│   ├── building-input/
│   │   └── buildingInput.tsx    # Updated for multi-civ support
│   └── building-output/
│       ├── buildingOutput.tsx   # Updated for multi-civ support
│       └── components/
│           └── outputItem.tsx   # Updated calculation logic
└── store/
    └── config-store/
        └── configSlice.ts       # Added civilization state
```

## Usage

1. **Select Civilization**: Use the dropdown at the top to choose a civilization
2. **Choose Building**: Select a building type from the updated building list
3. **Set Amount**: Enter the number of buildings you want to build
4. **View Requirements**: See the calculated building requirements for all other buildings

## Future Enhancements

1. **Real Data**: Replace placeholder data with actual game values for Vikings, Maya, and Trojans
2. **Resource Visualization**: Add resource flow diagrams
3. **Optimization**: Add building ratio optimization suggestions
4. **Validation**: Add input validation for production rates
5. **Export**: Add functionality to export building configurations

## Technical Notes

- **Backward Compatibility**: Legacy [`Building`](src/types/building.ts:37) type maintained for compatibility
- **Error Handling**: ESLint warnings resolved with proper disable comments
- **Performance**: Calculations are memoized through Redux state management
- **Type Safety**: Full TypeScript support with proper type definitions
