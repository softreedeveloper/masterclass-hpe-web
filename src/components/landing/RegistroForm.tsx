import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { api, ApiError, mensajeError } from "../../lib/api";
import { track } from "../../lib/track";
import { useT, type Lang } from "../../i18n/ui";
import { Input, Select } from "../ui/Field";
import { Alert } from "../ui/Alert";

// El flujo técnico (POST /auth/registro → correo de activación) lo define Diego/HPE: aquí sólo cambia la UI.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PRIVACY_URL = import.meta.env.PUBLIC_PRIVACY_URL || "";
const vacio = { nombre_completo: "", email: "", empresa: "", puesto: "", canal_invitacion: "", contacto_referido: "" };
type Campo = keyof typeof vacio | "compromiso" | "privacidad";

export default function RegistroForm({ lang }: { lang: Lang }) {
   const t = useT(lang);
   const [datos, setDatos] = useState(vacio);
   const [compromiso, setCompromiso] = useState(false);
   const [privacidad, setPrivacidad] = useState(false);
   const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
   const [enviando, setEnviando] = useState(false);
   const [errorApi, setErrorApi] = useState<string | null>(null);
   const [listo, setListo] = useState(false);
   const [intento, setIntento] = useState(0);
   const iniciado = useRef(false);
   const form = useRef<HTMLFormElement>(null);
   const exito = useRef<HTMLHeadingElement>(null);

   // Mensaje por campo (diap. 22). null = válido.
   const errorDe = (k: Campo, d = datos, c = compromiso, p = privacidad): string | null => {
      switch (k) {
         case "nombre_completo":
         case "empresa":
            return d[k].trim() ? null : t("err-required");
         case "email":
            return !d.email.trim() ? t("err-required") : EMAIL_RE.test(d.email.trim()) ? null : t("err-email");
         case "puesto":
            return d.puesto ? null : t("err-role");
         case "canal_invitacion":
            return d.canal_invitacion ? null : t("err-source");
         case "compromiso":
            return c ? null : t("err-commitment");
         case "privacidad":
            return p ? null : t("err-privacy");
         default:
            return null;
      }
   };

   const fijarError = (k: Campo, msg: string | null) =>
      setErrores(({ [k]: _, ...resto }) => (msg ? { ...resto, [k]: msg } : resto));

   // Validación en línea: al salir del campo; si ya tenía error, se revalida mientras escribe.
   const set = (k: keyof typeof vacio) => (e: { target: { value: string } }) => {
      const d = { ...datos, [k]: e.target.value };
      setDatos(d);
      if (errores[k]) fijarError(k, errorDe(k, d));
   };
   const blur = (k: keyof typeof vacio) => () => {
      if (k === "contacto_referido") return;
      const msg = errorDe(k);
      fijarError(k, msg);
      if (msg) track("form_error", { campo: k, momento: "blur" });
   };

   const alEnfocar = (_: FocusEvent<HTMLFormElement>) => {
      if (iniciado.current) return;
      iniciado.current = true;
      track("form_start", { formulario: "registro", idioma: lang });
   };

   // Tras un envío con errores, el foco va al primer campo marcado.
   useEffect(() => {
      if (intento) form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
   }, [intento]);
   useEffect(() => {
      if (listo) exito.current?.focus();
   }, [listo]);

   const enviar = async (ev: { preventDefault(): void }) => {
      ev.preventDefault();
      setErrorApi(null);
      const campos: Campo[] = ["nombre_completo", "email", "empresa", "puesto", "canal_invitacion", "compromiso", "privacidad"];
      const e: Partial<Record<Campo, string>> = {};
      for (const k of campos) {
         const msg = errorDe(k);
         if (msg) e[k] = msg;
      }
      setErrores(e);
      if (Object.keys(e).length) {
         for (const k of Object.keys(e)) track("form_error", { campo: k, momento: "submit" });
         setIntento((n) => n + 1);
         return;
      }
      setEnviando(true);
      try {
         // El consentimiento de privacidad se valida sólo en el cliente (no se envía al backend).
         await api("/auth/registro", "POST", { ...datos, acepta_compromiso: true, idioma: lang });
         track("form_submit", { resultado: "ok", canal: datos.canal_invitacion, rol: datos.puesto });
         setListo(true);
      } catch (err) {
         const tecnico = !(err instanceof ApiError) || err.status === 0 || err.status >= 500;
         track("form_submit", { resultado: "error", tipo: tecnico ? "tecnico" : "validacion" });
         setErrorApi(tecnico || lang !== "es" ? t("err-technical") : mensajeError(err));
      } finally {
         setEnviando(false);
      }
   };

   if (listo) {
      return (
         <div className="card p-8 text-center md:p-10" role="status">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-hpe text-on-hpe">
               <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12l5 5L20 7" />
               </svg>
            </div>
            <h3 ref={exito} tabIndex={-1} className="mt-4 text-xl font-medium focus:outline-none">
               {t("success-title")}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{t("success-p")}</p>
         </div>
      );
   }

   const check = (
      campo: "compromiso" | "privacidad",
      valor: boolean,
      setValor: (v: boolean) => void,
      contenido: ReactNode,
   ) => (
      <div>
         <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1 text-sm text-ink-soft">
            <input
               type="checkbox"
               checked={valor}
               onChange={(e) => {
                  setValor(e.target.checked);
                  if (errores[campo]) fijarError(campo, e.target.checked ? null : errores[campo]!);
               }}
               className="mt-0.5 size-5 shrink-0 accent-hpe"
               aria-invalid={errores[campo] ? true : undefined}
               aria-describedby={errores[campo] ? `err-${campo}` : undefined}
               aria-required="true"
            />
            <span>{contenido}</span>
         </label>
         {errores[campo] && (
            <p id={`err-${campo}`} className="field-error">
               {errores[campo]}
            </p>
         )}
      </div>
   );

   return (
      <form ref={form} onSubmit={enviar} onFocus={alEnfocar} noValidate className="card space-y-4 p-6 md:p-10">
         <Input
            label={t("label-name")}
            value={datos.nombre_completo}
            onChange={set("nombre_completo")}
            onBlur={blur("nombre_completo")}
            error={errores.nombre_completo}
            autoComplete="name"
            aria-required="true"
            maxLength={150}
         />
         <Input
            label={t("label-email")}
            type="email"
            inputMode="email"
            value={datos.email}
            onChange={set("email")}
            onBlur={blur("email")}
            error={errores.email}
            autoComplete="email"
            aria-required="true"
            maxLength={160}
         />
         <Input
            label={t("label-company")}
            value={datos.empresa}
            onChange={set("empresa")}
            onBlur={blur("empresa")}
            error={errores.empresa}
            autoComplete="organization"
            aria-required="true"
            maxLength={150}
         />
         <Select
            label={t("label-role")}
            value={datos.puesto}
            onChange={set("puesto")}
            onBlur={blur("puesto")}
            error={errores.puesto}
            aria-required="true"
         >
            <option value="" disabled>
               {t("role-select")}
            </option>
            <option value="directivo">{t("role-executive")}</option>
            <option value="comercial">{t("role-commercial")}</option>
            <option value="alianzas">{t("role-alliances")}</option>
            <option value="preventa">{t("role-presales")}</option>
            <option value="arquitecto">{t("role-architect")}</option>
            <option value="consultor">{t("role-consultant")}</option>
         </Select>
         <Select
            label={t("label-source")}
            value={datos.canal_invitacion}
            onChange={set("canal_invitacion")}
            onBlur={blur("canal_invitacion")}
            error={errores.canal_invitacion}
            aria-required="true"
         >
            <option value="" disabled>
               {t("source-select")}
            </option>
            <option value="direct">{t("source-direct")}</option>
            <option value="distribuidor">{t("source-dist")}</option>
         </Select>
         <Input label={t("label-referral")} value={datos.contacto_referido} onChange={set("contacto_referido")} maxLength={150} />
         <div className="space-y-1 pt-2">
            {check("compromiso", compromiso, setCompromiso, t("check-commitment"))}
            {check(
               "privacidad",
               privacidad,
               setPrivacidad,
               <>
                  {t("check-privacy-pre")}
                  {PRIVACY_URL ? (
                     <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-hpe-dark underline">
                        {t("check-privacy-link")}
                     </a>
                  ) : (
                     t("check-privacy-link")
                  )}
                  {t("check-privacy-post")}
               </>,
            )}
         </div>
         {Object.keys(errores).length > 0 && intento > 0 && (
            <p className="sr-only" role="alert">
               {t("err-summary")}
            </p>
         )}
         {errorApi && <Alert tipo="error">{errorApi}</Alert>}
         <button type="submit" className="btn btn-primary w-full" disabled={enviando}>
            {enviando ? t("submit-sending") : t("submit-btn")}
         </button>
      </form>
   );
}
