import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ChevronDown } from "lucide-react";
import { latestBuildsQuery, groupByVersion } from "@/lib/builds";
import { trackDownload } from "@/lib/analytics";
import { formatBytes, type Build } from "@/lib/site";

function BuildRow({ build }: { build: Build }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 sm:px-5">
      <div className="flex items-center gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent font-mono text-sm text-accent-foreground">
          {build.loader.slice(0, 1)}
        </span>
        <div>
          <p className="text-sm font-semibold">{build.loader}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{build.file_name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
          {formatBytes(build.file_size_bytes)}
        </span>
        <a
          href={build.download_url}
          onClick={() => void trackDownload(build)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary py-2 pl-2 pr-3 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowDown className="size-4" aria-hidden="true" />
          Download
        </a>
      </div>
    </div>
  );
}

/**
 * Lists the latest build per mod loader for every Minecraft 1.21.x release.
 * `only` limits the list to the newest N versions (used on the landing page).
 */
export function DownloadList({ only }: { only?: number }) {
  const { data: builds } = useQuery(latestBuildsQuery);
  const groups = groupByVersion(builds);
  const shown = only ? groups.slice(0, only) : groups;
  const [open, setOpen] = useState<string | null>(shown[0]?.version ?? null);

  return (
    <div className="space-y-3">
      {shown.map((group, i) => {
        const isOpen = open === group.version;
        return (
          <section key={group.version} className="overflow-hidden rounded-xl bg-card">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : group.version)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold">Minecraft {group.version}</span>
                {i === 0 ? (
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-foreground">
                    Newest
                  </span>
                ) : null}
              </span>
              <span className="flex items-center gap-3">
                <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
                  {group.builds.length} builds
                </span>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            {isOpen ? (
              <div className="divide-y divide-border border-t border-border">
                {group.builds.map((build) => (
                  <BuildRow key={build.id} build={build} />
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
