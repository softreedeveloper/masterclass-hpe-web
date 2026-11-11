import { useState } from "react";
import { api, mensajeError } from "../../lib/api";
import { destinoSeguro } from "../../lib/sesion";
import type { Usuario } from "../../lib/types";
import { useT, type Lang } from "../../i18n/ui";
import { Input } from "../ui/Field";
import { Alert } from "../ui/Alert";
import { PasswordInput } from "./PasswordInput";

export default function LoginForm({ lang }: { lang: Lang }) {
   const t = useT(lang);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [enviando, setEnviando] = useState(false);

   const enviar = async (e: { preventDefault(): void }) => {
      e.preventDefault();
      setError(null);
      if (!email.trim() || !password) return setError(t("required"));
      setEnviando(true);
      try {
         const u = await api<Usuario>("/auth/login", "POST", { email, password });
         const next = new URLSearchParams(window.location.search).get("next");
         window.location.assign(destinoSeguro(next, u.rol));
      } catch (err) {
         setError(mensajeError(err));
         setEnviando(false);
      }
   };

   return (
      <form onSubmit={enviar} noValidate className="card space-y-5 p-6 md:p-10">
         <div>
            <h1 className="text-2xl font-medium">{t("login-title")}</h1>
            <p className="mt-1 text-sm text-muted">{t("login-sub")}</p>
         </div>
         <Input
            label={t("login-email")}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
         />
         <PasswordInput
            label={t("login-password")}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            textos={{ show: t("show"), hide: t("hide") }}
            required
         />
         {error && <Alert tipo="error">{error}</Alert>}
         <button className="btn btn-primary w-full" disabled={enviando}>
            {enviando ? "…" : t("login-submit")}
         </button>
         <div className="flex flex-col gap-2 text-center text-sm">
            <a href={`/${lang}/recuperar`} className="text-hpe-dark hover:underline">
               {t("login-forgot")}
            </a>
            <a href={`/${lang}/#registro`} className="text-muted hover:underline">
               {t("login-register")}
            </a>
         </div>
      </form>
   );
}
