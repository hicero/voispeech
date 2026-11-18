import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "border-line bg-page text-navy-soft",
        free: "border-transparent bg-[color-mix(in_srgb,var(--color-sky)_28%,#fff)] text-navy-soft",
        locked:
          "border-[#C4A36A] bg-[color-mix(in_srgb,#C4A36A_16%,#fff)] text-[#7A5A2E]",
        open: "border-line bg-white text-navy-soft",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
