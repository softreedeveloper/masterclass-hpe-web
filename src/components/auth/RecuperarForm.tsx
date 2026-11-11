import { useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { useT, type Lang } from "../../i18n/ui";
import { Input } from "../ui/Field";
import { Alert } from "../ui/Alert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function RecuperarForm({ lang }: { lang: Lang }) {
   const t = useT(lang);
   const [email, setEmail] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [listo, setListo] = useState(false);
   const [enviando, setEnviando] = useState(false);

   const enviar = async (e: { preventDefault(): void }) => {
      e.preventDefault();
      setError(null);
      if (!EMAIL_RE.test(email.trim())) return setError(t("email-invalid"));
      setEnviando(true);
      try {
         await api("/auth/recuperar", "POST", { email, idioma: lang });
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
            <h1 className="text-2xl font-medium">{t("forgot-title")}</h1>
            <p className="mt-1 text-sm text-muted">{t("forgot-sub")}</p>
         </div>
         {listo ? (
            <Alert tipo="success">{t("forgot-done")}</Alert>
         ) : (
            <>
               <Input
                  label={t("login-email")}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
               />
               <button className="btn btn-primary w-full" disabled={enviando}>
                  {enviando ? "…" : t("forgot-submit")}
               </button>
            </>
         )}
         <a href={`/${lang}/login`} className="block text-center text-sm text-hpe-dark hover:underline">
            {t("back-login")}
         </a>
      </form>
   );
}
