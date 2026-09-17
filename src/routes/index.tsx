import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { usePageView } from "@/lib/analytics";
import { SITE_URL, GITHUB_URL } from "@/lib/site";
import caveMap from "@/assets/cave-map.jpg";

const TITLE = "Baritone — Minecraft Pathfinding & Automation Mod";
const DESCRIPTION =
  "Baritone walks, mines and builds for you in Minecraft. Open source, client-side, and available for the latest 1.21.x releases on Fabric, Forge and NeoForge.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Baritone",
          applicationCategory: "GameApplication",
          operatingSystem: "Windows, macOS, Linux",
          description: DESCRIPTION,
          url: SITE_URL,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    key: "P",
    title: "Pathfinding",
    body: "A* search across the block grid finds the cheapest route, routing around mobs, water and griefed terrain in real time.",
    cmd: "#goto 120 64 -300",
    tone: "text-primary-glow",
  },
  {
    key: "M",
    title: "Auto-mine",
    body: "Plans efficient ore and tree patterns, tracks yields and returns to base without you micromanaging the pickaxe.",
    cmd: "#mine diamond_ore",
    tone: "text-copper",
  },
  {
    key: "B",
    title: "Auto-build",
    body: "Reads a schematic and places every block in order, handling scaffolding, air and reach windows automatically.",
    cmd: "#build castle.schematic",
    tone: "text-moss",
  },
  {
    key: "W",
    title: "Waypoints & goals",
    body: "Save named waypoints, rank multiple goals by cost and let Baritone pick the smartest destination right now.",
    cmd: "#waypoint save base",
    tone: "text-primary-glow",
  },
];

function Index() {
  usePageView("/");

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="pointer-events-none absolute left-1/2 top-[-6rem] -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-glow">
                  <span className="ore-pulse size-1.5 rounded-full bg-primary-glow" />
                  Open source · Minecraft 1.21.x
                </span>
                <h1 className="mt-5 max-w-[18ch] text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                  Baritone
                  <br />
                  <span className="text-ore">Minecraft pathfinding mod</span>
                </h1>
                <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted-foreground lg:text-lg">
                  Baritone steers your player through caves, forests and builds with calm,
                  deliberate pathfinding. It knows where to go, what to mine and how to reach it —
                  so you don't have to.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/download"
                    className="group inline-flex items-center gap-2 rounded-md bg-primary py-3 pl-3 pr-4 font-mono text-sm font-medium text-primary-foreground shadow-[0_16px_40px_-18px_var(--primary)] transition-transform hover:-translate-y-0.5"
                  >
                    <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                    Download 1.21.x
                  </Link>
                  <Link
                    to="/guide"
                    className="group inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    Read the guide
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
                <dl className="mt-10 grid max-w-md grid-cols-3 gap-3">
                  {[
                    ["12", "1.21 builds"],
                    ["3", "mod loaders"],
                    ["100%", "free & open"],
                  ].map(([value, label]) => (
                    <div key={label} className="panel rounded-xl px-3 py-3">
                      <dt className="font-mono text-xl text-primary-glow">{value}</dt>
                      <dd className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lg:col-span-6">
                <div className="float-slow panel relative overflow-hidden rounded-2xl p-3">
                  <div className="flex items-center justify-between px-2 pb-3">
                    <div className="flex gap-1.5">
                      <span className="size-2.5 rounded-[2px] bg-copper/70" />
                      <span className="size-2.5 rounded-[2px] bg-moss/70" />
                      <span className="size-2.5 rounded-[2px] bg-muted-foreground/40" />
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      path://cave_04
                    </span>
                  </div>
                  <img
                    src={caveMap}
                    width={1024}
                    height={768}
                    alt="Overhead map of a Minecraft cave with a glowing path leading from a torch-lit entrance to a diamond ore block"
                    className="aspect-[4/3] w-full rounded-lg object-cover hue-rotate-[62deg] saturate-[1.1]"
                  />
                  <div className="grid grid-cols-3 gap-2 px-1 pb-1 pt-3">
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="font-mono text-[10px] text-muted-foreground">nodes</p>
                      <p className="mt-0.5 font-mono text-lg">1,284</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="font-mono text-[10px] text-muted-foreground">path cost</p>
                      <p className="mt-0.5 font-mono text-lg text-primary-glow">3.2s</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="font-mono text-[10px] text-muted-foreground">goal</p>
                      <p className="mt-0.5 font-mono text-lg text-copper">diamond</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 flex flex-wrap gap-2 font-mono text-[11px] text-muted-foreground">
              {["1.21 – 1.21.11", "Fabric", "Forge", "NeoForge", "Client-side", "MIT-style license"].map(
                (chip) => (
                  <span key={chip} className="rounded-full border border-border px-3 py-1">
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-border py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                  Capabilities
                </p>
                <h2 className="mt-2 max-w-[40ch] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Built to think ahead of your next step.
                </h2>
              </div>
              <p className="max-w-[36ch] text-sm text-muted-foreground">
                Five systems working together so movement, mining and building stay smooth and
                on-target.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="panel panel-hover rounded-xl p-6">
                  <span
                    className={`inline-grid size-9 place-items-center rounded-md bg-accent font-mono text-base ${feature.tone}`}
                  >
                    {feature.key}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                  <p className="mt-4 font-mono text-[11px] text-primary">{feature.cmd}</p>
                </div>
              ))}

              <div className="panel panel-hover rounded-xl border-primary/25 p-6 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="inline-grid size-9 place-items-center rounded-md bg-accent font-mono text-base text-primary-glow">
                    I
                  </span>
                  <span className="ore-pulse size-1.5 rounded-full bg-primary-glow" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Impact integration</h3>
                <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                  Plays cleanly alongside Impact and other quality-of-life mods — no conflicting
                  keybinds, no double-movement. Drop it into your setup and it just works.
                </p>
                <p className="mt-4 font-mono text-[11px] text-primary">#follow player Notch</p>
              </div>
            </div>
          </div>
        </section>


        {/* COMMANDS */}
        <section className="border-t border-border py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                  Commands
                </p>
                <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">
                  Type it, and it goes.
                </h2>
                <p className="mt-4 max-w-[38ch] text-sm text-muted-foreground">
                  Everything runs from chat with the <span className="font-mono">#</span> prefix. No
                  menus to learn.
                </p>
              </div>
              <div className="lg:col-span-8">
                <div className="panel rounded-xl p-5 font-mono text-sm">
                  {[
                    ["#goto 120 64 -300", "walk to coordinates"],
                    ["#mine diamond_ore", "find and mine an ore"],
                    ["#build castle.schematic", "place a saved structure"],
                    ["#follow player Notch", "trail another player"],
                    ["#set allowBreak true", "let it break blocks"],
                    ["#stop", "cancel everything"],
                  ].map(([cmd, note]) => (
                    <div
                      key={cmd}
                      className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border py-2.5 last:border-0"
                    >
                      <span className="text-primary-glow">{cmd}</span>
                      <span className="text-[11px] text-muted-foreground">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DOWNLOAD TEASER */}
        <section className="border-t border-border py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="panel relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl p-8 sm:flex-row sm:items-center">
              <div className="pointer-events-none absolute -left-16 top-1/2 size-64 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Builds for every 1.21.x release.
                </h2>
                <p className="mt-2 max-w-[48ch] text-sm text-muted-foreground">
                  Fabric, Forge and NeoForge jars for Minecraft 1.21 through 1.21.11. Older
                  Minecraft versions live on{" "}
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-glow underline underline-offset-4"
                  >
                    the GitHub repository
                  </a>
                  .
                </p>
              </div>
              <Link
                to="/download"
                className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary py-3 pl-3 pr-4 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <ArrowDown className="size-4" aria-hidden="true" />
                Go to downloads
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
