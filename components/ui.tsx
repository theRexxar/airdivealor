import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

/** Lucide glyph code points from the design system's icon font (ds/lucide.woff2). */
const LUCIDE = {
  "arrow-left": 57416,
  "arrow-right": 57417,
  "chevron-down": 57453,
  "chevron-right": 57455,
  "circle-check": 57894,
  "external-link": 57529,
  globe: 57576,
  instagram: 57594,
  link: 57602,
  mail: 57615,
  menu: 57621,
  "message-circle": 57622,
  phone: 57651,
  quote: 57913,
  x: 57778,
} as const;

export type IconName = keyof typeof LUCIDE;

export function Icon({ name, size = 24, style, className }: { name: IconName; size?: number; style?: CSSProperties; className?: string }) {
  return (
    <i className={className ? `tw-icon ${className}` : "tw-icon"} style={{ fontSize: size, width: size, height: size, ...style }} aria-hidden="true">
      {String.fromCodePoint(LUCIDE[name])}
    </i>
  );
}

type Size = "xlarge" | "large" | "medium" | "small";
const BTN_ICON: Record<Size, number> = { xlarge: 20, large: 20, medium: 18, small: 18 };

interface BtnOwn {
  variant?: "primary" | "secondary";
  size?: Size;
  icon?: IconName;
  iconPosition?: "prefix" | "suffix";
  /** Round icon-only button. Pass an aria-label. */
  iconOnly?: boolean;
  children?: ReactNode;
}

function btnParts({ variant = "primary", size = "medium", icon, iconPosition = "prefix", iconOnly, children }: BtnOwn) {
  const className = ["tw-btn", `tw-btn--${variant}`, `tw-btn--${size}`, iconOnly && "tw-btn--icon tw-btn--rounded"].filter(Boolean).join(" ");
  const ic = icon ? <Icon name={icon} size={BTN_ICON[size]} /> : null;
  const content = (
    <>
      {iconPosition === "prefix" && ic}
      {!iconOnly && <span className="tw-btn__label">{children}</span>}
      {iconPosition === "suffix" && ic}
    </>
  );
  return { className, content };
}

export function Button({ variant, size, icon, iconPosition, iconOnly, children, ...rest }: BtnOwn & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, content } = btnParts({ variant, size, icon, iconPosition, iconOnly, children });
  return (
    <button type="button" className={className} {...rest}>
      {content}
    </button>
  );
}

/** A link that looks like a design-system button. External links open in a new tab. */
export function ButtonLink({ variant, size, icon, iconPosition, iconOnly, children, href, external, ...rest }: BtnOwn & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean }) {
  const { className, content } = btnParts({ variant, size, icon, iconPosition, iconOnly, children });
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
        {content}
      </a>
    );
  return (
    <Link href={href} className={className} {...rest}>
      {content}
    </Link>
  );
}

export function Eyebrow({ children, onDark }: { children: ReactNode; onDark?: boolean }) {
  return (
    <div className={onDark ? "eyebrow eyebrow--on-dark" : "eyebrow"}>
      <span className="eyebrow__rule" />
      {children}
    </div>
  );
}

export const Dot = ({ light }: { light?: boolean }) => <span aria-hidden="true" className={light ? "dot dot--light" : "dot"} />;
