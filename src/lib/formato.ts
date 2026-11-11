import type { Canal, Puesto } from "./types";

export const PUESTOS: Record<Puesto, string> = {
   preventa: "Preventa / Ingeniería",
   comercial: "Account Manager / Comercial",
   arquitecto: "Arquitecto de soluciones / negocio",
   alianzas: "Gerente de alianzas",
   consultor: "Consultor de negocio",
   directivo: "Directivo / Dueño de negocio",
};

export const CANALES: Record<Canal, string> = {
   direct: "Invitación directa",
   distribuidor: "Distribuidor autorizado",
};

// El backend manda TIMESTAMP como "YYYY-MM-DD HH:mm:ss" en hora del negocio (sin zona).
const aDate = (s: string) => new Date(s.replace(" ", "T"));

export const fechaHora = (s: string | null | undefined, locale = "es-MX") =>
   s ? aDate(s).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" }) : "—";

export const fecha = (s: string | null | undefined, locale = "es-MX") =>
   s ? aDate(s).toLocaleDateString(locale, { dateStyle: "medium" }) : "—";

// Para <input type="datetime-local">.
export const aInputFecha = (s: string | null | undefined) => (s ? s.replace(" ", "T").slice(0, 16) : "");
