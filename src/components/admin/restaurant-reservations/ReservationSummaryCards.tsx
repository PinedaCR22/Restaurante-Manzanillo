interface Summary {
  pending: number;
  confirmed: number;
  cancelled: number;
}

export function ReservationSummaryCards({ summary }: { summary: Summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {[
        {
          label: "Pendientes",
          count: summary.pending,
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          color: "text-yellow-700",
          sub: "Requieren atención",
        },
        {
          label: "Confirmadas",
          count: summary.confirmed,
          bg: "bg-green-50",
          border: "border-green-200",
          color: "text-green-700",
          sub: "Listas para el servicio",
        },
        {
          label: "Canceladas",
          count: summary.cancelled,
          bg: "bg-red-50",
          border: "border-red-200",
          color: "text-red-700",
          sub: "Este mes",
        },
      ].map((c, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl shadow-sm ${c.bg} border ${c.border} hover:shadow-md transition`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-medium ${c.color}`}>{c.label}</span>
            <span className={`${c.color} font-semibold text-xl`}>
              {c.count}
            </span>
          </div>
          <p className={`text-sm ${c.color.replace("700", "600")} mt-1`}>
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
