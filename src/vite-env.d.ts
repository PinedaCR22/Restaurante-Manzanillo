/// <reference types="vite/client" />
// Extiende los tipos de Vite para tu variable
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
