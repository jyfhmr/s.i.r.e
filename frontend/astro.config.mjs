// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "url";
import path from "path";

import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sharedPath = path.resolve(__dirname, "../shared");

// https://astro.build/config
export default defineConfig({
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
