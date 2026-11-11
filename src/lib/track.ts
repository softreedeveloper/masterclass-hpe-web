// Medición: empuja eventos a window.dataLayer (lo consume GTM si PUBLIC_GTM_ID está configurado).
// Sin GTM los eventos se acumulan en el arreglo y no se envían a ningún lado. Nunca enviar datos personales.
type Params = Record<string, string | number | boolean | undefined>;

declare global {
   interface Window {
      dataLayer?: Record<string, unknown>[];
   }
}

export function track(event: "cta_click" | "form_start" | "form_error" | "form_submit", params: Params = {}) {
   if (typeof window === "undefined") return;
   (window.dataLayer ??= []).push({ event, ...params });
}
