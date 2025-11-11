import { ThemeColors } from './types.ts';

// Helper to convert hex to an "R G B" string for CSS variables
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '';
};

// Default colors in Hex for the color picker
export const defaultColorsHex: { [key: string]: string } = {
  'primary': '#B45309',
  'primary-focus': '#92400E',
  'gold-light': '#FDE047',
  'gold-default': '#F59E0B',
  'gold-dark': '#B45309',
  'secondary': '#4F46E5',
  'header-background': '#FFFFFF',
  'background': '#F8FAFC',
  'surface': '#FFFFFF',
  'text-primary': '#1E293B',
  'text-secondary': '#64748B',
  'dark-header-background': '#0F172A',
  'dark-background': '#020617',
  'dark-surface': '#0F172A',
  'dark-text-primary': '#F1F5F9',
  'dark-text-secondary': '#94A3B8',
};

// Labels for the theme editor
export const themeColorLabels: { [key: string]: string } = {
    'primary': 'Primer',
    'primary-focus': 'Primer (Fokus)',
    'gold-light': 'Emas (Cerah)',
    'gold-default': 'Emas (Default)',
    'gold-dark': 'Emas (Gelap)',
    'secondary': 'Sekunder',
    'header-background': 'Header Latar (Cerah)',
    'background': 'Latar Belakang (Cerah)',
    'surface': 'Permukaan (Cerah)',
    'text-primary': 'Teks Primer (Cerah)',
    'text-secondary': 'Teks Sekunder (Cerah)',
    'dark-header-background': 'Header Latar (Gelap)',
    'dark-background': 'Latar Belakang (Gelap)',
    'dark-surface': 'Permukaan (Gelap)',
    'dark-text-primary': 'Teks Primer (Gelap)',
    'dark-text-secondary': 'Teks Sekunder (Gelap)',
};


// Default theme colors formatted for CSS variables
export const defaultThemeColors: ThemeColors = {
  '--color-primary': hexToRgb(defaultColorsHex['primary']),
  '--color-primary-focus': hexToRgb(defaultColorsHex['primary-focus']),
  '--color-gold-light': hexToRgb(defaultColorsHex['gold-light']),
  '--color-gold-default': hexToRgb(defaultColorsHex['gold-default']),
  '--color-gold-dark': hexToRgb(defaultColorsHex['gold-dark']),
  '--color-secondary': hexToRgb(defaultColorsHex['secondary']),
  '--color-header-background': hexToRgb(defaultColorsHex['header-background']),
  '--color-background': hexToRgb(defaultColorsHex['background']),
  '--color-surface': hexToRgb(defaultColorsHex['surface']),
  '--color-text-primary': hexToRgb(defaultColorsHex['text-primary']),
  '--color-text-secondary': hexToRgb(defaultColorsHex['text-secondary']),
  '--color-dark-header-background': hexToRgb(defaultColorsHex['dark-header-background']),
  '--color-dark-background': hexToRgb(defaultColorsHex['dark-background']),
  '--color-dark-surface': hexToRgb(defaultColorsHex['dark-surface']),
  '--color-dark-text-primary': hexToRgb(defaultColorsHex['dark-text-primary']),
  '--color-dark-text-secondary': hexToRgb(defaultColorsHex['dark-text-secondary']),
};