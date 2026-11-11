// Estado de carga con esqueletos (menos salto visual que un spinner).
export function Spinner({ texto = "Cargando…", filas = 4 }: { texto?: string; filas?: number }) {
   return (
      <div className="space-y-3 py-6" role="status" aria-live="polite">
         <span className="sr-only">{texto}</span>
         <div className="skeleton h-7 w-1/3" />
         {Array.from({ length: filas }, (_, i) => (
            <div key={i} className="skeleton h-14 w-full" style={{ opacity: 1 - i * 0.18 }} />
         ))}
      </div>
   );
}
