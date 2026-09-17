import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Build } from "@/lib/site";

/** Records one anonymous page view per mount. No personal data is stored. */
export function usePageView(path: string) {
  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      void supabase.from("page_views").insert({ path });
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [path]);
}

export async function trackDownload(build: Build) {
  const isFallback = build.id.startsWith("fallback-");
  await supabase.from("download_clicks").insert({
    build_id: isFallback ? null : build.id,
    loader: build.loader,
    mc_version: build.mc_version,
  });
}
