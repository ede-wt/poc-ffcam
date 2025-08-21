import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "generateSW",
      injectRegister: "auto",
      registerType: "autoUpdate",
      manifest: {
        name: "ffcam",
        short_name: "ffcam",
        description: "ffcam",
        theme_color: "#ffffff",
      },
      workbox: {
        globPatterns: ["**/*"],
        // cleanupOutdatedCaches: true,
        // clientsClaim: true,
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            urlPattern: "/",
            handler: "NetworkFirst",
          },
        ],
      },
      includeAssets: ["**/*"],
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
    }),
  ],
});
