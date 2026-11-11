import type { ReactNode } from "react";

const estilos = {
   error: "bg-danger-tint text-danger",
   success: "bg-hpe-light text-hpe-deep",
   info: "bg-surface text-ink-soft",
};

export function Alert({ tipo = "info", children }: { tipo?: keyof typeof estilos; children: ReactNode }) {
   return (
      <div
         role={tipo === "error" ? "alert" : "status"}
         className={`animate-[fade-up_.4s_cubic-bezier(.16,1,.3,1)] rounded-xl px-4 py-3 text-sm ${estilos[tipo]}`}
      >
         {children}
      </div>
   );
}
