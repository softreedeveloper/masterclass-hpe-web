export type Rol = "ADMIN" | "PARTICIPANTE";
export type Puesto = "preventa" | "comercial" | "arquitecto" | "alianzas" | "consultor" | "directivo";
export type Canal = "direct" | "distribuidor";
export type Idioma = "es" | "en";

export interface Usuario {
   id_user: number;
   email: string;
   activo: boolean;
   email_verificado_at: string | null;
   last_login_at: string | null;
   created_at: string;
   rol: Rol;
   nombre_completo: string | null;
   empresa: string | null;
   puesto: Puesto | null;
   canal_invitacion: Canal | null;
   contacto_referido: string | null;
   telefono: string | null;
   pais: string | null;
   acepta_compromiso: boolean;
   idioma: Idioma;
}

export interface ParticipanteFila extends Usuario {
   total_clases: number;
   clases: string | null;
}

export interface Curso {
   id_course: number;
   titulo: string;
   descripcion: string | null;
   numero_sesion: number | null;
   fecha_inicio: string | null;
   duracion_min: number;
   url_sesion: string | null;
   cupo: number | null;
   activo: boolean;
   inscritos: number;
}

export interface Inscripcion {
   id_enrollment: number;
   estatus: "INSCRITO" | "CANCELADO";
   fecha_inscripcion: string;
   id_course: number;
   titulo: string;
   descripcion: string | null;
   numero_sesion: number | null;
   fecha_inicio: string | null;
   duracion_min: number;
   url_sesion: string | null;
   activo: boolean;
}

export interface InscritoCurso {
   id_enrollment: number;
   estatus: "INSCRITO" | "CANCELADO";
   fecha_inscripcion: string;
   id_user: number;
   email: string;
   activo: boolean;
   nombre_completo: string | null;
   empresa: string | null;
   puesto: Puesto | null;
}

export interface Pagina<T> {
   items: T[];
   page: number;
   pageSize: number;
   total: number;
   totalPages: number;
}

export interface Resumen {
   participantes: number;
   verificados: number;
   nuevos_7d: number;
   clases_activas: number;
   inscripciones: number;
}
