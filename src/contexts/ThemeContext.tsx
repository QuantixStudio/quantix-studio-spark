import { createContext, useContext, useEffect } from "react";

type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Force dark mode globally
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  }, []);

  // Keep context for backwards compatibility but always return dark mode
  const toggleTheme = () => {
    // No-op: dark mode is forced
  };

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
