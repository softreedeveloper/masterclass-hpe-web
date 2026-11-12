// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
   output: "static",
   trailingSlash: "ignore",
   // El panel admin sólo consulta registros: Resumen y Clases se retiraron (2026-11-12).
   redirects: {
      "/admin": "/admin/participantes",
      "/admin/clases": "/admin/participantes",
   },
   integrations: [react()],
   vite: { plugins: [tailwindcss()] },
      server: {
      // host: '192.168.3.143', //'192.168.3.143', // host: true,
      port: 7002,
      // Sin "headers" acá: las cabeceras de seguridad las pone
      // src/middleware.ts también en dev (ver src/utils/securityHeaders.ts).
   },
});
