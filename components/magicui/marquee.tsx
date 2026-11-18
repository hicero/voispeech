import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = ComponentProps<"div"> & {
  pauseOnHover?: boolean;
  reverse?: boolean;
  repeat?: number;
};

export default function Marquee({
  className,
  children,
  pauseOnHover = false,
  reverse = false,
  repeat = 2,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn("magic-marquee", pauseOnHover && "is-pause-on-hover", className)}
      {...props}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn("magic-marquee-set", reverse && "is-reverse")}
          aria-hidden={i > 0 ? true : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
