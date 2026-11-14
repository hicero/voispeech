type LogoProps = {
  className?: string;
  compact?: boolean;
};

export default function Logo({ className = "", compact = false }: LogoProps) {
  const size = compact ? 34 : 36;
  return (
    <span className={`site-logo ${className}`}>
      {/* Decorative mark; parent link / wordmark provide the accessible name */}
      <img
        src="/brand/voispeech-mark.png"
        width={size}
        height={size}
        alt=""
        aria-hidden
        className="site-logo-mark"
        draggable={false}
      />
      <span className="site-logo-text">
        <span className="site-logo-word">
          VoiSpeech
        </span>
        <span className="site-logo-ko">
          보이스피치
        </span>
      </span>
    </span>
  );
}
