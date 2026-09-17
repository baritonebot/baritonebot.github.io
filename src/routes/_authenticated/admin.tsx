import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatBytes, githubReleaseUrl, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Baritone" },
      { name: "description", content: "Traffic, download counts and build management." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin dashboard — Baritone" },
      { property: "og:description", content: "Internal dashboard for the Baritone site." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/admin" },
    ],
  }),
  component: AdminPage,
});

const LOADERS = ["Fabric", "Forge", "NeoForge"] as const;

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const roleQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      return Boolean(data);
    },
  });

  const isAdmin = roleQuery.data === true;

  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    enabled: isAdmin,
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const [views, clicks, recentViews, recentClicks] = await Promise.all([
        supabase.from("page_views").select("*", { count: "exact", head: true }),
        supabase.from("download_clicks").select("*", { count: "exact", head: true }),
        supabase.from("page_views").select("path, created_at").gte("created_at", since).limit(5000),
        supabase
          .from("download_clicks")
          .select("loader, mc_version, created_at")
          .gte("created_at", since)
          .limit(5000),
      ]);

      const byPath: Record<string, number> = {};
      for (const row of recentViews.data ?? []) byPath[row.path] = (byPath[row.path] ?? 0) + 1;
      const byLoader: Record<string, number> = {};
      for (const row of recentClicks.data ?? []) {
        const key = row.loader ?? "Unknown";
        byLoader[key] = (byLoader[key] ?? 0) + 1;
      }

      return {
        totalViews: views.count ?? 0,
        totalClicks: clicks.count ?? 0,
        views30: recentViews.data?.length ?? 0,
        clicks30: recentClicks.data?.length ?? 0,
        byPath: Object.entries(byPath).sort((a, b) => b[1] - a[1]),
        byLoader: Object.entries(byLoader).sort((a, b) => b[1] - a[1]),
      };
    },
  });

  const buildsQuery = useQuery({
    queryKey: ["admin-builds"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from("builds")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const [loader, setLoader] = useState<string>("Fabric");
  const [mcVersion, setMcVersion] = useState("1.21.4");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
    setUploading(true);
    setStatus(null);

    const fileName =
      loader === "Fabric" ? `baritone-api-fabric-${mcVersion}.jar` : file.name;

    const { error: uploadError } = await supabase.storage
      .from("downloads")
      .upload(fileName, file, { upsert: true, contentType: "application/java-archive" });

    if (uploadError) {
      setUploading(false);
      setStatus(uploadError.message);
      return;
    }

    await supabase
      .from("builds")
      .update({ is_latest: false })
      .eq("loader", loader)
      .eq("is_latest", true);

    const { error: insertError } = await supabase.from("builds").insert({
      loader,
      mc_version: mcVersion,
      file_name: fileName,
      // Static hosting (GitHub Pages) can't stream uploaded jars, so every
      // build links to the matching official GitHub release asset.
      download_url: githubReleaseUrl(loader as "Fabric" | "Forge" | "NeoForge", mcVersion),
      file_size_bytes: file.size,
      is_latest: true,
    });

    setUploading(false);
    if (insertError) return setStatus(insertError.message);
    setStatus(`Uploaded ${fileName}.`);
    setFile(null);
    void queryClient.invalidateQueries({ queryKey: ["admin-builds"] });
    void queryClient.invalidateQueries({ queryKey: ["builds", "latest"] });
  };

  const toggleLatest = async (id: string, next: boolean) => {
    await supabase.from("builds").update({ is_latest: next }).eq("id", id);
    void queryClient.invalidateQueries({ queryKey: ["admin-builds"] });
    void queryClient.invalidateQueries({ queryKey: ["builds", "latest"] });
  };

  const removeBuild = async (id: string) => {
    await supabase.from("builds").delete().eq("id", id);
    void queryClient.invalidateQueries({ queryKey: ["admin-builds"] });
    void queryClient.invalidateQueries({ queryKey: ["builds", "latest"] });
  };

  if (roleQuery.isLoading) {
    return <p className="p-8 font-mono text-sm text-muted-foreground">Checking access…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-5 text-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">No dashboard access</h1>
          <p className="mt-2 max-w-[42ch] text-sm text-muted-foreground">
            This account isn't an administrator. Ask an existing admin to grant your account access.
          </p>
          <button
            onClick={signOut}
            className="mt-5 rounded-md border border-border px-4 py-2 font-mono text-xs text-muted-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const stats = statsQuery.data;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-[4px] bg-primary font-mono text-sm font-medium text-primary-foreground">
              B
            </span>
            <span className="text-base font-semibold">Dashboard</span>
          </div>
          <button
            onClick={signOut}
            className="rounded-md border border-border px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ["Visits (all time)", stats?.totalViews],
            ["Visits (30 days)", stats?.views30],
            ["Downloads (all time)", stats?.totalClicks],
            ["Downloads (30 days)", stats?.clicks30],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl bg-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 font-mono text-3xl text-primary-glow">
                {value === undefined ? "—" : value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-card p-5">
            <h2 className="text-base font-semibold">Top pages (30 days)</h2>
            <div className="mt-3 space-y-2 font-mono text-xs">
              {(stats?.byPath ?? []).slice(0, 8).map(([path, count]) => (
                <div key={path} className="flex justify-between border-b border-border py-2">
                  <span>{path}</span>
                  <span className="text-primary-glow">{count}</span>
                </div>
              ))}
              {stats && stats.byPath.length === 0 && (
                <p className="text-muted-foreground">No visits recorded yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-card p-5">
            <h2 className="text-base font-semibold">Downloads by loader (30 days)</h2>
            <div className="mt-3 space-y-2 font-mono text-xs">
              {(stats?.byLoader ?? []).map(([name, count]) => (
                <div key={name} className="flex justify-between border-b border-border py-2">
                  <span>{name}</span>
                  <span className="text-copper">{count}</span>
                </div>
              ))}
              {stats && stats.byLoader.length === 0 && (
                <p className="text-muted-foreground">No downloads recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-xl bg-card p-5">
          <h2 className="text-base font-semibold">Upload a build</h2>
          <form onSubmit={upload} className="mt-4 grid gap-3 sm:grid-cols-4">
            <select
              value={loader}
              onChange={(e) => setLoader(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm"
            >
              {LOADERS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              value={mcVersion}
              onChange={(e) => setMcVersion(e.target.value)}
              placeholder="1.21.4"
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm"
            />
            <input
              type="file"
              accept=".jar"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="rounded-md border border-input bg-background px-3 py-2 text-xs"
            />
            <button
              type="submit"
              disabled={!file || uploading}
              className="rounded-md bg-primary py-2.5 font-mono text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </form>
          {status && <p className="mt-3 font-mono text-xs text-copper">{status}</p>}
        </section>

        <section className="mt-6 rounded-xl bg-card p-5">
          <h2 className="text-base font-semibold">Builds</h2>
          <div className="mt-3 space-y-2">
            {(buildsQuery.data ?? []).map((build) => (
              <div
                key={build.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3 font-mono text-xs"
              >
                <div>
                  <p className="text-sm">
                    {build.loader} · {build.mc_version}
                  </p>
                  <p className="text-muted-foreground">
                    {build.file_name} · {formatBytes(build.file_size_bytes)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLatest(build.id, !build.is_latest)}
                    className={`rounded-md border border-border px-3 py-1.5 ${
                      build.is_latest ? "text-primary-glow" : "text-muted-foreground"
                    }`}
                  >
                    {build.is_latest ? "Latest" : "Mark latest"}
                  </button>
                  <button
                    onClick={() => removeBuild(build.id)}
                    className="rounded-md border border-border px-3 py-1.5 text-destructive"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {buildsQuery.data?.length === 0 && (
              <p className="font-mono text-xs text-muted-foreground">No builds yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
