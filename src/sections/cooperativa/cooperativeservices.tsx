// src/sections/home/CoperativesServices.tsx
import { memo, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

export type CoopItem = { id: string; name: string; image?: string };

type Props = {
  title?: string;
  titleClassName?: string;
  items?: CoopItem[];
  onSelectItem?: (id: string) => void;
};

const containerV: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
};

const cardV: Variants = {
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const GLOBAL_FALLBACK =
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop";

const DEFAULT: CoopItem[] = [
  { id: "reforestacion", name: "REFORESTACIÓN", image: "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/487580626_1104655321702106_1892592701440093431_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=GLR2_pe0IP4Q7kNvwF7xgMI&_nc_oc=AdlNn_7XmldTMGoYfeVZSiacGiQrkDl-2-1g2unpIA1p5XI3UNeEmmNog6I8Zi0JpI0&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=KtQwCv5FhXcUuS13GrDRNQ&oh=00_AfjzyzxkCZ9qYHOLpC66-fKiNRi3tOWQMsZ5d7-RbIR6PQ&oe=6912A789" },
  { id: "mudecoop-jr", name: "MUDECOOP JR", image: "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/547408939_1240869241414046_3173049238036513901_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=plBxmRDEB7YQ7kNvwFRl5VN&_nc_oc=Admeysa42rFsLHRKO-1x6WrwCQiYoIjqVVqlVXGs3GzrebyQBIcIxlqsDTx3T1pgEoM&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=xDcckxTXf2vck0oLa51QSA&oh=00_AfjOK8IhpCNTqoS9IVvSSSQdoAvdmGPwsHO3LbXFyFvdgA&oe=69129B6B" },
  { id: "tour-de-manglar", name: "TOUR DE MANGLAR", image: "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/494197683_1128372019330436_3311475259952933669_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=XWgyauz4gfQQ7kNvwEKc0uE&_nc_oc=AdkikZ1tX9PpWl-VsECC3BnjrHrA4XpJQCIrwDv10PRjlIOiGQ2YqAA7pXj379xb9ys&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=Wdgm8IVDnQewdECU-PLX0w&oh=00_AfgsLj2qzuzRKIkzlXBnmI3YWriDehSb0OIItEyFAPfhwQ&oe=6912C4B2" },
  { id: "hist-mudecoop", name: "HIST. MUDECOOP", image: "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/524322548_1197563492411288_8905657637842777964_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dIajkkvGKxcQ7kNvwFuMCa9&_nc_oc=AdmsddXHbT3YDIAHvyVebdLlXzYdxDsDHLKJia6CpEfmp4Aspt3crfYJlhpBWOqI8cE&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=RTjO5Vzn2CBiS1JwtJ9qOQ&oh=00_AfgFLtvsWsV9AKealNQ4YSxyJ9OBC0XfhUiTdfhpdPFVOQ&oe=691294C2" },
  { id: "hist-rest-flotante", name: "HIST. REST FLOTANTE", image: "https://scontent.fsjo14-1.fna.fbcdn.net/v/t39.30808-6/487565415_1100732205427751_4199912478517104809_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=jNlWC57yvrMQ7kNvwHJY6jK&_nc_oc=AdmKSXrSd443veXPuC9_W-kT-i08YZlyq3p6hxFvtgh0-cI2oXjXhs6QhCtfHmxl79A&_nc_zt=23&_nc_ht=scontent.fsjo14-1.fna&_nc_gid=1eMTaRnCpZaGoEZdI4TVqg&oh=00_AfhIz_NOT-hawaETftTWUizoOPaqfrIGQZcJ1JJNUfn4og&oe=6912C3BC" },
];

function clsx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function layoutClasses(index: number, lastIndex: number) {
  const base =
    "group rounded-xl border border-white bg-white shadow-sm overflow-hidden transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 " +
    "dark:bg-[var(--card)] dark:border-[color-mix(in_srgb,var(--fg)_15%,transparent)] dark:focus-visible:ring-[color-mix(in_srgb,var(--fg)_40%,transparent)]";

  const mobile = index === lastIndex ? "col-span-2" : "col-span-1";

  let desktop = "md:col-span-2";
  if (index === 0) desktop += " md:col-start-1";
  else if (index === 1) desktop += " md:col-start-3";
  else if (index === 2) desktop += " md:col-start-5";
  else if (index === 3) desktop += " md:col-start-2";
  else if (index === 4) desktop += " md:col-start-4";

  return clsx(base, mobile, desktop, "w-full justify-self-center");
}

function aspectClasses(index: number, lastIndex: number) {
  return clsx(
    "w-full overflow-hidden bg-gray-100 dark:bg-[color-mix(in_srgb,var(--card)_80%,black_10%)]",
    index === lastIndex ? "aspect-[16/7] md:aspect-[5/3]" : "aspect-[5/3]"
  );
}

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== GLOBAL_FALLBACK) {
    img.src = GLOBAL_FALLBACK;
    img.onerror = null;
  }
}

function CoperativesServices({
  title = "¡Descubre más sobre nosotras!",
  titleClassName,
  items,
  onSelectItem,
}: Props) {
  const data = useMemo(() => {
    const base = items && items.length ? items : DEFAULT;
    return base.map((it, i) => ({
      ...it,
      image: it.image || DEFAULT[i % DEFAULT.length].image,
    }));
  }, [items]);

  const navigate = useNavigate();
  const lastIndex = data.length - 1;

  const handleClick = (id: string) => {
    onSelectItem?.(id);
    navigate(`/cooperativa/${id}`);
  };

  return (
    <section id="cooperativa" className="w-full bg-app text-app">
      {/* HEADER */}
      <div className="px-3 md:px-6">
        <div
          className="
            mx-auto rounded-xl bg-card shadow-sm backdrop-blur px-4 py-4 text-center
            dark:bg-[color-mix(in_srgb,var(--card)_90%,black_10%)]
          "
        >
          <h2
            className={clsx(
              "text-xl md:text-2xl font-extrabold tracking-wide text-app",
              titleClassName
            )}
          >
            {title}
          </h2>
          <div
            className="
              mt-3 h-[6px] w-full
              bg-gradient-to-r from-[#50ABD7] via-[#FBB517] to-[#0D784A]
              dark:from-[#56B5FF] dark:via-[#FFD75E] dark:to-[#2ECC71]
            "
          />
        </div>
      </div>

      {/* GRID */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate="show"
        className="mt-6 w-full px-3 md:px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-6 gap-5 md:gap-7">
          {data.map((it, i) => (
            <motion.button
              key={it.id}
              type="button"
              variants={cardV}
              onClick={() => handleClick(it.id)}
              aria-label={`Abrir ${it.name}`}
              className={layoutClasses(i, lastIndex)}
            >
              <div className={aspectClasses(i, lastIndex)}>
                <img
                  src={it.image!}
                  alt={it.name}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleImgError}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-2 md:p-3 border-t border-white dark:border-[color-mix(in_srgb,var(--fg)_15%,transparent)]">
                <span
                  className="
                    block rounded-md px-3 py-1 text-center text-[12px] md:text-sm font-semibold uppercase tracking-wide text-white
                    bg-[#50ABD7] group-hover:bg-[#3f98c1]
                    dark:bg-[#56B5FF] dark:group-hover:bg-[#3E9BE0]
                  "
                >
                  {it.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default memo(CoperativesServices);
