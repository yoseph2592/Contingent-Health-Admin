import { BrandPalette } from '../types';

// Convert RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

// Convert Hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Calculate relative luminance according to WCAG guidelines
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Get contrast ratio between two hex colors
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Ensure the color is safe for text/button usage (Rule 11: Accessibility rule)
export function getAccessibleTextColor(backgroundHex: string): '#FFFFFF' | '#0F172A' {
  const whiteRatio = getContrastRatio(backgroundHex, '#FFFFFF');
  const darkRatio = getContrastRatio(backgroundHex, '#0F172A');
  return whiteRatio >= 4.5 ? '#FFFFFF' : '#0F172A';
}

// Produce an accessible primary button color if the extracted logo color is too washed out
export function makeAccessibleBrandColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const lum = getLuminance(r, g, b);

  // If color is excessively bright (e.g. pale yellow or near white), darken it for button visibility
  if (lum > 0.75) {
    return rgbToHex(Math.round(r * 0.45), Math.round(g * 0.45), Math.round(b * 0.45));
  }
  // If color is near pitch black, lighten slightly to a rich charcoal slate
  if (lum < 0.03) {
    return rgbToHex(Math.max(r, 20), Math.max(g, 35), Math.max(b, 55));
  }
  return hex;
}

// Extract dominant colors from an image element or image URL via canvas
export async function extractPaletteFromImage(
  imageSource: string | HTMLImageElement
): Promise<BrandPalette> {
  return new Promise((resolve) => {
    const img = typeof imageSource === 'string' ? new Image() : imageSource;
    if (typeof imageSource === 'string') {
      img.crossOrigin = 'Anonymous';
      img.src = imageSource;
    }

    const processImage = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(DEFAULT_BRAND_PALETTE);
          return;
        }

        const width = (canvas.width = Math.min(100, img.naturalWidth || img.width || 100));
        const height = (canvas.height = Math.min(100, img.naturalHeight || img.height || 100));

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();

        // Sample pixels every 4 pixels
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Filter transparent and almost pure white / pure black backgrounds
          if (a < 128) continue;
          if (r > 245 && g > 245 && b > 245) continue; // skip pure white bg
          if (r < 15 && g < 15 && b < 15) continue; // skip pure black bg

          // Quantize to bucket of 16
          const qr = Math.floor(r / 20) * 20;
          const qg = Math.floor(g / 20) * 20;
          const qb = Math.floor(b / 20) * 20;
          const key = `${qr},${qg},${qb}`;

          const existing = colorMap.get(key);
          if (existing) {
            existing.count++;
          } else {
            colorMap.set(key, { r, g, b, count: 1 });
          }
        }

        const sortedColors = Array.from(colorMap.values()).sort((a, b) => b.count - a.count);

        if (sortedColors.length === 0) {
          resolve(DEFAULT_BRAND_PALETTE);
          return;
        }

        // Primary color: most prominent color with solid saturation
        const primaryRaw = rgbToHex(sortedColors[0].r, sortedColors[0].g, sortedColors[0].b);
        const primary = makeAccessibleBrandColor(primaryRaw);

        // Secondary color: next distinct color
        let secondary = '#0D9488'; // Default teal if only one dominant color
        if (sortedColors.length > 1) {
          secondary = rgbToHex(sortedColors[1].r, sortedColors[1].g, sortedColors[1].b);
        }

        // Accent color: third color or complementary
        let accent = '#38BDF8';
        if (sortedColors.length > 2) {
          accent = rgbToHex(sortedColors[2].r, sortedColors[2].g, sortedColors[2].b);
        } else {
          // Generate an accent that harmonizes
          const pRgb = hexToRgb(primary);
          accent = rgbToHex(
            Math.min(255, pRgb.r + 40),
            Math.min(255, pRgb.g + 50),
            Math.min(255, pRgb.b + 70)
          );
        }

        const text = getAccessibleTextColor(primary);
        const pRgb = hexToRgb(primary);
        const primaryLight = `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.08)`;
        const primaryBorder = `rgba(${pRgb.r}, ${pRgb.g}, ${pRgb.b}, 0.22)`;

        resolve({
          primary,
          secondary,
          accent,
          neutralBg: '#F8FAFC',
          primaryText: text,
          primaryLight,
          primaryBorder,
          primaryContrast: text,
          lightTint: primaryLight,
          primaryHover: secondary,
          isAutoDetected: true,
        });
      } catch (err) {
        console.warn('Image extraction failed, using fallback:', err);
        resolve(DEFAULT_BRAND_PALETTE);
      }
    };

    if (img.complete && img.naturalHeight !== 0) {
      processImage();
    } else {
      img.onload = processImage;
      img.onerror = () => resolve(DEFAULT_BRAND_PALETTE);
    }
  });
}

export const DEFAULT_BRAND_PALETTE: BrandPalette = {
  primary: '#0284C7', // Contingent Medical Blue
  secondary: '#0D9488', // Deep Teal
  accent: '#38BDF8', // Sky Accent
  neutralBg: '#F8FAFC',
  primaryText: '#FFFFFF',
  primaryLight: 'rgba(2, 132, 199, 0.08)',
  primaryBorder: 'rgba(2, 132, 199, 0.25)',
  primaryContrast: '#FFFFFF',
  lightTint: 'rgba(2, 132, 199, 0.08)',
  primaryHover: '#0369A1',
  isAutoDetected: false,
};

export function getDefaultPalette(primaryHex: string = '#0284C7'): BrandPalette {
  const accessiblePrimary = makeAccessibleBrandColor(primaryHex);
  const rgb = hexToRgb(accessiblePrimary);
  const text = getAccessibleTextColor(accessiblePrimary);
  const secondary = rgbToHex(
    Math.max(0, Math.round(rgb.r * 0.85)),
    Math.max(0, Math.round(rgb.g * 0.85)),
    Math.max(0, Math.round(rgb.b * 0.85))
  );
  const accent = rgbToHex(
    Math.min(255, Math.round(rgb.r * 1.2 + 25)),
    Math.min(255, Math.round(rgb.g * 1.2 + 25)),
    Math.min(255, Math.round(rgb.b * 1.2 + 35))
  );
  const light = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`;
  const border = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;

  return {
    primary: accessiblePrimary,
    secondary,
    accent,
    neutralBg: '#F8FAFC',
    primaryText: text,
    primaryLight: light,
    primaryBorder: border,
    primaryContrast: text,
    lightTint: light,
    primaryHover: secondary,
    isAutoDetected: false,
  };
}

// Preset high-quality logos for instant testing
export interface LogoPreset {
  id: string;
  name: string;
  clinicSuggestedName: string;
  category: string;
  svgDataUrl: string;
  palette: BrandPalette;
}

export const SAMPLE_LOGOS: LogoPreset[] = [
  {
    id: 'nordic_blue',
    name: 'Nordic Cross & Shield',
    clinicSuggestedName: 'Addis St. Gabriel Medical Center',
    category: 'General Clinic',
    svgDataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <rect width="120" height="120" rx="24" fill="#0369A1"/>
        <path d="M60 22 C38 22 28 36 28 58 C28 88 60 102 60 102 C60 102 92 88 92 58 C92 36 82 22 60 22 Z" fill="#0284C7" stroke="#38BDF8" stroke-width="3"/>
        <path d="M52 44 H68 V54 H78 V68 H68 V78 H52 V68 H42 V54 H52 Z" fill="#FFFFFF"/>
        <circle cx="60" cy="61" r="3" fill="#0284C7"/>
      </svg>
    `),
    palette: {
      primary: '#0369A1',
      secondary: '#0284C7',
      accent: '#38BDF8',
      neutralBg: '#F0F9FF',
      primaryText: '#FFFFFF',
      primaryLight: 'rgba(3, 105, 161, 0.08)',
      primaryBorder: 'rgba(3, 105, 161, 0.25)',
      isAutoDetected: true,
    },
  },
  {
    id: 'emerald_health',
    name: 'Botanical Cross Emerald',
    clinicSuggestedName: 'Horizon Family Health & Wellness',
    category: 'Specialist Clinic',
    svgDataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <rect width="120" height="120" rx="24" fill="#065F46"/>
        <circle cx="60" cy="60" r="38" fill="#047857" stroke="#34D399" stroke-width="2"/>
        <path d="M60 36 V84 M36 60 H84" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="5" fill="#10B981"/>
        <circle cx="78" cy="42" r="5" fill="#6EE7B7"/>
      </svg>
    `),
    palette: {
      primary: '#065F46',
      secondary: '#059669',
      accent: '#34D399',
      neutralBg: '#ECFDF5',
      primaryText: '#FFFFFF',
      primaryLight: 'rgba(6, 95, 70, 0.08)',
      primaryBorder: 'rgba(6, 95, 70, 0.25)',
      isAutoDetected: true,
    },
  },
  {
    id: 'indigo_specialty',
    name: 'Caduceus Indigo Modern',
    clinicSuggestedName: 'Apex Diagnostic & Specialist Clinic',
    category: 'Diagnostic Center',
    svgDataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <rect width="120" height="120" rx="24" fill="#312E81"/>
        <circle cx="60" cy="60" r="40" fill="#4338CA"/>
        <path d="M46 50 C46 38 74 38 74 50 C74 62 46 64 46 76 C46 88 74 88 74 76" fill="none" stroke="#A5B4FC" stroke-width="6" stroke-linecap="round"/>
        <circle cx="60" cy="36" r="6" fill="#818CF8"/>
        <line x1="60" y1="36" x2="60" y2="88" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
      </svg>
    `),
    palette: {
      primary: '#312E81',
      secondary: '#4338CA',
      accent: '#818CF8',
      neutralBg: '#EEF2FF',
      primaryText: '#FFFFFF',
      primaryLight: 'rgba(49, 46, 129, 0.08)',
      primaryBorder: 'rgba(49, 46, 129, 0.25)',
      isAutoDetected: true,
    },
  },
  {
    id: 'coral_care',
    name: 'Warm Rose Care Pulse',
    clinicSuggestedName: 'Bloom Women & Children Health Center',
    category: "Women's Health",
    svgDataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <rect width="120" height="120" rx="24" fill="#9F1239"/>
        <circle cx="60" cy="60" r="40" fill="#BE123C"/>
        <path d="M60 40 C52 28 32 34 32 50 C32 68 60 84 60 84 C60 84 88 68 88 50 C88 34 68 28 60 40 Z" fill="#FDA4AF"/>
        <path d="M46 56 H54 L58 50 L63 64 L67 56 H74" fill="none" stroke="#9F1239" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
    palette: {
      primary: '#9F1239',
      secondary: '#BE123C',
      accent: '#F43F5E',
      neutralBg: '#FFF1F2',
      primaryText: '#FFFFFF',
      primaryLight: 'rgba(159, 18, 57, 0.08)',
      primaryBorder: 'rgba(159, 18, 57, 0.25)',
      isAutoDetected: true,
    },
  },
  {
    id: 'teal_dental',
    name: 'Precision Teal Crest',
    clinicSuggestedName: 'Precision Dental & Orthodontic Care',
    category: 'Dental Clinic',
    svgDataUrl:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <rect width="120" height="120" rx="24" fill="#115E59"/>
        <circle cx="60" cy="60" r="38" fill="#0F766E"/>
        <path d="M45 42 C48 34 72 34 75 42 C78 52 74 68 70 82 C68 88 62 88 60 80 C58 88 52 88 50 82 C46 68 42 52 45 42 Z" fill="#FFFFFF"/>
        <circle cx="60" cy="56" r="6" fill="#2DD4BF"/>
      </svg>
    `),
    palette: {
      primary: '#115E59',
      secondary: '#0F766E',
      accent: '#2DD4BF',
      neutralBg: '#F0FDFA',
      primaryText: '#FFFFFF',
      primaryLight: 'rgba(17, 94, 89, 0.08)',
      primaryBorder: 'rgba(17, 94, 89, 0.25)',
      isAutoDetected: true,
    },
  },
];
