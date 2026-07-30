import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./PillLink.module.css";

type PillLinkVariant = "primary" | "secondary";

interface PillLinkSharedProps {
  variant?: PillLinkVariant;
  className?: string;
  children: ReactNode;
}

interface PillLinkAsLink extends PillLinkSharedProps {
  href: string;
  /** External links render a plain `<a target="_blank">`; internal ones use next/link. */
  external?: boolean;
}

interface PillLinkAsSpan extends PillLinkSharedProps {
  href?: undefined;
}

type PillLinkProps = PillLinkAsLink | PillLinkAsSpan;

/** Shared pill-shaped link/badge — the site's one CTA/tag recipe. */
export function PillLink(props: PillLinkProps) {
  const { variant = "primary", className, children } = props;
  const classes = [styles.pill, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  if (!props.href) {
    return <span className={classes}>{children}</span>;
  }

  if (props.external) {
    return (
      <a
        className={classes}
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={props.href}>
      {children}
    </Link>
  );
}
