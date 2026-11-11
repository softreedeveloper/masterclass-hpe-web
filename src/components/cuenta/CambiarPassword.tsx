import { useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { passwordValida } from "../auth/RestablecerForm";
import { PasswordInput } from "../auth/PasswordInput";
import { Alert } from "../ui/Alert";

export function CambiarPassword() {
   const [actual, setActual] = useState("");
   const [nueva, setNueva] = useState("");
   const [confirmar, setConfirmar] = useState("");
   const [estado, setEstado] = useState<{ tipo: "error" | "success"; msg: string } | null>(null);
   const [enviando, setEnviando] = useState(false);

   const enviar = async (e: { preventDefault(): void }) => {
      e.preventDefault();
      setEstado(null);
      if (!actual) return setEstado({ tipo: "error", msg: "Escribe tu contraseña actual" });
      if (!passwordValida(nueva))
         return setEstado({ tipo: "error", msg: "La nueva contraseña debe tener 10+ caracteres con letras y números" });
      if (nueva !== confirmar) return setEstado({ tipo: "error", msg: "Las contraseñas no coinciden" });
      setEnviando(true);
      try {
         await api("/auth/password", "PUT", { actual, nueva });
         setActual("");
         setNueva("");
         setConfirmar("");
         setEstado({ tipo: "success", msg: "Contraseña actualizada. Se cerraron tus otras sesiones." });
      } catch (err) {
         setEstado({ tipo: "error", msg: mensajeError(err) });
      } finally {
         setEnviando(false);
      }
   };

   return (
      <form onSubmit={enviar} noValidate className="space-y-4">
         <PasswordInput label="Contraseña actual" autoComplete="current-password" value={actual} onChange={(e) => setActual(e.target.value)} />
         <PasswordInput
            label="Nueva contraseña"
            autoComplete="new-password"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            hint="Mínimo 10 caracteres, con letras y números."
         />
         <PasswordInput label="Confirmar nueva contraseña" autoComplete="new-password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
         {estado && <Alert tipo={estado.tipo}>{estado.msg}</Alert>}
         <button className="btn btn-primary w-full" disabled={enviando}>
            {enviando ? "Guardando…" : "Cambiar contraseña"}
         </button>
      </form>
   );
}
