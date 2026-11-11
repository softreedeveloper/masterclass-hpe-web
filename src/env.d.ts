interface ImportMetaEnv {
   readonly PUBLIC_API_URL: string;
   readonly PUBLIC_PRIVACY_URL?: string;
   readonly PUBLIC_GTM_ID?: string;
}
interface ImportMeta {
   readonly env: ImportMetaEnv;
}
