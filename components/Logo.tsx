type LogoProps = {
  className?: string;
  compact?: boolean;
};

export default function Logo({ className = "", compact = false }: LogoProps) {
  return (
    <span className={`site-logo inline-flex items-center gap-2.5 ${className}`}>
      {/* Decorative mark; parent link / wordmark provide the accessible name */}
      <img
        src="/brand/voispeech-mark.png"
        width={compact ? 32 : 36}
        height={compact ? 32 : 36}
        alt=""
        aria-hidden
        className="site-logo-mark shrink-0"
        draggable={false}
      />
      <span className="flex flex-col leading-none">
        <span className="site-logo-word font-semibold tracking-tight text-navy">
          VoiSpeech
        </span>
        <span className="site-logo-ko mt-0.5 font-normal text-muted">
          보이스피치
        </span>
      </span>
    </span>
  );
}
