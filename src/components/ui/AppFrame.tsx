import type { ReactNode } from "react";
import { useSesion } from "../../lib/sesion";
import type { Rol, Usuario } from "../../lib/types";
import { AppHeader } from "./AppHeader";
import { Alert } from "./Alert";
import { Spinner } from "./Spinner";

interface Props {
   rol: Rol;
   actual: string;
   children: (usuario: Usuario, setUsuario: (u: Usuario) => void) => ReactNode;
}

// Marco común de las vistas autenticadas: valida sesión/rol, header y contenedor.
export function AppFrame({ rol, actual, children }: Props) {
   const { usuario, setUsuario, cargando, error } = useSesion(rol);
   if (cargando)
      return (
         <div className="container-x py-14">
            <Spinner />
         </div>
      );
   if (error || !usuario)
      return (
         <div className="container-x py-16">
            <Alert tipo="error">{error ?? "No se pudo cargar la sesión"}</Alert>
         </div>
      );
   return (
      <>
         <AppHeader usuario={usuario} actual={actual} />
         <div className="container-x animate-[fade-up_.6s_cubic-bezier(.16,1,.3,1)] py-10 md:py-14">{children(usuario, setUsuario)}</div>
      </>
   );
}

export function PageTitle({ titulo, sub, acciones }: { titulo: string; sub?: string; acciones?: ReactNode }) {
   return (
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
         <div>
            <h1 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">{titulo}</h1>
            {sub && <p className="mt-2 text-sm text-muted">{sub}</p>}
         </div>
         {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
      </div>
   );
}
