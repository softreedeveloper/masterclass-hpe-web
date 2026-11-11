import { useEffect, useState } from "react";
import { alternarTema, temaActual, type Tema } from "../../lib/tema";

// Versión React del botón de tema para el header de cuenta/admin.
export function ThemeToggleButton() {
   const [tema, setTema] = useState<Tema>("light");
   useEffect(() => {
      setTema(temaActual());
      const oir = (e: Event) => setTema((e as CustomEvent<Tema>).detail);
      window.addEventListener("tema", oir);
      return () => window.removeEventListener("tema", oir);
   }, []);
   const oscuro = tema === "dark";
   const curva = "transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]";
   return (
      <button
         type="button"
         onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            alternarTema({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
         }}
         className="relative grid size-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
         aria-label={oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
         title="Cambiar tema"
      >
         <svg
            className={`absolute size-[18px] ${curva} ${oscuro ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
         >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
         </svg>
         <svg
            className={`absolute size-[18px] ${curva} ${oscuro ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
         >
            <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
         </svg>
      </button>
   );
}
