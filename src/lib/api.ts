// Cliente de la API. La sesión viaja en una cookie httpOnly: siempre credentials "include".
export const API_URL = (import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
   constructor(
      message: string,
      public status: number,
      public detalle?: string,
   ) {
      super(message);
   }
}

type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function api<T = unknown>(ruta: string, metodo: Metodo = "GET", body?: unknown): Promise<T> {
   let res: Response;
   try {
      res = await fetch(`${API_URL}${ruta}`, {
         method: metodo,
         credentials: "include",
         headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
         body: body !== undefined ? JSON.stringify(body) : undefined,
      });
   } catch {
      throw new ApiError("No se pudo conectar con el servidor", 0);
   }
   const json = await res.json().catch(() => null);
   if (!res.ok || !json?.success) {
      throw new ApiError(json?.message || "Error inesperado", res.status, json?.detalle);
   }
   return json.data as T;
}

export const mensajeError = (e: unknown) =>
   e instanceof ApiError ? (e.detalle ? `${e.message}: ${e.detalle}` : e.message) : "Error inesperado";

export const qs = (params: Record<string, string | number | boolean | undefined | null>) => {
   const p = new URLSearchParams();
   for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
   const s = p.toString();
   return s ? `?${s}` : "";
};

// Descarga un archivo autenticado (export Excel/CSV).
export async function descargar(ruta: string) {
   const res = await fetch(`${API_URL}${ruta}`, { credentials: "include" });
   if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new ApiError(json?.message || "No se pudo exportar", res.status);
   }
   const nombre = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") || "")?.[1] || "export";
   const url = URL.createObjectURL(await res.blob());
   const a = Object.assign(document.createElement("a"), { href: url, download: nombre });
   document.body.appendChild(a);
   a.click();
   a.remove();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
}
