import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("recharts") || id.includes("victory-vendor")) {
            return "charts";
          }

          if (id.includes("@supabase")) {
            return "supabase";
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          if (
            id.includes("@radix-ui") ||
            id.includes("cmdk") ||
            id.includes("embla-carousel") ||
            id.includes("vaul")
          ) {
            return "ui-vendor";
          }

          if (id.includes("@tanstack")) {
            return "react-query";
          }

          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (id.includes("react-day-picker") || id.includes("date-fns")) {
            return "date";
          }

          return "vendor";
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
