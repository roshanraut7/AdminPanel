export type AdminThemeMode = "light" | "dark";

export type AdminThemePalette = {
  background: string;
  foreground: string;

  card: string;
  cardForeground: string;

  popover: string;
  popoverForeground: string;

  primary: string;
  primaryForeground: string;

  secondary: string;
  secondaryForeground: string;

  muted: string;
  mutedForeground: string;

  accent: string;
  accentForeground: string;

  destructive: string;

  border: string;
  input: string;
  ring: string;

  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;

  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type AdminThemeConfig = {
  presetId: string;
  light: AdminThemePalette;
  dark: AdminThemePalette;
};

export const defaultAdminTheme: AdminThemeConfig = {
  presetId: "teal",
  light: {
    background: "#fbfcfc",
    foreground: "#052e2f",

    card: "#ffffff",
    cardForeground: "#052e2f",

    popover: "#ffffff",
    popoverForeground: "#052e2f",

    primary: "#055b65",
    primaryForeground: "#ffffff",

    secondary: "#f6faf9",
    secondaryForeground: "#052e2f",

    muted: "#f3f7f6",
    mutedForeground: "#667085",

    accent: "#e8f8f2",
    accentForeground: "#055b65",

    destructive: "#dc2626",

    border: "#dce7e4",
    input: "#dce7e4",
    ring: "#1bd488",

    chart1: "#055b65",
    chart2: "#45828b",
    chart3: "#1bd488",
    chart4: "#b2c9c5",
    chart5: "#e0e5e9",

    sidebar: "#ffffff",
    sidebarForeground: "#052e2f",
    sidebarPrimary: "#055b65",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent: "#e8f8f2",
    sidebarAccentForeground: "#055b65",
    sidebarBorder: "#dce7e4",
    sidebarRing: "#1bd488",
  },
  dark: {
    background: "#061112",
    foreground: "#f8fafc",

    card: "#0b1718",
    cardForeground: "#f8fafc",

    popover: "#0b1718",
    popoverForeground: "#f8fafc",

    primary: "#1bd488",
    primaryForeground: "#031314",

    secondary: "#102022",
    secondaryForeground: "#f8fafc",

    muted: "#102022",
    mutedForeground: "#a7b6b8",

    accent: "#123235",
    accentForeground: "#d9fff0",

    destructive: "#ef4444",

    border: "#1d3436",
    input: "#1d3436",
    ring: "#1bd488",

    chart1: "#1bd488",
    chart2: "#4ee6a6",
    chart3: "#45828b",
    chart4: "#b2c9c5",
    chart5: "#e0e5e9",

    sidebar: "#0b1718",
    sidebarForeground: "#f8fafc",
    sidebarPrimary: "#1bd488",
    sidebarPrimaryForeground: "#031314",
    sidebarAccent: "#123235",
    sidebarAccentForeground: "#d9fff0",
    sidebarBorder: "#1d3436",
    sidebarRing: "#1bd488",
  },
};

export const adminThemePresets: {
  id: string;
  name: string;
  description: string;
  light: AdminThemePalette;
  dark: AdminThemePalette;
}[] = [
  {
    id: "teal",
    name: "Teal Green",
    description: "Clean teal and green dashboard theme",
    light: defaultAdminTheme.light,
    dark: defaultAdminTheme.dark,
  },
  {
    id: "blue",
    name: "Ocean Blue",
    description: "Professional blue admin dashboard theme",
    light: {
      ...defaultAdminTheme.light,
      background: "#f8fafc",
      foreground: "#0f172a",
      card: "#ffffff",
      cardForeground: "#0f172a",
      popover: "#ffffff",
      popoverForeground: "#0f172a",
      primary: "#2563eb",
      primaryForeground: "#ffffff",
      secondary: "#eff6ff",
      secondaryForeground: "#1e3a8a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      accent: "#dbeafe",
      accentForeground: "#1d4ed8",
      border: "#dbeafe",
      input: "#dbeafe",
      ring: "#3b82f6",
      chart1: "#2563eb",
      chart2: "#1d4ed8",
      chart3: "#3b82f6",
      chart4: "#93c5fd",
      chart5: "#dbeafe",
      sidebarPrimary: "#2563eb",
      sidebarAccent: "#dbeafe",
      sidebarAccentForeground: "#1d4ed8",
      sidebarBorder: "#dbeafe",
      sidebarRing: "#3b82f6",
    },
    dark: {
      ...defaultAdminTheme.dark,
      background: "#020617",
      foreground: "#f8fafc",
      card: "#0f172a",
      cardForeground: "#f8fafc",
      popover: "#0f172a",
      popoverForeground: "#f8fafc",
      primary: "#60a5fa",
      primaryForeground: "#020617",
      secondary: "#172554",
      secondaryForeground: "#dbeafe",
      muted: "#111827",
      mutedForeground: "#94a3b8",
      accent: "#172554",
      accentForeground: "#dbeafe",
      border: "#1e3a8a",
      input: "#1e3a8a",
      ring: "#60a5fa",
      chart1: "#60a5fa",
      chart2: "#3b82f6",
      chart3: "#93c5fd",
      chart4: "#1d4ed8",
      chart5: "#172554",
      sidebar: "#0f172a",
      sidebarPrimary: "#60a5fa",
      sidebarPrimaryForeground: "#020617",
      sidebarAccent: "#172554",
      sidebarAccentForeground: "#dbeafe",
      sidebarBorder: "#1e3a8a",
      sidebarRing: "#60a5fa",
    },
  },
  {
    id: "purple",
    name: "Royal Purple",
    description: "Modern purple admin dashboard theme",
    light: {
      ...defaultAdminTheme.light,
      background: "#faf9ff",
      foreground: "#1e1b4b",
      card: "#ffffff",
      cardForeground: "#1e1b4b",
      popover: "#ffffff",
      popoverForeground: "#1e1b4b",
      primary: "#6d28d9",
      primaryForeground: "#ffffff",
      secondary: "#f5f3ff",
      secondaryForeground: "#4c1d95",
      muted: "#f5f3ff",
      mutedForeground: "#6b7280",
      accent: "#ede9fe",
      accentForeground: "#5b21b6",
      border: "#ddd6fe",
      input: "#ddd6fe",
      ring: "#8b5cf6",
      chart1: "#6d28d9",
      chart2: "#7c3aed",
      chart3: "#8b5cf6",
      chart4: "#c4b5fd",
      chart5: "#ede9fe",
      sidebarPrimary: "#6d28d9",
      sidebarAccent: "#ede9fe",
      sidebarAccentForeground: "#5b21b6",
      sidebarBorder: "#ddd6fe",
      sidebarRing: "#8b5cf6",
    },
    dark: {
      ...defaultAdminTheme.dark,
      background: "#0f0a1f",
      foreground: "#faf5ff",
      card: "#181028",
      cardForeground: "#faf5ff",
      popover: "#181028",
      popoverForeground: "#faf5ff",
      primary: "#c084fc",
      primaryForeground: "#1e102f",
      secondary: "#2e1065",
      secondaryForeground: "#f3e8ff",
      muted: "#24113f",
      mutedForeground: "#c4b5fd",
      accent: "#2e1065",
      accentForeground: "#f3e8ff",
      border: "#4c1d95",
      input: "#4c1d95",
      ring: "#c084fc",
      chart1: "#c084fc",
      chart2: "#a855f7",
      chart3: "#8b5cf6",
      chart4: "#6d28d9",
      chart5: "#2e1065",
      sidebar: "#181028",
      sidebarPrimary: "#c084fc",
      sidebarPrimaryForeground: "#1e102f",
      sidebarAccent: "#2e1065",
      sidebarAccentForeground: "#f3e8ff",
      sidebarBorder: "#4c1d95",
      sidebarRing: "#c084fc",
    },
  },
  {
    id: "orange",
    name: "Sunset Orange",
    description: "Warm orange dashboard theme",
    light: {
      ...defaultAdminTheme.light,
      background: "#fffaf5",
      foreground: "#431407",
      card: "#ffffff",
      cardForeground: "#431407",
      popover: "#ffffff",
      popoverForeground: "#431407",
      primary: "#ea580c",
      primaryForeground: "#ffffff",
      secondary: "#fff7ed",
      secondaryForeground: "#7c2d12",
      muted: "#fff7ed",
      mutedForeground: "#78716c",
      accent: "#ffedd5",
      accentForeground: "#c2410c",
      border: "#fed7aa",
      input: "#fed7aa",
      ring: "#f97316",
      chart1: "#ea580c",
      chart2: "#f97316",
      chart3: "#fb923c",
      chart4: "#fdba74",
      chart5: "#ffedd5",
      sidebarPrimary: "#ea580c",
      sidebarAccent: "#ffedd5",
      sidebarAccentForeground: "#c2410c",
      sidebarBorder: "#fed7aa",
      sidebarRing: "#f97316",
    },
    dark: {
      ...defaultAdminTheme.dark,
      background: "#140c05",
      foreground: "#fff7ed",
      card: "#1c1208",
      cardForeground: "#fff7ed",
      popover: "#1c1208",
      popoverForeground: "#fff7ed",
      primary: "#fb923c",
      primaryForeground: "#1c1208",
      secondary: "#431407",
      secondaryForeground: "#ffedd5",
      muted: "#2f1608",
      mutedForeground: "#fdba74",
      accent: "#431407",
      accentForeground: "#ffedd5",
      border: "#7c2d12",
      input: "#7c2d12",
      ring: "#fb923c",
      chart1: "#fb923c",
      chart2: "#f97316",
      chart3: "#fdba74",
      chart4: "#ea580c",
      chart5: "#431407",
      sidebar: "#1c1208",
      sidebarPrimary: "#fb923c",
      sidebarPrimaryForeground: "#1c1208",
      sidebarAccent: "#431407",
      sidebarAccentForeground: "#ffedd5",
      sidebarBorder: "#7c2d12",
      sidebarRing: "#fb923c",
    },
  },
];

function getCurrentMode(): AdminThemeMode {
  if (typeof document === "undefined") return "light";

  return document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
}

function setCssVariable(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

export function applyAdminTheme(
  themeConfig: AdminThemeConfig,
  mode: AdminThemeMode = getCurrentMode(),
) {
  const palette = themeConfig[mode];

  setCssVariable("--background", palette.background);
  setCssVariable("--foreground", palette.foreground);

  setCssVariable("--card", palette.card);
  setCssVariable("--card-foreground", palette.cardForeground);

  setCssVariable("--popover", palette.popover);
  setCssVariable("--popover-foreground", palette.popoverForeground);

  setCssVariable("--primary", palette.primary);
  setCssVariable("--primary-foreground", palette.primaryForeground);

  setCssVariable("--secondary", palette.secondary);
  setCssVariable("--secondary-foreground", palette.secondaryForeground);

  setCssVariable("--muted", palette.muted);
  setCssVariable("--muted-foreground", palette.mutedForeground);

  setCssVariable("--accent", palette.accent);
  setCssVariable("--accent-foreground", palette.accentForeground);

  setCssVariable("--destructive", palette.destructive);

  setCssVariable("--border", palette.border);
  setCssVariable("--input", palette.input);
  setCssVariable("--ring", palette.ring);

  setCssVariable("--chart-1", palette.chart1);
  setCssVariable("--chart-2", palette.chart2);
  setCssVariable("--chart-3", palette.chart3);
  setCssVariable("--chart-4", palette.chart4);
  setCssVariable("--chart-5", palette.chart5);

  setCssVariable("--sidebar", palette.sidebar);
  setCssVariable("--sidebar-foreground", palette.sidebarForeground);
  setCssVariable("--sidebar-primary", palette.sidebarPrimary);
  setCssVariable(
    "--sidebar-primary-foreground",
    palette.sidebarPrimaryForeground,
  );
  setCssVariable("--sidebar-accent", palette.sidebarAccent);
  setCssVariable(
    "--sidebar-accent-foreground",
    palette.sidebarAccentForeground,
  );
  setCssVariable("--sidebar-border", palette.sidebarBorder);
  setCssVariable("--sidebar-ring", palette.sidebarRing);
}

export function getPresetTheme(presetId: string): AdminThemeConfig | null {
  const preset = adminThemePresets.find((item) => item.id === presetId);

  if (!preset) return null;

  return {
    presetId: preset.id,
    light: preset.light,
    dark: preset.dark,
  };
}

export function saveAdminTheme(themeConfig: AdminThemeConfig) {
  localStorage.setItem("admin-theme-config", JSON.stringify(themeConfig));
  applyAdminTheme(themeConfig);
}

export function loadAdminTheme() {
  const storedTheme = localStorage.getItem("admin-theme-config");

  if (!storedTheme) return null;

  try {
    const parsed = JSON.parse(storedTheme) as AdminThemeConfig;

    if (!parsed.light || !parsed.dark) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function resetAdminTheme() {
  localStorage.removeItem("admin-theme-config");
  applyAdminTheme(defaultAdminTheme);
}

function getReadableTextColor(hex: string) {
  const cleanHex = hex.replace("#", "");

  if (cleanHex.length !== 6) return "#ffffff";

  const red = Number.parseInt(cleanHex.slice(0, 2), 16);
  const green = Number.parseInt(cleanHex.slice(2, 4), 16);
  const blue = Number.parseInt(cleanHex.slice(4, 6), 16);

  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 150 ? "#031314" : "#ffffff";
}

export function updateAdminThemeColor({
  themeConfig,
  mode,
  key,
  value,
}: {
  themeConfig: AdminThemeConfig;
  mode: AdminThemeMode;
  key: keyof AdminThemePalette;
  value: string;
}): AdminThemeConfig {
  const updatedPalette: AdminThemePalette = {
    ...themeConfig[mode],
    [key]: value,
  };

  if (key === "primary") {
    updatedPalette.primaryForeground = getReadableTextColor(value);
    updatedPalette.sidebarPrimary = value;
    updatedPalette.sidebarPrimaryForeground = getReadableTextColor(value);
    updatedPalette.chart1 = value;
  }

  if (key === "accent") {
    updatedPalette.accentForeground = getReadableTextColor(value);
    updatedPalette.sidebarAccent = value;
    updatedPalette.sidebarAccentForeground = getReadableTextColor(value);
  }

  if (key === "background") {
    updatedPalette.foreground = getReadableTextColor(value);
  }

  if (key === "card") {
    updatedPalette.cardForeground = getReadableTextColor(value);
    updatedPalette.popover = value;
    updatedPalette.popoverForeground = getReadableTextColor(value);
  }

  if (key === "border") {
    updatedPalette.input = value;
    updatedPalette.sidebarBorder = value;
  }

  if (key === "ring") {
    updatedPalette.sidebarRing = value;
    updatedPalette.chart3 = value;
  }

  return {
    ...themeConfig,
    presetId: "custom",
    [mode]: updatedPalette,
  };
}