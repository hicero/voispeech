import type { LucideIcon, LucideProps } from "lucide-react";

type UiIconProps = LucideProps & {
  icon: LucideIcon;
};

export default function UiIcon({
  icon: Icon,
  className = "",
  size = "1em",
  strokeWidth = 1.75,
  ...props
}: UiIconProps) {
  return (
    <Icon
      className={`ui-icon ${className}`.trim()}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden
      {...props}
    />
  );
}
