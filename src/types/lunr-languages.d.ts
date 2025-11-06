// Tipos mínimos para que TypeScript no se queje de lunr-languages
declare module "lunr-languages/lunr.stemmer.support" {
  const plugin: (lunr: any) => void;
  export default plugin;
}

declare module "lunr-languages/lunr.es" {
  const plugin: (lunr: any) => void;
  export default plugin;
}
