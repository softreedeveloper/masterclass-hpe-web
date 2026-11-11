import { useCallback, useEffect, useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { aInputFecha, fechaHora, PUESTOS } from "../../lib/formato";
import type { Curso, InscritoCurso } from "../../lib/types";
import { AppFrame, PageTitle } from "../ui/AppFrame";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Input, Textarea } from "../ui/Field";
import { Modal } from "../ui/Modal";
import { Spinner } from "../ui/Spinner";

const formVacio = { titulo: "", descripcion: "", numero_sesion: "", fecha_inicio: "", duracion_min: "60", url_sesion: "", cupo: "" };

function CursoForm({ curso, onGuardado }: { curso: Curso | null; onGuardado: () => void }) {
   const [d, setD] = useState(
      curso
         ? {
              titulo: curso.titulo,
              descripcion: curso.descripcion ?? "",
              numero_sesion: curso.numero_sesion?.toString() ?? "",
              fecha_inicio: aInputFecha(curso.fecha_inicio),
              duracion_min: String(curso.duracion_min),
              url_sesion: curso.url_sesion ?? "",
              cupo: curso.cupo?.toString() ?? "",
           }
         : formVacio,
   );
   const [error, setError] = useState<string | null>(null);
   const [guardando, setGuardando] = useState(false);
   const set = (k: keyof typeof formVacio) => (e: { target: { value: string } }) => setD({ ...d, [k]: e.target.value });

   const guardar = async (e: { preventDefault(): void }) => {
      e.preventDefault();
      setError(null);
      if (!d.titulo.trim()) return setError("El título es obligatorio");
      if (d.url_sesion && !/^https:\/\//i.test(d.url_sesion)) return setError("La URL debe iniciar con https://");
      setGuardando(true);
      try {
         if (curso) await api(`/cursos/${curso.id_course}`, "PUT", d);
         else await api("/cursos", "POST", d);
         onGuardado();
      } catch (err) {
         setError(mensajeError(err));
      } finally {
         setGuardando(false);
      }
   };

   return (
      <form onSubmit={guardar} noValidate className="space-y-4">
         <Input label="Título *" value={d.titulo} onChange={set("titulo")} maxLength={200} />
         <Textarea label="Descripción" rows={3} value={d.descripcion} onChange={set("descripcion")} maxLength={5000} />
         <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Número de sesión" type="number" min={1} value={d.numero_sesion} onChange={set("numero_sesion")} />
            <Input label="Fecha y hora de inicio" type="datetime-local" value={d.fecha_inicio} onChange={set("fecha_inicio")} />
            <Input label="Duración (min)" type="number" min={1} value={d.duracion_min} onChange={set("duracion_min")} />
            <Input label="Cupo" type="number" min={1} placeholder="Sin límite" value={d.cupo} onChange={set("cupo")} />
         </div>
         <Input
            label="URL de la sesión en vivo"
            type="url"
            placeholder="https://"
            value={d.url_sesion}
            onChange={set("url_sesion")}
            hint="Sólo la ven los participantes inscritos."
         />
         {error && <Alert tipo="error">{error}</Alert>}
         <button className="btn btn-primary w-full" disabled={guardando}>
            {guardando ? "Guardando…" : curso ? "Guardar cambios" : "Crear clase"}
         </button>
      </form>
   );
}

function Inscritos({ curso, onCambio }: { curso: Curso; onCambio: () => void }) {
   const [lista, setLista] = useState<InscritoCurso[] | null>(null);
   const [error, setError] = useState<string | null>(null);
   const cargar = useCallback(() => {
      api<InscritoCurso[]>(`/cursos/${curso.id_course}/participantes`)
         .then(setLista)
         .catch((e) => setError(mensajeError(e)));
   }, [curso.id_course]);
   useEffect(cargar, [cargar]);

   const cambiar = async (i: InscritoCurso, estatus: "INSCRITO" | "CANCELADO") => {
      setError(null);
      try {
         await api(`/cursos/${curso.id_course}/inscripciones/${i.id_user}`, "PATCH", { estatus });
         cargar();
         onCambio();
      } catch (e) {
         setError(mensajeError(e));
      }
   };

   if (!lista) return error ? <Alert tipo="error">{error}</Alert> : <Spinner />;
   return (
      <div className="space-y-3">
         <p className="text-sm text-ink-soft">
            Para inscribir participantes, selecciónalos en{" "}
            <a href={`/admin/participantes`} className="text-hpe-dark underline">
               Participantes
            </a>
            .
         </p>
         {error && <Alert tipo="error">{error}</Alert>}
         {lista.length ? (
            <ul className="divide-y divide-line">
               {lista.map((i) => (
                  <li key={i.id_enrollment} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                     <div className="flex-1">
                        <a href={`/admin/participante?id=${i.id_user}`} className="font-medium hover:underline">
                           {i.nombre_completo}
                        </a>
                        <p className="text-xs text-muted">
                           {i.email} · {i.empresa ?? "—"} · {i.puesto ? PUESTOS[i.puesto] : "—"}
                        </p>
                     </div>
                     <Badge tono={i.estatus === "INSCRITO" ? "green" : "gray"}>{i.estatus === "INSCRITO" ? "Inscrito" : "Cancelado"}</Badge>
                     {i.estatus === "INSCRITO" ? (
                        <button onClick={() => cambiar(i, "CANCELADO")} className="text-xs text-danger hover:underline">
                           Cancelar
                        </button>
                     ) : (
                        <button onClick={() => cambiar(i, "INSCRITO")} className="text-xs text-hpe-dark hover:underline">
                           Reinscribir
                        </button>
                     )}
                  </li>
               ))}
            </ul>
         ) : (
            <p className="text-sm text-muted">Sin participantes inscritos.</p>
         )}
      </div>
   );
}

function Contenido() {
   const [cursos, setCursos] = useState<Curso[] | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [editando, setEditando] = useState<Curso | "nuevo" | null>(null);
   const [viendo, setViendo] = useState<Curso | null>(null);

   const cargar = useCallback(() => {
      api<Curso[]>("/cursos")
         .then(setCursos)
         .catch((e) => setError(mensajeError(e)));
   }, []);
   useEffect(cargar, [cargar]);

   const toggle = async (c: Curso) => {
      if (c.activo && !window.confirm(`¿Desactivar "${c.titulo}"? Los inscritos dejarán de verla.`)) return;
      try {
         await api(`/cursos/${c.id_course}/activo`, "PATCH", { activo: !c.activo });
         cargar();
      } catch (e) {
         setError(mensajeError(e));
      }
   };

   return (
      <>
         <PageTitle
            titulo="Clases"
            sub="Sesiones de la temporada, cupos e inscripciones."
            acciones={
               <button onClick={() => setEditando("nuevo")} className="btn btn-primary btn-sm">
                  Nueva clase
               </button>
            }
         />
         {error && (
            <div className="mb-4">
               <Alert tipo="error">{error}</Alert>
            </div>
         )}
         {!cursos ? (
            <Spinner />
         ) : (
            <div className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
               {cursos.map((c) => (
                  <article key={c.id_course} className={`card card-hover spot flex flex-col p-6 ${c.activo ? "" : "opacity-60"}`}>
                     <div className="flex items-start justify-between gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-inverse text-xs font-semibold text-on-inverse">
                           {c.numero_sesion ? `M${String(c.numero_sesion).padStart(2, "0")}` : "—"}
                        </span>
                        <Badge tono={c.activo ? "green" : "red"}>{c.activo ? "Activa" : "Inactiva"}</Badge>
                     </div>
                     <h3 className="mt-3 font-medium">{c.titulo}</h3>
                     <p className="mt-1 text-sm text-muted">
                        {fechaHora(c.fecha_inicio)} · {c.duracion_min} min
                     </p>
                     <p className="mt-1 flex-1 text-sm text-ink-soft">
                        {c.inscritos} inscrito(s){c.cupo ? ` de ${c.cupo}` : ""}
                        {c.url_sesion ? " · con enlace" : " · sin enlace"}
                     </p>
                     <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                        <button onClick={() => setViendo(c)} className="btn btn-secondary btn-sm">
                           Inscritos
                        </button>
                        <button onClick={() => setEditando(c)} className="btn btn-ghost btn-sm">
                           Editar
                        </button>
                        <button onClick={() => toggle(c)} className={`btn btn-ghost btn-sm ${c.activo ? "text-danger" : "text-hpe-dark"}`}>
                           {c.activo ? "Desactivar" : "Activar"}
                        </button>
                     </div>
                  </article>
               ))}
               {!cursos.length && <p className="text-sm text-muted">No hay clases registradas.</p>}
            </div>
         )}
         <Modal abierto={editando !== null} titulo={editando === "nuevo" ? "Nueva clase" : "Editar clase"} onClose={() => setEditando(null)}>
            <CursoForm
               curso={editando === "nuevo" ? null : editando}
               onGuardado={() => {
                  setEditando(null);
                  cargar();
               }}
            />
         </Modal>
         <Modal abierto={viendo !== null} titulo={viendo ? `Inscritos · ${viendo.titulo}` : ""} onClose={() => setViendo(null)} ancho="max-w-2xl">
            {viendo && <Inscritos curso={viendo} onCambio={cargar} />}
         </Modal>
      </>
   );
}

export default function ClasesApp() {
   return (
      <AppFrame rol="ADMIN" actual="/admin/clases">
         {() => <Contenido />}
      </AppFrame>
   );
}
