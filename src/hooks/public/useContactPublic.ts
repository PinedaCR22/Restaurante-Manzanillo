import { useEffect, useState } from "react";
import { ContactPublicService } from "../../services/public/contact-public.service"; // ajusta si tu archivo tiene otro nombre
import type { ContactItem } from "../../types/contact/contact";

export function useContactPublic(kind?: string) {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await ContactPublicService.list(kind);
        if (isMounted) {
          setContacts(data);
        }
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información de contacto.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [kind]);

  return { contacts, loading, error };
}
