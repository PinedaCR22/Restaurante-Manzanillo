export function toBool(v: boolean | 0 | 1 | null | undefined): boolean {
  return v === true || v === 1;
}
