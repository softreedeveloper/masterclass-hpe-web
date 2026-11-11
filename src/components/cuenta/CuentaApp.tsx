import { useEffect, useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { fechaHora } from "../../lib/formato";
import type { Inscripcion } from "../../lib/types";
import { AppFrame, PageTitle } from "../ui/AppFrame";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Spinner } from "../ui/Spinner";
import { PerfilForm } from "./PerfilForm";
import { CambiarPassword } from "./CambiarPassword";

function MisClases() {
   const [clases, setClases] = useState<Inscripcion[] | null>(null);
   const [error, setError] = useState<string | null>(null);
   useEffect(() => {
      api<Inscripcion[]>("/perfil/inscripciones").then(setClases).catch((e) => setError(mensajeError(e)));
   }, []);
   if (error) return <Alert tipo="error">{error}</Alert>;
   if (!clases) return <Spinner />;
   if (!clases.length)
      return (
         <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
            Aún no tienes clases asignadas. El equipo de la MasterClass te inscribirá en las sesiones de tu temporada.
         </p>
      );
   return (
      <ul className="stagger space-y-3">
         {clases.map((c) => (
            <li key={c.id_enrollment} className="spot flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors duration-300 hover:border-line-strong sm:flex-row sm:items-center">
               <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-inverse text-sm font-semibold text-on-inverse">
                  {c.numero_sesion ? `M${String(c.numero_sesion).padStart(2, "0")}` : "—"}
               </span>
               <div className="flex-1">
                  <p className="font-medium">{c.titulo}</p>
                  <p className="text-sm text-muted">
                     {fechaHora(c.fecha_inicio)} · {c.duracion_min} min
                  </p>
                  {c.descripcion && <p className="mt-1 text-sm text-ink-soft">{c.descripcion}</p>}
               </div>
               {c.url_sesion ? (
                  <a href={c.url_sesion} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                     Entrar a la sesión
                  </a>
               ) : (
                  <span className="self-start sm:self-center">
                     <Badge tono="gray">Enlace pendiente</Badge>
                  </span>
               )}
            </li>
         ))}
      </ul>
   );
}

export default function CuentaApp() {
   return (
      <AppFrame rol="PARTICIPANTE" actual="/cuenta">
         {(usuario, setUsuario) => (
            <>
               <PageTitle titulo={`Hola, ${usuario.nombre_completo?.split(" ")[0] ?? ""}`} sub="Tu información y tus clases de la MasterClass." />
               <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                  <div className="space-y-6">
                     <section className="card p-6">
                        <h2 className="mb-4 text-lg font-medium">Mis clases</h2>
                        <MisClases />
                     </section>
                     <section className="card p-6">
                        <h2 className="mb-4 text-lg font-medium">Mi perfil</h2>
                        <PerfilForm usuario={usuario} ruta="/perfil" onGuardado={setUsuario} />
                     </section>
                  </div>
                  <section className="card h-fit p-6">
                     <h2 className="mb-4 text-lg font-medium">Seguridad</h2>
                     <CambiarPassword />
                  </section>
               </div>
            </>
         )}
      </AppFrame>
   );
}
