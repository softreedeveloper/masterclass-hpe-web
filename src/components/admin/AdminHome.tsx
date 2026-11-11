import { Contador } from "../ui/Contador";
import { useEffect, useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { fechaHora } from "../../lib/formato";
import type { Curso, Resumen } from "../../lib/types";
import { AppFrame, PageTitle } from "../ui/AppFrame";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Spinner } from "../ui/Spinner";

function Contenido() {
   const [resumen, setResumen] = useState<Resumen | null>(null);
   const [cursos, setCursos] = useState<Curso[] | null>(null);
   const [error, setError] = useState<string | null>(null);
   useEffect(() => {
      Promise.all([api<Resumen>("/admin/participantes/resumen"), api<Curso[]>("/cursos")])
         .then(([r, c]) => {
            setResumen(r);
            setCursos(c);
         })
         .catch((e) => setError(mensajeError(e)));
   }, []);
   if (error) return <Alert tipo="error">{error}</Alert>;
   if (!resumen || !cursos) return <Spinner />;
   const tarjetas = [
      ["Participantes", resumen.participantes, "/admin/participantes"],
      ["Cuentas activadas", resumen.verificados, "/admin/participantes?verificado=true"],
      ["Registros últimos 7 días", resumen.nuevos_7d, "/admin/participantes"],
      ["Clases activas", resumen.clases_activas, "/admin/clases"],
      ["Inscripciones vigentes", resumen.inscripciones, "/admin/clases"],
   ] as const;
   return (
      <>
         <div className="stagger grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {tarjetas.map(([t, v, href]) => (
               <a key={t} href={href} className="card card-hover spot group p-6">
                  <div className="flex items-start justify-between gap-2">
                     <p className="text-sm text-muted">{t}</p>
                     <svg className="card-arrow size-4 text-hpe-dark" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 11l6-6M6 5h5v5" /></svg>
                  </div>
                  <p className="mt-4 text-4xl font-light tracking-[-0.03em] tabular-nums transition-colors group-hover:text-hpe-dark">
                     <Contador valor={Number(v)} />
                  </p>
               </a>
            ))}
         </div>
         <section className="card mt-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
               <h2 className="text-lg font-medium">Clases</h2>
               <a href="/admin/clases" className="text-sm text-hpe-dark hover:underline">
                  Administrar
               </a>
            </div>
            <ul className="divide-y divide-line">
               {cursos.map((c) => (
                  <li key={c.id_course} className="flex flex-wrap items-center gap-3 px-6 py-3.5 text-sm transition-colors hover:bg-surface">
                     <span className="flex-1 font-medium">{c.titulo}</span>
                     <span className="text-muted">{fechaHora(c.fecha_inicio)}</span>
                     <Badge tono="gray">
                        {c.inscritos}
                        {c.cupo ? ` / ${c.cupo}` : ""} inscritos
                     </Badge>
                     {!c.activo && <Badge tono="red">Inactiva</Badge>}
                  </li>
               ))}
            </ul>
         </section>
      </>
   );
}

export default function AdminHome() {
   return (
      <AppFrame rol="ADMIN" actual="/admin">
         {() => (
            <>
               <PageTitle titulo="Resumen" sub="Estado general de registros, clases e inscripciones." />
               <Contenido />
            </>
         )}
      </AppFrame>
   );
}
