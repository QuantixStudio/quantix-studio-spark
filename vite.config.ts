import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function resolveLocalHost(rawHost: string | undefined) {
  if (!rawHost) {
    return "127.0.0.1";
  }

  const normalized = rawHost.trim().toLowerCase();

  // Prefer a loopback default so local browser checks work consistently and
  // dev startup does not depend on external bind permissions.
  if (normalized === "0.0.0.0" || normalized === "::" || normalized === "::1") {
    return "127.0.0.1";
  }

  return rawHost;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.PORT || env.VITE_PORT || 3000);
  const host = resolveLocalHost(env.HOST || env.VITE_DEV_HOST);

  return {
    server: {
      host,
      port,
      strictPort: true,
      open: true,
    },
    preview: {
      host,
      port,
      strictPort: true,
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

            const normalizedId = id.split(path.sep).join("/");

            if (
              id.includes("@radix-ui") ||
              id.includes("cmdk") ||
              id.includes("embla-carousel") ||
              normalizedId.includes("/node_modules/vaul/")
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
  };
});
