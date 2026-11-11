import type { ReactNode } from "react";

const tonos = {
   green: ["bg-hpe-light text-hpe-deep", "bg-hpe"],
   gray: ["bg-surface text-ink-soft", "bg-muted"],
   red: ["bg-danger-tint text-danger", "bg-danger"],
   amber: ["bg-warning-tint text-warning", "bg-warning"],
};

export function Badge({ tono = "gray", children }: { tono?: keyof typeof tonos; children: ReactNode }) {
   const [caja, punto] = tonos[tono];
   return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${caja}`}>
         <span className={`size-1.5 rounded-full ${punto}`} aria-hidden="true" />
         {children}
      </span>
   );
}
