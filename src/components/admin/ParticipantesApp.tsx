import { useCallback, useEffect, useState } from "react";
import { api, descargar, mensajeError, qs } from "../../lib/api";
import { CANALES, PUESTOS, fecha } from "../../lib/formato";
import type { Pagina, ParticipanteFila } from "../../lib/types";
import { AppFrame, PageTitle } from "../ui/AppFrame";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Input, Select } from "../ui/Field";
import { Spinner } from "../ui/Spinner";

const FILTROS_VACIOS = { q: "", empresa: "", puesto: "", canal: "", activo: "", verificado: "" };
type Filtros = typeof FILTROS_VACIOS;

// Los filtros viven en la URL: se pueden compartir y sobreviven a recargar.
const leerFiltros = (): Filtros => {
   const p = new URLSearchParams(window.location.search);
   return Object.fromEntries(Object.keys(FILTROS_VACIOS).map((k) => [k, p.get(k) ?? ""])) as Filtros;
};

function Listado() {
   const [filtros, setFiltros] = useState<Filtros>(leerFiltros);
   const [borrador, setBorrador] = useState<Filtros>(filtros);
   const [page, setPage] = useState(() => Number(new URLSearchParams(window.location.search).get("page")) || 1);
   const [data, setData] = useState<Pagina<ParticipanteFila> | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [cargando, setCargando] = useState(true);
   const [exportando, setExportando] = useState<string | null>(null);

   const cargar = useCallback(() => {
      setCargando(true);
      const query = { ...filtros, page, pageSize: 20 };
      window.history.replaceState(null, "", `/admin/participantes${qs({ ...filtros, page: page > 1 ? page : undefined })}`);
      api<Pagina<ParticipanteFila>>(`/admin/participantes${qs(query)}`)
         .then((d) => {
            setData(d);
            setError(null);
         })
         .catch((e) => setError(mensajeError(e)))
         .finally(() => setCargando(false));
   }, [filtros, page]);

   useEffect(cargar, [cargar]);

   const aplicar = (e: { preventDefault(): void }) => {
      e.preventDefault();
      setPage(1);
      setFiltros(borrador);
   };
   const limpiar = () => {
      setBorrador(FILTROS_VACIOS);
      setFiltros(FILTROS_VACIOS);
      setPage(1);
   };
   const exportar = async (formato: "xlsx" | "csv") => {
      setExportando(formato);
      try {
         await descargar(`/admin/participantes/exportar${qs({ ...filtros, formato })}`);
      } catch (e) {
         setError(mensajeError(e));
      } finally {
         setExportando(null);
      }
   };
   const set = (k: keyof Filtros) => (e: { target: { value: string } }) => setBorrador({ ...borrador, [k]: e.target.value });
   const items = data?.items ?? [];

   return (
      <>
         <PageTitle
            titulo="Participantes"
            sub={data ? `${data.total} registro(s) con los filtros actuales` : undefined}
            acciones={
               <>
                  <button onClick={() => exportar("xlsx")} className="btn btn-secondary btn-sm" disabled={!!exportando}>
                     {exportando === "xlsx" ? "Exportando…" : "Exportar Excel"}
                  </button>
                  <button onClick={() => exportar("csv")} className="btn btn-secondary btn-sm" disabled={!!exportando}>
                     {exportando === "csv" ? "Exportando…" : "Exportar CSV"}
                  </button>
               </>
            }
         />
         <form onSubmit={aplicar} className="card mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input label="Buscar" placeholder="Nombre, correo o empresa" value={borrador.q} onChange={set("q")} className="sm:col-span-2" />
            <Input label="Empresa" value={borrador.empresa} onChange={set("empresa")} />
            <Select label="Puesto" value={borrador.puesto} onChange={set("puesto")}>
               <option value="">Todos</option>
               {Object.entries(PUESTOS).map(([v, t]) => (
                  <option key={v} value={v}>
                     {t}
                  </option>
               ))}
            </Select>
            <Select label="Canal" value={borrador.canal} onChange={set("canal")}>
               <option value="">Todos</option>
               {Object.entries(CANALES).map(([v, t]) => (
                  <option key={v} value={v}>
                     {t}
                  </option>
               ))}
            </Select>
            <Select label="Cuenta" value={borrador.verificado} onChange={set("verificado")}>
               <option value="">Todas</option>
               <option value="true">Activada</option>
               <option value="false">Pendiente de activar</option>
            </Select>
            <Select label="Estatus" value={borrador.activo} onChange={set("activo")}>
               <option value="">Todos</option>
               <option value="true">Activo</option>
               <option value="false">Inactivo</option>
            </Select>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4 lg:justify-end">
               <button type="button" onClick={limpiar} className="btn btn-ghost btn-sm">
                  Limpiar
               </button>
               <button className="btn btn-primary btn-sm">Aplicar filtros</button>
            </div>
         </form>

         {error && <Alert tipo="error">{error}</Alert>}
         {cargando && !data ? (
            <Spinner />
         ) : (
            <div className="card overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                     <thead className="border-b border-line text-xs tracking-wide text-muted uppercase">
                        <tr>
                           <th className="px-4 py-3 font-medium">Participante</th>
                           <th className="px-4 py-3 font-medium">Empresa / Puesto</th>
                           <th className="px-4 py-3 font-medium">Canal</th>
                           <th className="px-4 py-3 font-medium">Estatus</th>
                           <th className="px-4 py-3 font-medium">Registro</th>
                        </tr>
                     </thead>
                     <tbody className={`stagger divide-y divide-line transition-opacity duration-300 ${cargando ? "opacity-40" : ""}`}>
                        {items.map((p) => (
                           <tr key={p.id_user} className="transition-colors hover:bg-surface">
                              <td className="px-4 py-3">
                                 <a href={`/admin/participante?id=${p.id_user}`} className="font-medium text-ink hover:text-hpe-dark hover:underline">
                                    {p.nombre_completo}
                                 </a>
                                 <p className="text-xs text-muted">{p.email}</p>
                              </td>
                              <td className="px-4 py-3">
                                 {p.empresa ?? "—"}
                                 <p className="text-xs text-muted">{p.puesto ? PUESTOS[p.puesto] : "—"}</p>
                              </td>
                              <td className="px-4 py-3 text-xs">
                                 {p.canal_invitacion ? CANALES[p.canal_invitacion] : "—"}
                                 {p.contacto_referido && <p className="text-muted">{p.contacto_referido}</p>}
                              </td>
                              <td className="space-x-1 px-4 py-3">
                                 {p.email_verificado_at ? <Badge tono="green">Activada</Badge> : <Badge tono="amber">Pendiente</Badge>}
                                 {!p.activo && <Badge tono="red">Inactivo</Badge>}
                              </td>
                              <td className="px-4 py-3 text-xs text-muted">{fecha(p.created_at)}</td>
                           </tr>
                        ))}
                        {!items.length && (
                           <tr>
                              <td colSpan={5} className="px-4 py-12 text-center text-muted">
                                 No hay participantes con estos filtros.
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
               {data && data.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm">
                     <span className="text-muted">
                        Página {data.page} de {data.totalPages}
                     </span>
                     <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                           Anterior
                        </button>
                        <button className="btn btn-secondary btn-sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>
                           Siguiente
                        </button>
                     </div>
                  </div>
               )}
            </div>
         )}

      </>
   );
}

export default function ParticipantesApp() {
   return (
      <AppFrame rol="ADMIN" actual="/admin/participantes">
         {() => <Listado />}
      </AppFrame>
   );
}
