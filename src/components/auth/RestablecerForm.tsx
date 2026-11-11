import { useEffect, useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { useT, type Lang } from "../../i18n/ui";
import { Alert } from "../ui/Alert";
import { PasswordInput } from "./PasswordInput";

export const passwordValida = (p: string) => p.length >= 10 && p.length <= 72 && /[A-Za-z]/.test(p) && /\d/.test(p);

// Sirve para activar la cuenta (primer acceso) y para recuperar la contraseña.
export default function RestablecerForm({ lang }: { lang: Lang }) {
   const t = useT(lang);
   // undefined = aún no se lee la URL; null = sin token.
   const [token, setToken] = useState<string | null | undefined>(undefined);
   const [password, setPassword] = useState("");
   const [confirmar, setConfirmar] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [listo, setListo] = useState(false);
   const [enviando, setEnviando] = useState(false);

   useEffect(() => {
      setToken(new URLSearchParams(window.location.search).get("token"));
      // Se quita el token de la barra de direcciones para que no quede en el historial ni en Referer.
      window.history.replaceState(null, "", window.location.pathname);
   }, []);

   const enviar = async (e: { preventDefault(): void }) => {
      e.preventDefault();
      setError(null);
      if (!passwordValida(password)) return setError(t("reset-weak"));
      if (password !== confirmar) return setError(t("reset-mismatch"));
      setEnviando(true);
      try {
         await api("/auth/restablecer", "POST", { token, password });
         setListo(true);
      } catch (err) {
         setError(mensajeError(err));
      } finally {
         setEnviando(false);
      }
   };

   return (
      <form onSubmit={enviar} noValidate className="card space-y-5 p-6 md:p-10">
         <div>
            <h1 className="text-2xl font-medium">{t("reset-title")}</h1>
            <p className="mt-1 text-sm text-muted">{t("reset-sub")}</p>
         </div>
         {listo ? (
            <>
               <Alert tipo="success">{t("reset-done")}</Alert>
               <a href={`/${lang}/login`} className="btn btn-primary w-full">
                  {t("login-submit")}
               </a>
            </>
         ) : token === undefined ? null : !token ? (
            <>
               <Alert tipo="error">{t("reset-no-token")}</Alert>
               <a href={`/${lang}/recuperar`} className="btn btn-secondary w-full">
                  {t("forgot-submit")}
               </a>
            </>
         ) : (
            <>
               <PasswordInput
                  label={t("reset-new")}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  hint={t("reset-sub")}
                  textos={{ show: t("show"), hide: t("hide") }}
               />
               <PasswordInput
                  label={t("reset-confirm")}
                  autoComplete="new-password"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  textos={{ show: t("show"), hide: t("hide") }}
               />
               {error && <Alert tipo="error">{error}</Alert>}
               <button className="btn btn-primary w-full" disabled={enviando}>
                  {enviando ? "…" : t("reset-submit")}
               </button>
            </>
         )}
      </form>
   );
}
