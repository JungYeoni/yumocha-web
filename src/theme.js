import { createContext, useContext } from 'react'

export const ThemeContext = createContext('light')
export const useTheme = () => useContext(ThemeContext)

export const themeColors = {
  light: { accent: '#246BEB', accentRgb: '36,107,235', mutedBar: '#d1d5db', zoneA: '#ECF2FE', zoneB: '#f3f4f6', line: '#9ca3af', textOnAccent: '#fff' },
  dark: { accent: '#6BA8FF', accentRgb: '107,168,255', mutedBar: '#4b5563', zoneA: 'rgba(107,168,255,.12)', zoneB: 'rgba(255,255,255,.05)', line: '#8b95a1', textOnAccent: '#0b1220' },
}
