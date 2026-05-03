"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  forcedTheme?: string;
  resolvedTheme?: ResolvedTheme;
  setTheme: Dispatch<SetStateAction<string>>;
  systemTheme?: ResolvedTheme;
  theme?: string;
  themes: string[];
};

type ThemeProviderProps = {
  attribute?: "class" | `data-${string}`;
  children: ReactNode;
  defaultTheme?: Theme;
  enableColorScheme?: boolean;
  enableSystem?: boolean;
  storageKey?: string;
  themes?: Theme[];
};

const DEFAULT_THEMES: Theme[] = ["light", "dark"];
const MEDIA = "(prefers-color-scheme: dark)";

const ThemeContext = createContext<ThemeContextValue>({
  setTheme: () => {},
  themes: [],
});

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function resolveTheme(theme: string | undefined, enableSystem: boolean) {
  if (theme === "system" && enableSystem) return getSystemTheme();
  return theme === "dark" ? "dark" : "light";
}

function applyTheme({
  attribute,
  enableColorScheme,
  enableSystem,
  theme,
  themes,
}: {
  attribute: "class" | `data-${string}`;
  enableColorScheme: boolean;
  enableSystem: boolean;
  theme: string | undefined;
  themes: Theme[];
}) {
  const resolvedTheme = resolveTheme(theme, enableSystem);
  const root = document.documentElement;

  if (attribute === "class") {
    root.classList.remove(...themes.filter((item) => item !== "system"));
    root.classList.add(resolvedTheme);
  } else {
    root.setAttribute(attribute, resolvedTheme);
  }

  if (enableColorScheme) {
    root.style.colorScheme = resolvedTheme;
  }
}

export function ThemeProvider({
  attribute = "class",
  children,
  defaultTheme = "light",
  enableColorScheme = true,
  enableSystem = true,
  storageKey = "theme",
  themes = DEFAULT_THEMES,
}: ThemeProviderProps) {
  const themeOptions = enableSystem ? [...themes, "system"] : themes;
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      setThemeState(storedTheme || defaultTheme);
    } catch {
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    const media = window.matchMedia(MEDIA);
    const updateSystemTheme = () => setSystemTheme(getSystemTheme());

    updateSystemTheme();
    media.addEventListener("change", updateSystemTheme);

    return () => media.removeEventListener("change", updateSystemTheme);
  }, []);

  useEffect(() => {
    applyTheme({
      attribute,
      enableColorScheme,
      enableSystem,
      theme,
      themes,
    });
  }, [attribute, enableColorScheme, enableSystem, theme, themes]);

  const setTheme = useCallback<Dispatch<SetStateAction<string>>>(
    (value) => {
      setThemeState((currentTheme) => {
        const nextTheme =
          typeof value === "function" ? value(currentTheme) : value;
        const normalizedTheme = themeOptions.includes(nextTheme as Theme)
          ? (nextTheme as Theme)
          : defaultTheme;

        try {
          localStorage.setItem(storageKey, normalizedTheme);
        } catch {}

        return normalizedTheme;
      });
    },
    [defaultTheme, storageKey, themeOptions]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      resolvedTheme:
        theme === "system" && enableSystem
          ? systemTheme
          : theme === "dark"
            ? "dark"
            : "light",
      setTheme,
      systemTheme,
      theme,
      themes: themeOptions,
    }),
    [enableSystem, setTheme, systemTheme, theme, themeOptions]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
