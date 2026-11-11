import { useEffect, useState } from "react";
import { api, ApiError } from "./api";
import type { Rol, Usuario } from "./types";

// Protección de rutas en el cliente (UX). La autorización real la aplica el backend en cada endpoint.
export function useSesion(rol?: Rol) {
   const [usuario, setUsuario] = useState<Usuario | null>(null);
   const [cargando, setCargando] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      api<Usuario>("/auth/me")
         .then((u) => {
            if (rol && u.rol !== rol) {
               window.location.replace(u.rol === "ADMIN" ? "/admin" : "/cuenta");
               return;
            }
            setUsuario(u);
            setCargando(false);
         })
         .catch((e) => {
            if (e instanceof ApiError && e.status === 401) {
               const volver = encodeURIComponent(window.location.pathname + window.location.search);
               window.location.replace(`/es/login?next=${volver}`);
               return;
            }
            setError(e instanceof ApiError ? e.message : "Error inesperado");
            setCargando(false);
         });
   }, [rol]);

   return { usuario, setUsuario, cargando, error };
}

export async function cerrarSesion() {
   try {
      await api("/auth/logout", "POST");
   } finally {
      window.location.replace("/es/login");
   }
}

// Sólo rutas internas: evita redirecciones abiertas con ?next=https://otro-sitio.
export const destinoSeguro = (next: string | null, rol: Rol) =>
   next && /^\/(?!\/)[\w\-/?=&%.]*$/.test(next) && !next.startsWith("/es/login") && !next.startsWith("/en/login")
      ? next
      : rol === "ADMIN"
        ? "/admin"
        : "/cuenta";
