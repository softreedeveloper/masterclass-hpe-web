import { useEffect, useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { fechaHora } from "../../lib/formato";
import type { Curso } from "../../lib/types";
import { Alert } from "../ui/Alert";
import { Select } from "../ui/Field";

interface Resultado {
   inscritos: number[];
   ya_inscritos: number[];
   no_validos: number[];
}

// Inscribe uno o varios participantes en una clase activa.
export function AsignarClase({ idsUser, onListo }: { idsUser: number[]; onListo: () => void }) {
   const [cursos, setCursos] = useState<Curso[]>([]);
   const [idCurso, setIdCurso] = useState("");
   const [estado, setEstado] = useState<{ tipo: "error" | "success"; msg: string } | null>(null);
   const [enviando, setEnviando] = useState(false);

   useEffect(() => {
      api<Curso[]>("/cursos")
         .then((c) => setCursos(c.filter((x) => x.activo)))
         .catch((e) => setEstado({ tipo: "error", msg: mensajeError(e) }));
   }, []);

   const asignar = async () => {
      if (!idCurso) return setEstado({ tipo: "error", msg: "Selecciona una clase" });
      setEnviando(true);
      setEstado(null);
      try {
         const r = await api<Resultado>(`/cursos/${idCurso}/inscripciones`, "POST", { ids_user: idsUser });
         const partes = [`${r.inscritos.length} inscrito(s)`];
         if (r.ya_inscritos.length) partes.push(`${r.ya_inscritos.length} ya estaban inscritos`);
         if (r.no_validos.length) partes.push(`${r.no_validos.length} no válidos`);
         setEstado({ tipo: "success", msg: partes.join(" · ") });
         onListo();
      } catch (e) {
         setEstado({ tipo: "error", msg: mensajeError(e) });
      } finally {
         setEnviando(false);
      }
   };

   return (
      <div className="space-y-4">
         <p className="text-sm text-ink-soft">{idsUser.length} participante(s) seleccionado(s).</p>
         <Select label="Clase" value={idCurso} onChange={(e) => setIdCurso(e.target.value)}>
            <option value="">Selecciona…</option>
            {cursos.map((c) => (
               <option key={c.id_course} value={c.id_course}>
                  {c.titulo} — {fechaHora(c.fecha_inicio)} ({c.inscritos}
                  {c.cupo ? `/${c.cupo}` : ""})
               </option>
            ))}
         </Select>
         {estado && <Alert tipo={estado.tipo}>{estado.msg}</Alert>}
         <button onClick={asignar} className="btn btn-primary w-full" disabled={enviando}>
            {enviando ? "Inscribiendo…" : "Inscribir"}
         </button>
      </div>
   );
}
