import Script from "next/script";

type ThemeScriptProps = {
  attribute?: "class" | `data-${string}`;
  defaultTheme?: "light" | "dark" | "system";
  enableColorScheme?: boolean;
  enableSystem?: boolean;
  storageKey?: string;
};

export function ThemeScript({
  attribute = "class",
  defaultTheme = "light",
  enableColorScheme = true,
  enableSystem = true,
  storageKey = "theme",
}: ThemeScriptProps) {
  const script = `
    (function() {
      try {
        var attribute = ${JSON.stringify(attribute)};
        var defaultTheme = ${JSON.stringify(defaultTheme)};
        var enableColorScheme = ${JSON.stringify(enableColorScheme)};
        var enableSystem = ${JSON.stringify(enableSystem)};
        var storageKey = ${JSON.stringify(storageKey)};
        var root = document.documentElement;
        var theme = localStorage.getItem(storageKey) || defaultTheme;

        if (theme === "system" && enableSystem) {
          theme = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        }

        theme = theme === "dark" ? "dark" : "light";

        if (attribute === "class") {
          root.classList.remove("light", "dark");
          root.classList.add(theme);
        } else {
          root.setAttribute(attribute, theme);
        }

        if (enableColorScheme) {
          root.style.colorScheme = theme;
        }
      } catch (_) {}
    })();
  `;

  return (
    <Script
      id="nexty-theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
