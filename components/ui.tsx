import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

import { LUCIDE, type IconName } from "@/lib/lucide";

export type { IconName };

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

/** Design-system Avatar: initials in a neutral circle. */
export function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className="tw-avatar" style={{ width: size, height: size }}>
      <span className="tw-avatar__initials" aria-label={name} style={{ fontSize: Math.round(size * 0.375) }}>
        {initials}
      </span>
    </span>
  );
}
