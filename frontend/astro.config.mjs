// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import path from "path";

import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sharedPath = path.resolve(__dirname, "../shared");

// https://astro.build/config
export default defineConfig({
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
