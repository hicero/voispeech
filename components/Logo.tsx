type LogoProps = {
  className?: string;
  compact?: boolean;
};

export default function Logo({ className = "", compact = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={compact ? 28 : 34}
        height={compact ? 28 : 34}
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden
        className="shrink-0 text-navy"
      >
        {/* Speech bubble outline */}
        <path
          d="M18 4.5C10.544 4.5 4.5 9.82 4.5 16.4c0 3.55 1.78 6.72 4.58 8.82-.18 1.62-.72 3.28-1.72 4.68 2.2-.42 4.12-1.38 5.62-2.72 1.55.42 3.2.64 4.92.64 7.456 0 13.5-5.32 13.5-11.9S25.456 4.5 18 4.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Microphone capsule */}
        <rect
          x="14.2"
          y="11.2"
          width="7.6"
          height="9.2"
          rx="3.8"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12.8 17.6c0 2.87 2.33 5.2 5.2 5.2s5.2-2.33 5.2-5.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18 22.8v2.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-semibold tracking-tight text-navy ${
            compact ? "text-[0.95rem]" : "text-[1.05rem]"
          }`}
        >
          VoiSpeech
        </span>
        <span
          className={`mt-0.5 font-normal text-muted ${
            compact ? "text-[0.625rem]" : "text-[0.6875rem]"
          }`}
        >
          보이스피치
        </span>
      </span>
    </span>
  );
}
