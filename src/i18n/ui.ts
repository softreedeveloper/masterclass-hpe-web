import { landing, type LandingKey } from "./landing";

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

// Textos propios de la plataforma (no existen en el sitio de referencia).
export const ui = {
   es: {
      "nav-login": "Iniciar sesión",
      "nav-account": "Mi cuenta",
      "nav-admin": "Panel admin",
      "login-title": "Iniciar sesión",
      "login-sub": "Accede a tu cuenta de la MasterClass.",
      "login-email": "Correo corporativo",
      "login-password": "Contraseña",
      "login-submit": "Entrar",
      "login-forgot": "¿Olvidaste tu contraseña?",
      "login-register": "¿Aún no tienes cuenta? Regístrate",
      "forgot-title": "Recuperar contraseña",
      "forgot-sub": "Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.",
      "forgot-submit": "Enviar enlace",
      "forgot-done": "Si el correo está registrado, recibirás un enlace en unos minutos. Vence en 1 hora.",
      "back-login": "Volver a iniciar sesión",
      "reset-title": "Crea tu contraseña",
      "reset-sub": "Mínimo 10 caracteres, con letras y números.",
      "reset-new": "Nueva contraseña",
      "reset-confirm": "Confirmar contraseña",
      "reset-submit": "Guardar contraseña",
      "reset-mismatch": "Las contraseñas no coinciden.",
      "reset-weak": "Usa al menos 10 caracteres con letras y números.",
      "reset-no-token": "El enlace no es válido. Solicita uno nuevo.",
      "reset-done": "Tu contraseña quedó guardada. Ya puedes iniciar sesión.",
      "required": "Campo obligatorio.",
      "email-invalid": "Ingresa un correo válido.",
      "show": "Mostrar",
      "hide": "Ocultar",
   },
   en: {
      "nav-login": "Sign in",
      "nav-account": "My account",
      "nav-admin": "Admin panel",
      "login-title": "Sign in",
      "login-sub": "Access your MasterClass account.",
      "login-email": "Corporate email",
      "login-password": "Password",
      "login-submit": "Sign in",
      "login-forgot": "Forgot your password?",
      "login-register": "No account yet? Register",
      "forgot-title": "Reset password",
      "forgot-sub": "Enter your email and we'll send you a link to create a new password.",
      "forgot-submit": "Send link",
      "forgot-done": "If the email is registered, you'll receive a link in a few minutes. It expires in 1 hour.",
      "back-login": "Back to sign in",
      "reset-title": "Create your password",
      "reset-sub": "At least 10 characters, with letters and numbers.",
      "reset-new": "New password",
      "reset-confirm": "Confirm password",
      "reset-submit": "Save password",
      "reset-mismatch": "Passwords don't match.",
      "reset-weak": "Use at least 10 characters with letters and numbers.",
      "reset-no-token": "The link is not valid. Request a new one.",
      "reset-done": "Your password has been saved. You can now sign in.",
      "required": "Required field.",
      "email-invalid": "Enter a valid email.",
      "show": "Show",
      "hide": "Hide",
   },
} as const;

export type UiKey = keyof typeof ui.es;
export type Key = LandingKey | UiKey;

export const esLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);

export function useT(lang: Lang) {
   return (key: Key): string =>
      (ui[lang] as Record<string, string>)[key] ?? (landing[lang] as Record<string, string>)[key] ?? key;
}

export const otroLang = (lang: Lang): Lang => (lang === "es" ? "en" : "es");
