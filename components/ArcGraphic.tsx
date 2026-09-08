type ArcGraphicProps = {
  className?: string;
};

/** Soft concentric arcs matching the coaching report cover. */
export default function ArcGraphic({ className = "" }: ArcGraphicProps) {
  return (
    <svg
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M70 340 C70 175 175 70 210 70 C245 70 350 175 350 340"
        stroke="#B8CDE0"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M100 340 C100 195 185 100 210 100 C235 100 320 195 320 340"
        stroke="#B8CDE0"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M130 340 C130 215 195 130 210 130 C225 130 290 215 290 340"
        stroke="#B8CDE0"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M160 340 C160 235 200 160 210 160 C220 160 260 235 260 340"
        stroke="#B8CDE0"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Soft S-curve extension on outer right like cover */}
      <path
        d="M350 340 C358 355 352 370 340 378"
        stroke="#B8CDE0"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.65"
      />
      <circle cx="210" cy="160" r="3.5" fill="#B8CDE0" />
    </svg>
  );
}
