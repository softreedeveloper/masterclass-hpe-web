// Verificación previa a publicar (indicaciones del documento editorial/UX, diap. 25):
// - no deben quedar "Diplomatura", "2026", "escudo", "valor curricular" ni cifras sin validar
//   en el texto, los atributos (alt, title, meta) ni los nombres de imágenes;
// - el aviso de privacidad de HPE debe estar configurado (PUBLIC_PRIVACY_URL).
// Uso: npm run verificar        (revisa src/ y, si existe, dist/)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative } from "node:path";

const raiz = new URL("..", import.meta.url).pathname;
const RUTAS_SRC = ["src/i18n", "src/data", "src/components/landing", "src/pages", "src/layouts"];
const EXT_TEXTO = new Set([".ts", ".tsx", ".astro", ".html", ".js", ".mjs", ".css", ".json", ".xml", ".txt", ".svg"]);

const PROHIBIDOS = [
   [/diplomatura/i, "“Diplomatura”"],
   [/\b2026\b/, "“2026”"],
   [/escudo/i, "“escudo”"],
   [/curricular/i, "“valor curricular”"],
   [/\b(Gartner|IDC|Forrester|Deloitte|PwC|KPMG)\b/, "firma de análisis citada"],
   [/emblem/i, "emblema/escudo"],
];
// Porcentajes permitidos: criterios de acreditación (80% y 100%). Cualquier otra cifra requiere fuente validada.
const PERMITIDOS_PCT = new Set(["80%", "100%"]);
const RE_PCT = /\d+(?:[.,]\d+)?\s?%/g;
const RE_MULT = /\b\d+(?:\.\d+)?\s?[x×]\b(?!\w)/g;

const archivos = (dir) => {
   if (!existsSync(dir)) return [];
   return readdirSync(dir).flatMap((n) => {
      const p = join(dir, n);
      return statSync(p).isDirectory() ? archivos(p) : [p];
   });
};

const hallazgos = [];
const revisar = (archivo) => {
   const rel = relative(raiz, archivo);
   for (const [re, nombre] of PROHIBIDOS) if (re.test(rel)) hallazgos.push(`${rel}: nombre de archivo con ${nombre}`);
   if (!EXT_TEXTO.has(extname(archivo))) return;
   const lineas = readFileSync(archivo, "utf8").split("\n");
   lineas.forEach((linea, i) => {
      const donde = `${rel}:${i + 1}`;
      for (const [re, nombre] of PROHIBIDOS) if (re.test(linea)) hallazgos.push(`${donde}: ${nombre} → ${linea.trim().slice(0, 120)}`);
      // En CSS/JS compilado los porcentajes son de estilo; sólo se revisan en el copy y en el HTML generado.
      const esCopy = /\.(ts|tsx|astro|html)$/.test(archivo) && !/\.css$/.test(archivo);
      if (!esCopy) return;
      for (const m of linea.matchAll(RE_PCT)) {
         const valor = m[0].replace(/\s/g, "");
         const contexto = linea.slice(Math.max(0, m.index - 12), m.index);
         // Ignora porcentajes de estilos/atributos (width:50%, translate(-50%), etc.).
         if (/[:(\-,\[/_]\s*$|calc\(|translate|inset|width|height|top|left|right|bottom|size|w-\[|h-\[|-?\d+%\)/.test(contexto)) continue;
         if (!PERMITIDOS_PCT.has(valor)) hallazgos.push(`${donde}: cifra sin validar “${m[0]}” → ${linea.trim().slice(0, 120)}`);
      }
      for (const m of linea.matchAll(RE_MULT)) hallazgos.push(`${donde}: multiplicador sin validar “${m[0]}”`);
   });
};

for (const r of RUTAS_SRC) archivos(join(raiz, r)).forEach(revisar);
const dist = join(raiz, "dist");
const hayDist = existsSync(dist);
if (hayDist) archivos(dist).forEach(revisar);

// Aviso de privacidad (texto legal aprobado por HPE).
const env = existsSync(join(raiz, ".env")) ? readFileSync(join(raiz, ".env"), "utf8") : "";
const privacidad = process.env.PUBLIC_PRIVACY_URL || /^PUBLIC_PRIVACY_URL=(.+)$/m.exec(env)?.[1]?.trim();
if (!privacidad) hallazgos.push("PUBLIC_PRIVACY_URL vacío: falta el enlace al Aviso de privacidad aprobado por HPE.");

// Perfiles de speakers con valores genéricos (cargo, bio y foto pendientes de HPE, diap. 17).
const speakers = join(raiz, "src/data/speakers.ts");
if (existsSync(speakers) && /PERFILES_PRELIMINARES\s*=\s*true/.test(readFileSync(speakers, "utf8")))
   hallazgos.push("src/data/speakers.ts: perfiles de speakers con valores genéricos (PERFILES_PRELIMINARES = true); faltan cargo, bio y foto aprobados por HPE.");

if (hallazgos.length) {
   console.error(`✗ ${hallazgos.length} hallazgo(s) que bloquean la publicación:\n`);
   for (const h of hallazgos) console.error("  - " + h);
   process.exit(1);
}
console.log(`✓ Sin términos prohibidos ni cifras sin validar (${hayDist ? "src/ + dist/" : "sólo src/; corre npm run build para revisar dist/"}).`);
