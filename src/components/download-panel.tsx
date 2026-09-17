import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown } from "lucide-react";
import { latestBuildsQuery, groupByVersion } from "@/lib/builds";
import { trackDownload } from "@/lib/analytics";
import { formatBytes, type Build } from "@/lib/site";

function LoaderCard({ build, primary }: { build: Build; primary?: boolean }) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-background/60 p-5 transition-colors hover:border-primary/50 hover:bg-accent/40">
      <div className="pointer-events-none absolute right-3 top-3 size-10 rounded-full bg-primary/10 blur-lg opacity-60 transition-opacity group-hover:opacity-100" />

      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary-glow">Loader</p>
      <h3 className="mt-1 text-xl font-semibold tracking-tight">{build.loader}</h3>

      <div className="mt-auto pt-5">
        <p className="mb-3 truncate font-mono text-[11px] text-muted-foreground">
          {build.file_name}
        </p>
        <div className="mb-4 flex justify-between font-mono text-[10px] uppercase text-muted-foreground">
          <span>Size</span>
          <span className="text-foreground/80">{formatBytes(build.file_size_bytes)}</span>
        </div>
        <a
          href={build.download_url}
          onClick={() => void trackDownload(build)}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            primary
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "border border-border bg-secondary text-secondary-foreground hover:border-primary/50 hover:text-primary-glow"
          }`}
        >
          <ArrowDown className="size-4" aria-hidden="true" />
          Download
        </a>
      </div>
    </div>
  );
}

/**
 * Split-panel downloads interface: version sidebar on the left, loader build
 * cards for the selected version on the right.
 */
export function DownloadPanel() {
  const { data: builds } = useQuery(latestBuildsQuery);
  const groups = groupByVersion(builds);
  const [selected, setSelected] = useState<string | null>(null);
  const active = groups.find((g) => g.version === selected) ?? groups[0];

  if (!active) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      <div className="flex flex-col md:flex-row">
        {/* Version sidebar */}
        <aside className="border-b border-border bg-background/50 p-5 md:w-60 md:shrink-0 md:border-b-0 md:border-r">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            Minecraft versions
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">Select a version to download</p>

          <nav className="mt-4 flex gap-1 overflow-x-auto pb-1 md:max-h-[460px] md:flex-col md:overflow-y-auto md:overflow-x-hidden md:pr-1">
            {groups.map((group, i) => {
              const isActive = group.version === active.version;
              return (
                <button
                  key={group.version}
                  type="button"
                  onClick={() => setSelected(group.version)}
                  aria-pressed={isActive}
                  className={`flex shrink-0 items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 font-mono text-sm transition-colors ${
                    isActive
                      ? "border-primary/40 bg-primary/10 text-primary-glow"
                      : "border-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <span>{group.version}</span>
                  {i === 0 ? (
                    <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-primary-glow">
                      Latest
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Loader cards */}
        <div
          key={active.version}
          className="flex-1 animate-[fade-in_0.3s_ease-out,slide-in-right_0.25s_ease-out] bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_60%)] p-6 sm:p-8"
        >
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Baritone <span className="text-primary-glow">v{active.version}</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Latest release for Minecraft {active.version}. Pick your mod loader — the file drops
              straight into your mods folder.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {active.builds.map((build, i) => (
              <LoaderCard key={build.id} build={build} primary={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
