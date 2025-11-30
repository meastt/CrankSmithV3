export type UnitSystem = 'imperial' | 'metric';

export const toSpeed = (kmh: number, system: UnitSystem) => system === 'metric' ? kmh : kmh * 0.621371;
export const speedUnit = (system: UnitSystem) => system === 'metric' ? 'km/h' : 'mph';

export const toWeight = (kg: number, system: UnitSystem) => system === 'metric' ? kg : kg * 2.20462;
export const weightUnit = (system: UnitSystem) => system === 'metric' ? 'kg' : 'lbs';

export const toPressure = (psi: number, system: UnitSystem) => system === 'metric' ? psi * 0.0689476 : psi;
export const pressureUnit = (system: UnitSystem) => system === 'metric' ? 'bar' : 'psi';

// Inverse for inputs (converting display value back to base unit)
export const fromWeight = (value: number, system: UnitSystem) => system === 'metric' ? value : value / 2.20462;
