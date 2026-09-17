import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DownloadPanel } from "@/components/download-panel";
import { usePageView } from "@/lib/analytics";
import { SITE_URL, GITHUB_RELEASES_URL } from "@/lib/site";

const TITLE = "Download Baritone for Minecraft 1.21 – 1.21.11 — Fabric, Forge, NeoForge";
const DESCRIPTION =
  "Download Baritone builds for every Minecraft 1.21.x version (1.21 through 1.21.11) on Fabric, Forge and NeoForge. Free, open source, one jar in your mods folder.";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/download" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/download" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Baritone",
          applicationCategory: "GameApplication",
          softwareVersion: "1.21.11",
          operatingSystem: "Windows, macOS, Linux",
          description: DESCRIPTION,
          downloadUrl: SITE_URL + "/download",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "Download", item: SITE_URL + "/download" },
          ],
        }),
      },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  usePageView("/download");

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <header className="mb-10 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            Downloads
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Download Baritone for Minecraft 1.21.x
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The latest release for each Minecraft version from 1.21 to 1.21.11, for Fabric, Forge
            and NeoForge. Files are plain jars — drop them into your mods folder and go.
          </p>
        </header>

        <DownloadPanel />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <h2 className="text-lg font-semibold tracking-tight">Installing</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="font-mono text-primary-glow">1.</span> Install the matching mod
                loader (Fabric, Forge or NeoForge) for Minecraft 1.21.x.
              </li>
              <li>
                <span className="font-mono text-primary-glow">2.</span> Download the jar above and
                move it into your <span className="font-mono">.minecraft/mods</span> folder.
              </li>
              <li>
                <span className="font-mono text-primary-glow">3.</span> Launch Minecraft with Java
                21 and open chat — type <span className="font-mono">#help</span> to confirm it
                loaded.
              </li>
            </ol>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-copper">
              Other versions?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Only 1.21.x builds are listed here. Older Minecraft releases and dev builds live in
              the repository.
            </p>
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-primary-glow underline underline-offset-4"
            >
              Visit the GitHub repo
            </a>
            <p className="mt-6 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
              Checksums and full release notes are on the linked repository.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
