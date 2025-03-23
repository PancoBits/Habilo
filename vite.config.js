import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      includeAssets: ["img/assets/*", "favicon.svg", "assets/*.otf"],
      workbox: {
        globPatterns: [
          "**/*.{js,css,html}",
          "img/assets/*",
          "icons/*",
          "assets/*.otf",
        ],
        globIgnores: ["**/node_modules/**"],
      },
    }),
  ],
});
