import { useEffect, useRef, useState } from "react";
import { quiz } from "../../data/quiz";
import { useT, type Lang } from "../../i18n/ui";

// Demo informativa: corre sólo en el navegador y no guarda resultados. No cuenta para la acreditación.
export default function Simulador({ lang }: { lang: Lang }) {
   const t = useT(lang);
   const preguntas = quiz[lang];
   const total = preguntas.length;
   const [idx, setIdx] = useState(0);
   const [elegida, setElegida] = useState<number | null>(null);
   const [aciertos, setAciertos] = useState(0);
   const [fin, setFin] = useState(false);
   const [interactuado, setInteractuado] = useState(false);
   const titulo = useRef<HTMLHeadingElement>(null);
   const q = preguntas[idx];

   // Al avanzar, reiniciar o terminar, el foco va al nuevo encabezado (teclado y lector de pantalla).
   useEffect(() => {
      if (interactuado) titulo.current?.focus();
   }, [idx, fin, interactuado]);

   const elegir = (i: number) => {
      if (elegida !== null) return;
      setElegida(i);
      if (q.options[i].correct) setAciertos((a) => a + 1);
   };
   const siguiente = () => {
      setInteractuado(true);
      if (idx + 1 >= total) return setFin(true);
      setIdx(idx + 1);
      setElegida(null);
   };
   const reiniciar = () => {
      setInteractuado(true);
      setIdx(0);
      setElegida(null);
      setAciertos(0);
      setFin(false);
   };

   if (fin) {
      const pct = Math.round((aciertos / total) * 100);
      const aprobado = pct >= 80;
      return (
         <div className="card mx-auto max-w-3xl p-8 text-center md:p-10">
            <h3 ref={titulo} tabIndex={-1} className="text-sm text-muted focus:outline-none">
               {t("sim-result")}
            </h3>
            <p className={`mt-2 text-6xl font-light tracking-[-0.04em] md:text-7xl ${aprobado ? "text-hpe-dark" : "text-danger"}`}>{pct}%</p>
            <p className="mt-3 text-ink-soft" role="status">
               {t("sim-score").replace("{ok}", String(aciertos)).replace("{total}", String(total))} {aprobado ? t("sim-pass") : t("sim-fail")}
            </p>
            <p className="mt-2 text-xs text-muted">{t("sim-disclaimer")}</p>
            <button type="button" onClick={reiniciar} className="btn btn-primary mt-6">
               {t("sim-restart")}
            </button>
         </div>
      );
   }

   const respondida = elegida !== null;
   const progreso = t("sim-progress").replace("{n}", String(idx + 1)).replace("{total}", String(total));
   return (
      <div className="card mx-auto max-w-3xl overflow-hidden">
         <div className="h-1 bg-line" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={idx + 1} aria-label={progreso}>
            <div className="h-full bg-hpe transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width: `${((idx + 1) / total) * 100}%` }} />
         </div>
         <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
               <span className="font-semibold text-hpe-dark tabular-nums">
                  <span aria-hidden="true">
                     {idx + 1}/{total}
                  </span>
                  <span className="sr-only">{progreso}</span>
               </span>
               <span className="text-muted">
                  {t("sim-example")} · {q.category}
               </span>
            </div>
            <h3 ref={titulo} tabIndex={-1} className="mt-4 text-lg leading-snug font-medium focus:outline-none md:text-xl">
               {q.question}
            </h3>
            <div className="mt-6 space-y-3" role="group" aria-label={q.question}>
               {q.options.map((o, i) => {
                  const estado = !respondida
                     ? "border-line hover:border-hpe/60 hover:bg-surface"
                     : o.correct
                       ? "border-hpe bg-hpe-light"
                       : i === elegida
                         ? "border-danger bg-danger-tint"
                         : "border-line opacity-60";
                  return (
                     <button
                        type="button"
                        key={i}
                        onClick={() => elegir(i)}
                        disabled={respondida}
                        aria-pressed={i === elegida}
                        className={`min-h-11 w-full rounded-2xl border px-5 py-4 text-left text-sm leading-relaxed transition-colors duration-300 ${estado}`}
                     >
                        {o.text}
                     </button>
                  );
               })}
            </div>
            <div aria-live="polite">
               {respondida && (
                  <p className={`mt-5 rounded-xl p-4 text-sm ${q.options[elegida].correct ? "bg-hpe-light text-hpe-deep" : "bg-danger-tint text-danger"}`}>
                     <strong>{q.options[elegida].correct ? t("sim-correct") : t("sim-incorrect")}</strong> {q.explanation}
                  </p>
               )}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
               <span className="text-xs text-muted">{t("sim-disclaimer")}</span>
               <button type="button" onClick={siguiente} disabled={!respondida} className="btn btn-secondary btn-sm">
                  {idx + 1 >= total ? t("sim-see-result") : `${t("sim-next")} →`}
               </button>
            </div>
         </div>
      </div>
   );
}
