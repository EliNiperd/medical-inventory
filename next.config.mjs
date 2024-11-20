// next.config.mjs
import withPWA from "next-pwa";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  // Configuración específica para Vercel
  output: "standalone",

  // Otras configuraciones que puedas tener
  images: {
    domains: [], // Añade tus dominios si usas next/image
    unoptimized: process.env.NODE_ENV === "development",
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // Cambiamos a false para habilitar en desarrollo
  // Configuración específica para PWA
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 24 horas
        },
      },
    },
  ],
});

export default withPWAConfig(nextConfig);
