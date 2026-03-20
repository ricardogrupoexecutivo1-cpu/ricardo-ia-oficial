"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chat" },
  { label: "Planos", href: "/planos" },
  { label: "Explorar", href: "/explorar" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const shouldHide =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/api") ||
    pathname?.startsWith("/_next");

  if (shouldHide) {
    return null;
  }

  return (
    <nav className="aurora-global-nav" aria-label="Navegação principal do app">
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={isActive ? "aurora-global-nav__link is-active" : "aurora-global-nav__link"}
          >
            <span className="aurora-global-nav__icon" aria-hidden="true">
              {item.label === "Home" && "⌂"}
              {item.label === "Chat" && "◉"}
              {item.label === "Planos" && "✦"}
              {item.label === "Explorar" && "◎"}
            </span>

            <span className="aurora-global-nav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}