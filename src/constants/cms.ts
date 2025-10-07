export const CORE_SECTIONS = [
  { key: 'mudecoop', label: 'Mudecoop' },
  { key: 'turismo', label: 'Turismo' },
] as const;

export type CoreSectionKey = (typeof CORE_SECTIONS)[number]['key'];
export const CORE_KEYS = CORE_SECTIONS.map(s => s.key) as CoreSectionKey[];
export const LABEL_BY_KEY: Record<CoreSectionKey, string> = {
  mudecoop: 'Mudecoop',
  turismo: 'Turismo',
};
