import { useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { CANALES, PUESTOS } from "../../lib/formato";
import type { Usuario } from "../../lib/types";
import { Input, Select } from "../ui/Field";
import { Alert } from "../ui/Alert";

interface Props {
   usuario: Usuario;
   // Ruta PUT: "/perfil" (participante) o "/admin/participantes/:id" (admin).
   ruta: string;
   editarEmail?: boolean;
   onGuardado: (u: Usuario) => void;
}

const campos = (u: Usuario) => ({
   nombre_completo: u.nombre_completo ?? "",
   email: u.email,
   empresa: u.empresa ?? "",
   puesto: u.puesto ?? "",
   canal_invitacion: u.canal_invitacion ?? "",
   contacto_referido: u.contacto_referido ?? "",
   telefono: u.telefono ?? "",
   pais: u.pais ?? "",
   idioma: u.idioma,
});

// Formulario reutilizado por el participante (Mi cuenta) y el admin (detalle de participante).
export function PerfilForm({ usuario, ruta, editarEmail = false, onGuardado }: Props) {
   const [d, setD] = useState(campos(usuario));
   const [estado, setEstado] = useState<{ tipo: "error" | "success"; msg: string } | null>(null);
   const [guardando, setGuardando] = useState(false);
   const set = (k: keyof ReturnType<typeof campos>) => (e: { target: { value: string } }) =>
      setD({ ...d, [k]: e.target.value });

   const guardar = async (e: { preventDefault(): void }) => {
      e.preventDefault();
      setEstado(null);
      if (!d.nombre_completo.trim()) return setEstado({ tipo: "error", msg: "El nombre es obligatorio" });
      setGuardando(true);
      try {
         const { email, ...resto } = d;
         const u = await api<Usuario>(ruta, "PUT", editarEmail ? d : resto);
         onGuardado(u);
         setD(campos(u));
         setEstado({ tipo: "success", msg: "Cambios guardados" });
      } catch (err) {
         setEstado({ tipo: "error", msg: mensajeError(err) });
      } finally {
         setGuardando(false);
      }
   };

   return (
      <form onSubmit={guardar} noValidate className="space-y-4">
         <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre completo *" value={d.nombre_completo} onChange={set("nombre_completo")} maxLength={150} />
            <Input
               label="Correo"
               type="email"
               value={d.email}
               onChange={set("email")}
               disabled={!editarEmail}
               hint={!editarEmail ? "Para cambiar tu correo contacta al administrador." : undefined}
            />
            <Input label="Empresa / Integrador" value={d.empresa} onChange={set("empresa")} maxLength={150} />
            <Select label="Puesto" value={d.puesto} onChange={set("puesto")}>
               <option value="">Sin especificar</option>
               {Object.entries(PUESTOS).map(([v, t]) => (
                  <option key={v} value={v}>
                     {t}
                  </option>
               ))}
            </Select>
            <Select label="Canal de invitación" value={d.canal_invitacion} onChange={set("canal_invitacion")}>
               <option value="">Sin especificar</option>
               {Object.entries(CANALES).map(([v, t]) => (
                  <option key={v} value={v}>
                     {t}
                  </option>
               ))}
            </Select>
            <Input label="Contacto / Distribuidor" value={d.contacto_referido} onChange={set("contacto_referido")} maxLength={150} />
            <Input label="Teléfono" type="tel" value={d.telefono} onChange={set("telefono")} maxLength={30} />
            <Input label="País" value={d.pais} onChange={set("pais")} maxLength={80} />
            <Select label="Idioma de correos" value={d.idioma} onChange={set("idioma")}>
               <option value="es">Español</option>
               <option value="en">English</option>
            </Select>
         </div>
         {estado && <Alert tipo={estado.tipo}>{estado.msg}</Alert>}
         <div className="flex justify-end">
            <button className="btn btn-primary" disabled={guardando}>
               {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
         </div>
      </form>
   );
}
