import React from "react";
import Button from "./Button";

interface Props {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  children: React.ReactNode;
  submitting?: boolean;
}

export default function FormLayout({
  title,
  onSubmit,
  onCancel,
  children,
  submitting = false,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-[#0D784A] mb-2">{title}</h2>

      <div className="space-y-3">{children}</div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={submitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}
