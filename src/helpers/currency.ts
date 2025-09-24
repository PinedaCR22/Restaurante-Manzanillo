export const currency = (v: string | number, code = "CRC") =>
  new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: code,
    currencyDisplay: "symbol", // asegura ₡ en vez de "CRC"/"USD"
  }).format(Number(v ?? 0));
