import { useId, type ComponentProps, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils/utils";

const BRAND_NAME = "MingleMart";

const logoVariants = cva(
  "group/logo inline-flex shrink-0 items-center align-middle select-none",
  {
    variants: {
      size: {
        sm: "gap-1.5",
        md: "gap-2",
        lg: "gap-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const logoMarkVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "size-6",
      md: "size-8",
      lg: "size-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const logoWordmarkVariants = cva(
  "font-heading leading-none font-extrabold tracking-[-0.02em] whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "text-base",
        md: "text-xl",
        lg: "text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/**
 * Two mingling rings rising out of a shopping bag: "Mingle" + "Mart".
 * Drawn before the bag so the bag occludes their lower halves and they read
 * as a double-arch handle. Geometry is identical across tones so the mark
 * keeps the same optical weight everywhere.
 */
function LogoGlyph({ paint }: Readonly<{ paint: string }>): ReactNode {
  return (
    <>
      <g fill="none" stroke={paint} strokeWidth="2.2">
        <circle cx="13.4" cy="12.1" r="4" />
        <circle cx="18.6" cy="12.1" r="4" />
      </g>
      <rect x="7.4" y="13.4" width="17.2" height="11" rx="3.2" fill={paint} />
    </>
  )
};

type LogoMarkProps = Omit<ComponentProps<"svg">, "children"> & VariantProps<typeof logoMarkVariants> & {
  tone?: "brand" | "mono"
  label?: string
};

export function LogoMark({
  className,
  size,
  tone = "brand",
  label,
  ...props
}: Readonly<LogoMarkProps>) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  const gradientId = `mm-logo-gradient-${uid}`
  const maskId = `mm-logo-mask-${uid}`
  const isDecorative = !label

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      focusable="false"
      role={isDecorative ? undefined : "img"}
      aria-hidden={isDecorative || undefined}
      aria-label={label}
      data-slot="logo-mark"
      className={cn(logoMarkVariants({ size }), className)}
      {...props}
    >
      {tone === "brand" ? (
        <>
          <defs>
            <linearGradient
              id={gradientId}
              x1="0"
              y1="0"
              x2="32"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="var(--brand-1)" />
              <stop offset="52%" stopColor="var(--brand-2)" />
              <stop offset="100%" stopColor="var(--brand-3)" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
          <LogoGlyph paint="#ffffff" />
        </>
      ) : (
        <>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="32"
            height="32"
          >
            <rect width="32" height="32" rx="9" fill="#ffffff" />
            <LogoGlyph paint="#000000" />
          </mask>
          <rect
            width="32"
            height="32"
            rx="9"
            fill="currentColor"
            mask={`url(#${maskId})`}
          />
        </>
      )}
    </svg>
  );
};

type LogoProps = Omit<ComponentProps<"span">, "children"> & VariantProps<typeof logoVariants> & {
  variant?: "full" | "mark" | "wordmark"
  tone?: "brand" | "mono"
  isAuthenticated?: boolean
  to?: string
};

/**
 * Where the brand lockup points.
 *
 * A role no longer implies a URL now that signed-in prefixes carry a
 * `publicUserId`, so authenticated shells pass their own `to`; this is only the
 * visitor fallback.
 */
function homeHref() {
  return "/"
};

function Logo({
  className,
  size = "md",
  variant = "full",
  tone = "brand",
  isAuthenticated,
  to,
  ...props
}: Readonly<LogoProps>) {
  const showMark = variant !== "wordmark"
  const showWordmark = variant !== "mark"

  const isLinked = to !== undefined || isAuthenticated !== undefined
  
  const content = (
    <span
      data-slot="logo"
      className={cn(logoVariants({ size }), className)}
      {...props}
    >
      {showMark && (
        <LogoMark
          size={size}
          tone={tone}
          label={showWordmark ? undefined : BRAND_NAME}
          className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover/logo:-translate-y-0.5"
        />
      )}
      {showWordmark && (
        <span className={cn(logoWordmarkVariants({ size }))}>
          <span className={tone === "brand" ? "text-foreground" : undefined}>
            Mingle
          </span>
          <span
            className={
              tone === "brand"
                ? "bg-[linear-gradient(100deg,var(--brand-2),var(--brand-3))] bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-foreground"
                : undefined
            }
          >
            Mart
          </span>
        </span>
      )}
    </span>
  )

  if (!isLinked) {
    return content
  }

  return (
    <Link
      to={to ?? homeHref()}
      className="inline-flex min-h-11 shrink-0 items-center rounded-md px-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      {content}
    </Link>
  )
};

export default Logo;
