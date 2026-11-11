// Tema claro/oscuro. El script anti-parpadeo de BaseLayout aplica el inicial antes de pintar;
// aquí se alterna y se guarda la elección (sin elección, se sigue al sistema).
export type Tema = "light" | "dark";

export const temaActual = (): Tema => (document.documentElement.classList.contains("dark") ? "dark" : "light");

const aplicar = (tema: Tema) => {
   document.documentElement.classList.toggle("dark", tema === "dark");
   document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema === "dark" ? "#0a0d11" : "#ffffff");
   window.dispatchEvent(new CustomEvent("tema", { detail: tema }));
};

// Revelado circular desde el botón con View Transitions; sin soporte o con movimiento reducido, cambio directo.
export function alternarTema(origen?: { x: number; y: number }) {
   const nuevo: Tema = temaActual() === "dark" ? "light" : "dark";
   try {
      localStorage.setItem("theme", nuevo);
   } catch {}
   const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
   if (!doc.startViewTransition || reducido || !origen) return aplicar(nuevo);
   const radio = Math.hypot(Math.max(origen.x, innerWidth - origen.x), Math.max(origen.y, innerHeight - origen.y));
   doc.startViewTransition(() => aplicar(nuevo)).ready.then(() => {
      document.documentElement.animate(
         { clipPath: [`circle(0px at ${origen.x}px ${origen.y}px)`, `circle(${radio}px at ${origen.x}px ${origen.y}px)`] },
         { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
   });
}
