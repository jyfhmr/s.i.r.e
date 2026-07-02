// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import path from "path";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sharedPath = path.resolve(__dirname, "../shared");

// https://astro.build/config
export default defineConfig({
  site: "https://sire.gopharma.com.ve",
  // Mantener las URLs SIN barra final para que coincidan con las rutas
  // guardadas en la base de datos (p. ej. "/dashboard/medical/patients").
  // Evita el bucle de redirección en producción cuando el hosting agrega "/".
  trailingSlash: "never",
  build: {
    // Genera "/dashboard/medical/patients.html" en vez de
    // "/dashboard/medical/patients/index.html" (URLs sin barra final).
    format: "file",
  },
  server: {
    port: 5173, // Alinear con URL_FRONTEND del backend para evitar problemas de CORS
  },
  integrations: [
    sitemap({
      filter: (page) => {
        // Excluir el dashboard y las páginas privadas o de flujo de sesión
        const excludedPaths = [
          "/dashboard",
          "/forgot-password",
          "/reset-password",
          "/sire-admin-portal",
          "/404"
        ];
        return !excludedPaths.some((exPath) => page.includes(exPath));
      }
    })
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: "@shared",
          replacement: sharedPath,
        },
      ],
    },
    server: {
      fs: {
        allow: [sharedPath, path.resolve(__dirname, "..")],
      },
    },
  },
});
