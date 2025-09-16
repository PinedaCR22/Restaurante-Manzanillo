import React from "react";

/**
 * DonCangrejo.tsx — Mascota del Restaurante Flotante (SVG + React)
 * Incluye clases para animar ojos (blink) y pinzas (pinch).
 */

export const DON_COLORS = {
  shell: "#E24A3B",
  shellDark: "#C93E31",
  highlight: "#EF6B5A",
  eye: "#1F2937",
  white: "#FFFFFF",
  wood: "#443314", // MUDECOOP
  sea: "#0D784A",  // acento
  sand: "#FBE8D2",
};

export type DonMood = "happy" | "helpful" | "thinking" | "celebrate" | "warning" | "sleep";

export type DonCangrejoProps = {
  mood?: DonMood;
  size?: number;          // px
  cap?: boolean;          // gorra de capitán
  mustache?: boolean;     // bigote (Don)
  title?: string;
  colors?: Partial<typeof DON_COLORS>;
  className?: string;
};

const Eye = ({
  x,
  y,
  mood = "happy",
  colors = DON_COLORS,
  className = "",
}: {
  x: number; y: number; mood?: DonMood; colors?: typeof DON_COLORS; className?: string;
}) => {
  const pupil = { r: 2.2, fill: colors.eye };
  switch (mood) {
    case "sleep":
      return (
        <g className={className}>
          <path d={`M${x - 8} ${y} q 8 4 16 0`} stroke={colors.eye} strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      );
    case "thinking":
      return (
        <g className={className}>
          <circle cx={x} cy={y - 1} r={pupil.r} fill={pupil.fill} />
        </g>
      );
    case "warning":
      return (
        <g className={className}>
          <circle cx={x} cy={y} r={3.2} fill={colors.white} />
          <circle cx={x} cy={y} r={pupil.r} fill={pupil.fill} />
        </g>
      );
    default:
      return (
        <g className={className}>
          <circle cx={x} cy={y} r={3.2} fill={colors.white} />
          <circle cx={x} cy={y} r={pupil.r} fill={pupil.fill} />
        </g>
      );
  }
};

const Mouth = ({ mood = "happy" }: { mood?: DonMood }) => {
  switch (mood) {
    case "helpful":
      return <path d="M52 78 q 12 10 24 0" stroke="#3a120a" strokeWidth={3} fill="none" strokeLinecap="round" />;
    case "thinking":
      return <path d="M56 78 q 8 -4 16 0" stroke="#3a120a" strokeWidth={3} fill="none" strokeLinecap="round" />;
    case "celebrate":
      return <path d="M50 76 q 14 14 28 0" stroke="#3a120a" strokeWidth={3} fill="none" strokeLinecap="round" />;
    case "warning":
      return <path d="M58 80 h20" stroke="#3a120a" strokeWidth={3} fill="none" strokeLinecap="round" />;
    case "sleep":
      return <path d="M58 82 q 10 2 20 0" stroke="#3a120a" strokeWidth={3} fill="none" strokeLinecap="round" />;
    default:
      return <path d="M54 80 q 10 6 20 0" stroke="#3a120a" strokeWidth={3} fill="none" strokeLinecap="round" />;
  }
};

const Cap = ({ colors = DON_COLORS }: { colors?: typeof DON_COLORS }) => (
  <g>
    <path d="M40 36 q 24 -18 48 0 l -4 6 q -20 -8 -40 0 z" fill={colors.sea} opacity={0.92} />
    <rect x="45" y="41" width="38" height="6" rx="3" fill={colors.wood} opacity={0.9} />
  </g>
);

const Mustache = ({ colors = DON_COLORS }: { colors?: typeof DON_COLORS }) => (
  <g>
    <path d="M52 86 q 6 -6 12 0" stroke={colors.wood} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M64 86 q 6 -6 12 0" stroke={colors.wood} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);

export const DonCangrejoLogoMark: React.FC<{
  size?: number;
  className?: string;
  title?: string;
  colors?: Partial<typeof DON_COLORS>;
}> = ({ size = 44, className, title = "Don Cangrejo", colors }) => {
  const C = { ...DON_COLORS, ...colors };
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <circle cx="64" cy="64" r="60" fill={C.sand} stroke={C.sea} strokeWidth={6} />
      <path d="M36 56 q 12 -22 32 -12 q 18 8 24 26 q -22 10 -40 0 q -10 -6 -16 -14 z" fill={C.shell} stroke={C.shellDark} strokeWidth={2}/>
      <text x="66" y="86" fontSize="40" fontWeight="800" fill={C.wood} fontFamily="ui-sans-serif, system-ui">D</text>
    </svg>
  );
};

export const DonCangrejo: React.FC<DonCangrejoProps> = ({
  mood = "happy",
  size = 160,
  cap = true,
  mustache = true,
  title = "Don Cangrejo — Mascota",
  colors,
  className,
}) => {
  const C = { ...DON_COLORS, ...colors };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <ellipse cx="64" cy="112" rx="34" ry="6" fill="#000" opacity={0.08} />
      <ellipse cx="64" cy="70" rx="34" ry="26" fill={C.shell} />
      <ellipse cx="64" cy="64" rx="22" ry="10" fill={C.highlight} opacity={0.9} />

      {/* tallos */}
      <g stroke={C.shellDark} strokeWidth={3} strokeLinecap="round">
        <path d="M48 56 q 2 -8 10 -10" fill="none" />
        <path d="M80 56 q -2 -8 -10 -10" fill="none" />
      </g>

      {/* ojos con parpadeo */}
      <Eye x={50} y={46} mood={mood} colors={C} className="animate-crab-blink" />
      <Eye x={78} y={46} mood={mood} colors={C} className="animate-crab-blink" />

      {/* boca y bigote */}
      <Mouth mood={mood} />
      {mustache && <Mustache colors={C} />}

      {/* patas */}
      <g stroke={C.shellDark} strokeWidth={4} strokeLinecap="round">
        <path d="M34 76 l -12 8" />
        <path d="M36 86 l -10 10" />
        <path d="M94 76 l 12 8" />
        <path d="M92 86 l 10 10" />
      </g>

      {/* pinzas con “pinch” */}
      <path className="animate-claw-pinch" d="M26 52c-6-6-8-14-5-19 6 0 12 6 14 12-4 2-7 4-9 7z" fill={C.shell} stroke={C.shellDark} strokeWidth={2} />
      <path className="animate-claw-pinch" d="M102 52c6-6 8-14 5-19-6 0-12 6-14 12 4 2 7 4 9 7z" fill={C.shell} stroke={C.shellDark} strokeWidth={2} />

      {cap && <Cap colors={C} />}

      {mood === "celebrate" && (
        <g>
          <circle cx="20" cy="24" r="3" fill={C.sea} />
          <circle cx="110" cy="26" r="3" fill={C.sea} />
          <path d="M16 20 l6 6 M106 22 l6 6" stroke={C.wood} strokeWidth={2} />
        </g>
      )}
      {mood === "warning" && (
        <g>
          <path d="M64 24 l10 20 h-20 z" fill={C.shell} />
          <rect x="62" y="40" width="4" height="8" fill={C.white} />
        </g>
      )}
    </svg>
  );
};

export default DonCangrejo;
