import { useEffect, useState } from "react";

// Número que cuenta desde 0 al montar (respeta movimiento reducido).
export function Contador({ valor, ms = 1100 }: { valor: number; ms?: number }) {
   const [v, setV] = useState(valor);
   useEffect(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !valor) return setV(valor);
      let raf = 0;
      const t0 = performance.now();
      const paso = (t: number) => {
         const p = Math.min(1, (t - t0) / ms);
         setV(Math.round(valor * (1 - Math.pow(1 - p, 4))));
         if (p < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
      return () => cancelAnimationFrame(raf);
   }, [valor, ms]);
   return <>{v.toLocaleString("es-MX")}</>;
}
