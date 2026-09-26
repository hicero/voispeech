type LogoProps = {
  className?: string;
  compact?: boolean;
};

export default function Logo({ className = "", compact = false }: LogoProps) {
  const size = compact ? 28 : 36;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Decorative mark; parent link / wordmark provide the accessible name */}
      <img
        src="/brand/voispeech-mark.png"
        width={size}
        height={size}
        alt=""
        aria-hidden
        className="shrink-0"
        draggable={false}
      />
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
