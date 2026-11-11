import { useEffect, useRef, type ReactNode } from "react";

interface Props {
   abierto: boolean;
   titulo: string;
   onClose: () => void;
   children: ReactNode;
   ancho?: string;
}

// <dialog> nativo: foco atrapado, Esc y backdrop sin librerías.
export function Modal({ abierto, titulo, onClose, children, ancho = "max-w-lg" }: Props) {
   const ref = useRef<HTMLDialogElement>(null);
   useEffect(() => {
      const d = ref.current;
      if (!d) return;
      if (abierto && !d.open) d.showModal();
      if (!abierto && d.open) d.close();
   }, [abierto]);
   return (
      <dialog
         ref={ref}
         onClose={onClose}
         onClick={(e) => e.target === ref.current && onClose()}
         className={`m-auto w-[calc(100%-2rem)] ${ancho} rounded-3xl border border-line bg-card p-0 text-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)]`}
      >
         <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <h2 className="text-lg font-medium">{titulo}</h2>
            <button onClick={onClose} className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink" aria-label="Cerrar">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
               </svg>
            </button>
         </div>
         <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{abierto && children}</div>
      </dialog>
   );
}
