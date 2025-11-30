import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    unitSystem: 'imperial' | 'metric';
    toggleUnitSystem: () => void;
    setUnitSystem: (system: 'imperial' | 'metric') => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            unitSystem: 'imperial', // Default to Imperial
            toggleUnitSystem: () => set((state) => ({
                unitSystem: state.unitSystem === 'metric' ? 'imperial' : 'metric'
            })),
            setUnitSystem: (system) => set({ unitSystem: system }),
        }),
        {
            name: 'cranksmith-settings',
        }
    )
);
