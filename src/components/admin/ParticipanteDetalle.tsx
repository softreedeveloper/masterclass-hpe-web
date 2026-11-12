import { useCallback, useEffect, useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { CANALES, PUESTOS, fechaHora } from "../../lib/formato";
import type { Usuario } from "../../lib/types";
import { AppFrame, PageTitle } from "../ui/AppFrame";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Spinner } from "../ui/Spinner";
import { PerfilForm } from "../cuenta/PerfilForm";

type Detalle = Usuario;

function Contenido({ id }: { id: number }) {
   const [p, setP] = useState<Detalle | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [aviso, setAviso] = useState<string | null>(null);
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
         <div className="max-w-3xl">
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
