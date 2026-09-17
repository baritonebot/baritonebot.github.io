import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FALLBACK_BUILDS, compareVersionsDesc, type Build } from "@/lib/site";

const LOADER_ORDER = ["Fabric", "Forge", "NeoForge"];

export function sortBuilds(builds: Build[]): Build[] {
  return [...builds].sort(
    (a, b) =>
      compareVersionsDesc(a.mc_version, b.mc_version) ||
      LOADER_ORDER.indexOf(a.loader) - LOADER_ORDER.indexOf(b.loader),
  );
}

/** Groups builds by Minecraft version, newest version first. */
export function groupByVersion(builds: Build[]): Array<{ version: string; builds: Build[] }> {
  const map = new Map<string, Build[]>();
  for (const build of sortBuilds(builds)) {
    const list = map.get(build.mc_version);
    if (list) list.push(build);
    else map.set(build.mc_version, [build]);
  }
  return [...map.entries()].map(([version, list]) => ({ version, builds: list }));
}

export const latestBuildsQuery = queryOptions({
  queryKey: ["builds", "latest"],
  queryFn: async (): Promise<Build[]> => {
    const { data, error } = await supabase
      .from("builds")
      .select("id, loader, mc_version, file_name, download_url, file_size_bytes, is_latest")
      .eq("is_latest", true)
      .like("mc_version", "1.21%");
    if (error || !data || data.length === 0) return FALLBACK_BUILDS;
    return sortBuilds(data);
  },
  initialData: FALLBACK_BUILDS,
  staleTime: 60_000,
});
