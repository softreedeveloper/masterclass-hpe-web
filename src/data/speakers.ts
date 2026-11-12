import type { ImageMetadata } from "astro";
import type { Lang } from "../i18n/ui";
import luisPablo from "../assets/speakers/luis-pablo-alcala.png";
import alejandro from "../assets/speakers/alejandro-florean.png";
import erika from "../assets/speakers/erika-araujo.png";
import alfredo from "../assets/speakers/alfredo-yepez.png";
import bernardo from "../assets/speakers/bernardo-miretzky.png";
import ana from "../assets/speakers/ana-fernandez-aberturas.png";

// Perfil ampliado de cada speaker (diap. 17: foto, cargo oficial y bio de 40–60 palabras aprobados por HPE).
// TEMPORAL: mientras HPE no entregue los datos se usan valores genéricos. Al recibirlos:
//   1) llenar `cargo` y `bio` (las fotos ya están en src/assets/speakers, entregadas por el cliente 2026-11-12),
//   2) cambiar PERFILES_PRELIMINARES a false (scripts/verificar-copy.mjs bloquea la publicación mientras sea true).
export const PERFILES_PRELIMINARES = true;

export interface PerfilSpeaker {
   n: number;
   foto?: ImageMetadata;
   /** Iniciales del avatar cuando no hay foto (por defecto: primera letra del nombre y del último apellido). */
   iniciales?: string;
   cargo?: Partial<Record<Lang, string>>;
   bio?: Partial<Record<Lang, string>>;
}

export const PERFILES: PerfilSpeaker[] = [
   { n: 1, foto: luisPablo },
   { n: 2, foto: alejandro },
   { n: 3, foto: erika },
   { n: 4, foto: alfredo },
   { n: 5, foto: bernardo },
   { n: 6, foto: ana, iniciales: "AF" },
];
