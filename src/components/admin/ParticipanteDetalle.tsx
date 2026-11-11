import { useCallback, useEffect, useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { CANALES, PUESTOS, fechaHora } from "../../lib/formato";
import type { Inscripcion, Usuario } from "../../lib/types";
import { AppFrame, PageTitle } from "../ui/AppFrame";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Spinner } from "../ui/Spinner";
import { PerfilForm } from "../cuenta/PerfilForm";
import { AsignarClase } from "./AsignarClase";

type Detalle = Usuario & { inscripciones: Inscripcion[] };

function Contenido({ id }: { id: number }) {
   const [p, setP] = useState<Detalle | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [aviso, setAviso] = useState<string | null>(null);
   const [asignando, setAsignando] = useState(false);
   const [editando, setEditando] = useState(false);

   const cargar = useCallback(() => {
      api<Detalle>(`/admin/participantes/${id}`)
         .then(setP)
         .catch((e) => setError(mensajeError(e)));
   }, [id]);
   useEffect(cargar, [cargar]);

   if (error) return <Alert tipo="error">{error}</Alert>;
   if (!p) return <Spinner />;

   const toggleActivo = async () => {
      const accion = p.activo ? "desactivar" : "activar";
      if (!window.confirm(`¿Seguro que quieres ${accion} a ${p.nombre_completo}?`)) return;
      try {
         setP(await api<Detalle>(`/admin/participantes/${id}/activo`, "PATCH", { activo: !p.activo }));
         setAviso(p.activo ? "Participante desactivado: se cerraron sus sesiones." : "Participante activado.");
      } catch (e) {
         setError(mensajeError(e));
      }
   };
   const estatusInscripcion = async (i: Inscripcion, estatus: "INSCRITO" | "CANCELADO") => {
      try {
         await api(`/cursos/${i.id_course}/inscripciones/${id}`, "PATCH", { estatus });
         cargar();
      } catch (e) {
         setAviso(mensajeError(e));
      }
   };

   const datos: [string, string][] = [
      ["Correo", p.email],
      ["Empresa", p.empresa ?? "—"],
      ["Puesto", p.puesto ? PUESTOS[p.puesto] : "—"],
      ["Canal", p.canal_invitacion ? CANALES[p.canal_invitacion] : "—"],
      ["Contacto / Distribuidor", p.contacto_referido ?? "—"],
      ["Teléfono", p.telefono ?? "—"],
      ["País", p.pais ?? "—"],
      ["Registro", fechaHora(p.created_at)],
      ["Cuenta activada", p.email_verificado_at ? fechaHora(p.email_verificado_at) : "Pendiente"],
      ["Último acceso", fechaHora(p.last_login_at)],
   ];

   return (
      <>
         <a href="/admin/participantes" className="mb-4 inline-block text-sm text-hpe-dark hover:underline">
            ← Participantes
         </a>
         <PageTitle
            titulo={p.nombre_completo ?? p.email}
            acciones={
               <>
                  <button onClick={() => setEditando(true)} className="btn btn-secondary btn-sm">
                     Editar
                  </button>
                  <button onClick={toggleActivo} className={`btn btn-sm ${p.activo ? "btn-danger" : "btn-primary"}`}>
                     {p.activo ? "Desactivar" : "Activar"}
                  </button>
               </>
            }
         />
         <div className="mb-4 flex flex-wrap gap-2">
            {p.email_verificado_at ? <Badge tono="green">Cuenta activada</Badge> : <Badge tono="amber">Pendiente de activar</Badge>}
            <Badge tono={p.activo ? "green" : "red"}>{p.activo ? "Activo" : "Inactivo"}</Badge>
         </div>
         {aviso && (
            <div className="mb-4">
               <Alert tipo="info">{aviso}</Alert>
            </div>
         )}
         <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <section className="card h-fit p-6">
               <h2 className="mb-4 text-lg font-medium">Información</h2>
               <dl className="divide-y divide-line text-sm">
                  {datos.map(([k, v]) => (
                     <div key={k} className="grid grid-cols-[140px_1fr] gap-3 py-2.5">
                        <dt className="text-muted">{k}</dt>
                        <dd className="break-words">{v}</dd>
                     </div>
                  ))}
               </dl>
            </section>
            <section className="card h-fit p-6">
               <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium">Inscripciones</h2>
                  <button onClick={() => setAsignando(true)} className="btn btn-primary btn-sm">
                     Inscribir en clase
                  </button>
               </div>
               {p.inscripciones.length ? (
                  <ul className="divide-y divide-line">
                     {p.inscripciones.map((i) => (
                        <li key={i.id_enrollment} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                           <div className="flex-1">
                              <p className="font-medium">{i.titulo}</p>
                              <p className="text-xs text-muted">{fechaHora(i.fecha_inicio)}</p>
                           </div>
                           {!i.activo && <Badge tono="red">Clase inactiva</Badge>}
                           <Badge tono={i.estatus === "INSCRITO" ? "green" : "gray"}>{i.estatus === "INSCRITO" ? "Inscrito" : "Cancelado"}</Badge>
                           {i.estatus === "INSCRITO" ? (
                              <button onClick={() => estatusInscripcion(i, "CANCELADO")} className="text-xs text-danger hover:underline">
                                 Cancelar
                              </button>
                           ) : (
                              <button onClick={() => estatusInscripcion(i, "INSCRITO")} className="text-xs text-hpe-dark hover:underline">
                                 Reinscribir
                              </button>
                           )}
                        </li>
                     ))}
                  </ul>
               ) : (
                  <p className="text-sm text-muted">Sin inscripciones.</p>
               )}
            </section>
         </div>
         <Modal abierto={editando} titulo="Editar participante" onClose={() => setEditando(false)} ancho="max-w-2xl">
            <PerfilForm
               usuario={p}
               ruta={`/admin/participantes/${id}`}
               editarEmail
               onGuardado={(u) => {
                  setP(u as Detalle);
                  setEditando(false);
                  setAviso("Datos actualizados.");
               }}
            />
         </Modal>
         <Modal abierto={asignando} titulo="Inscribir en clase" onClose={() => setAsignando(false)}>
            <AsignarClase idsUser={[id]} onListo={cargar} />
         </Modal>
      </>
   );
}

export default function ParticipanteDetalle() {
   const id = Number(new URLSearchParams(window.location.search).get("id"));
   return (
      <AppFrame rol="ADMIN" actual="/admin/participantes">
         {() => (id > 0 ? <Contenido id={id} /> : <Alert tipo="error">Participante no especificado.</Alert>)}
      </AppFrame>
   );
}
