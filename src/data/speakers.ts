import type { Lang } from "../i18n/ui";

// Perfil ampliado de cada speaker (diap. 17: foto, cargo oficial y bio de 40–60 palabras aprobados por HPE).
// TEMPORAL: mientras HPE no entregue los datos se usan valores genéricos. Al recibirlos:
//   1) llenar `cargo`, `bio` y `foto` (ruta en /public o import de src/assets),
//   2) cambiar PERFILES_PRELIMINARES a false (scripts/verificar-copy.mjs bloquea la publicación mientras sea true).
export const PERFILES_PRELIMINARES = true;

export interface PerfilSpeaker {
   n: number;
   foto?: string;
   /** Iniciales del avatar cuando no hay foto (por defecto: primera letra del nombre y del último apellido). */
   iniciales?: string;
   cargo?: Partial<Record<Lang, string>>;
   bio?: Partial<Record<Lang, string>>;
}

export const PERFILES: PerfilSpeaker[] = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }, { n: 6, iniciales: "AF" }];
