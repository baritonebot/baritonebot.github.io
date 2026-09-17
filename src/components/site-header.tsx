import { Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";

import baritoneIcon from "@/assets/baritone-icon.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/download", label: "Download" },
  { to: "/guide", label: "Guide" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={baritoneIcon}
            alt="Baritone logo"
            width={28}
            height={28}
            className="size-7 rounded-[6px]"
          />
          <span className="text-base font-semibold tracking-tight">Baritone</span>
        </Link>

        <nav className="hidden items-center gap-1 font-mono text-xs text-muted-foreground sm:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-primary/10 hover:text-foreground"
              activeProps={{
                className:
                  "bg-primary/15 text-foreground ring-1 ring-primary/30",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/download"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary py-2 pl-2 pr-3 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowDown className="size-4" aria-hidden="true" />
          Get 1.21.x
        </Link>
      </div>
    </header>
  );
}
