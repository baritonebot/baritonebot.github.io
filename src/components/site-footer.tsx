import baritoneIcon from "@/assets/baritone-icon.png";
import { GITHUB_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src={baritoneIcon}
                alt="Baritone logo"
                width={28}
                height={28}
                loading="lazy"
                className="size-7 rounded-[6px]"
              />
              <span className="text-base font-semibold">Baritone</span>
            </div>
            <p className="mt-3 max-w-[44ch] text-sm text-muted-foreground">
              An open-source pathfinding and automation mod for Minecraft. Made for players, by
              players.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://discord.gg/s6fRBAUpmr"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Discord
            </a>
          </div>
        </div>
        <p className="mt-10 font-mono text-[11px] text-muted-foreground">
          Not affiliated with Mojang or Microsoft. Baritone is a third-party mod.
        </p>
      </div>
    </footer>
  );
}
