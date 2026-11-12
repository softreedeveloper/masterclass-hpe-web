import { useState } from "react";
import { cerrarSesion } from "../../lib/sesion";
import type { Usuario } from "../../lib/types";
import { ThemeToggleButton } from "./ThemeToggleButton";
import logoPos from "../../assets/hpe-logo.png";
import logoRev from "../../assets/hpe-logo-rev.png";

interface Props {
   usuario: Usuario;
   actual: string;
}

// El panel admin sólo consulta y exporta registros de la landing.
const LINKS_ADMIN = [{ href: "/admin/participantes", texto: "Participantes" }];

const iniciales = (nombre: string | null, email: string) =>
   (nombre || email)
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");

export function AppHeader({ usuario, actual }: Props) {
   const [abierto, setAbierto] = useState(false);
   const links = usuario.rol === "ADMIN" ? LINKS_ADMIN : [{ href: "/cuenta", texto: "Mi cuenta" }];
   const activo = (href: string) => actual.startsWith(href);
   return (
      <header className="sticky top-0 z-30 border-b border-line bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150">
         <div className="container-x flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
               <a href={usuario.rol === "ADMIN" ? "/admin/participantes" : "/cuenta"} className="flex items-center gap-3">
                  <img src={logoPos.src} alt="HPE" width={77} height={22} className="h-[22px] w-auto dark:hidden" />
                  <img src={logoRev.src} alt="HPE" width={77} height={22} className="hidden h-[22px] w-auto dark:block" />
                  <span className="h-7 w-px bg-line" aria-hidden="true" />
                  <span className="leading-tight">
                     <span className="block text-xs font-semibold tracking-[0.2em]">MASTER CLASS</span>
                     <span className="block text-[11px] text-muted">
                        {usuario.rol === "ADMIN" ? "Panel administrativo" : "Portal del participante"}
                     </span>
                  </span>
               </a>
               <nav className="hidden md:block" aria-label="Secciones">
                  <ul className="flex gap-1 rounded-full bg-surface p-1 text-sm">
                     {links.map((l) => (
                        <li key={l.href}>
                           <a
                              href={l.href}
                              aria-current={activo(l.href) ? "page" : undefined}
                              className="block rounded-full px-4 py-1.5 text-ink-soft transition-all duration-300 hover:text-ink aria-[current=page]:bg-card aria-[current=page]:font-medium aria-[current=page]:text-ink aria-[current=page]:shadow-[0_1px_3px_rgb(0_0_0/0.12)]"
                           >
                              {l.texto}
                           </a>
                        </li>
                     ))}
                  </ul>
               </nav>
            </div>
            <div className="flex items-center gap-2">
               <a href="/es/" className="btn btn-ghost btn-sm hidden lg:inline-flex">
                  Sitio público
               </a>
               <ThemeToggleButton />
               <div className="hidden items-center gap-3 border-l border-line pl-3 md:flex">
                  <span className="grid size-9 place-items-center rounded-full bg-hpe-light text-xs font-semibold text-hpe-deep" aria-hidden="true">
                     {iniciales(usuario.nombre_completo, usuario.email)}
                  </span>
                  <span className="hidden text-xs leading-tight xl:block">
                     <span className="block font-medium text-ink">{usuario.nombre_completo}</span>
                     <span className="text-muted">{usuario.email}</span>
                  </span>
                  <button onClick={cerrarSesion} className="btn btn-ghost btn-sm" title="Cerrar sesión">
                     Salir
                  </button>
               </div>
               <button
                  className="grid size-9 place-items-center rounded-full hover:bg-surface md:hidden"
                  aria-label="Menú"
                  aria-expanded={abierto}
                  onClick={() => setAbierto(!abierto)}
               >
                  <span className="relative block h-3 w-[18px]" aria-hidden="true">
                     <span
                        className={`absolute top-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ${abierto ? "translate-y-[5px] rotate-45" : ""}`}
                     />
                     <span
                        className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ${abierto ? "-translate-y-[5px] -rotate-45" : ""}`}
                     />
                  </span>
               </button>
            </div>
         </div>
         <div
            className={`grid border-t transition-[grid-template-rows,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] md:hidden ${abierto ? "grid-rows-[1fr] border-line" : "grid-rows-[0fr] border-transparent"}`}
         >
            <nav className="overflow-hidden" aria-label="Secciones">
               <ul className="container-x flex flex-col py-2">
                  {links.map((l) => (
                     <li key={l.href}>
                        <a
                           href={l.href}
                           aria-current={activo(l.href) ? "page" : undefined}
                           className="block rounded-xl px-3 py-3 text-sm hover:bg-surface aria-[current=page]:font-medium aria-[current=page]:text-hpe-dark"
                        >
                           {l.texto}
                        </a>
                     </li>
                  ))}
                  <li className="mt-1 border-t border-line pt-2">
                     <p className="px-3 py-1 text-xs text-muted">{usuario.email}</p>
                     <button onClick={cerrarSesion} className="w-full rounded-xl px-3 py-3 text-left text-sm text-danger hover:bg-surface">
                        Cerrar sesión
                     </button>
                  </li>
               </ul>
            </nav>
         </div>
      </header>
   );
}
