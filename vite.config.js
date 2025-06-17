import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const pwaOptions = {
  registerType: "autoUpdate",
  devOptions: {
    enabled: true,
  },
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    runtimeCaching: [
      {
        handler: "CacheFirst",
        urlPattern: ({ url }) => {
          return url.pathname.startsWith("/");
        },
        options: {
          cacheName: "reward-cache",
        },
      },
    ],
  },
  manifest: {
    name: "Instant Reward App",
    short_name: "My Rewards",
    description:
      "Developed to mimic the leveling system of Solo Leveling Manhwa to motivate myself to do something benefit.",
    theme_color: "#292526",
    background_color: "#292526",
    start_url: "/instant-reward-app/",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(pwaOptions)],
  base: "/instant-reward-app/",
});
