import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Terminal, SlidersHorizontal, LifeBuoy, Rocket } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CopyCommand } from "@/components/copy-command";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageView } from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";


const TITLE = "Baritone Guide — Setup, Commands and Settings";
const DESCRIPTION =
  "How to install Baritone, run your first pathfinding command, use the full command list, change settings, and fix common problems.";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: SITE_URL + "/guide" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/guide" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to install and use Baritone in Minecraft",
          description: DESCRIPTION,
          step: [
            { "@type": "HowToStep", name: "Install a mod loader", text: "Install Fabric, Forge or NeoForge for Minecraft 1.21.x." },
            { "@type": "HowToStep", name: "Add the jar", text: "Move the Baritone jar into your .minecraft/mods folder." },
            { "@type": "HowToStep", name: "Run a command", text: "Open chat and type #goto with coordinates to send your player there." },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "Guide", item: SITE_URL + "/guide" },
          ],
        }),
      },
    ],
  }),
  component: GuidePage,
});

const commandGroups: { title: string; rows: [string, string][] }[] = [
  {
    title: "Movement",
    rows: [
      ["#goto <x> <y> <z>", "Walk to exact coordinates."],
      ["#goto <x> <z>", "Walk to a column, any height."],
      ["#follow player <name>", "Trail a player around."],
      ["#explore", "Wander outwards, loading new chunks."],
      ["#stop", "Cancel the current task immediately."],
    ],
  },
  {
    title: "Mining",
    rows: [
      ["#mine <block>", "Search for and mine a block type."],
      ["#mine 8 diamond_ore", "Mine until eight are collected."],
      ["#tunnel", "Dig a straight tunnel ahead."],
      ["#farm", "Harvest and replant nearby crops."],
    ],
  },
  {
    title: "Building",
    rows: [
      ["#build <file>", "Place a schematic from your schematics folder."],
      ["#schematica", "Build the currently loaded schematic."],
      ["#sel", "Work with a selected region."],
    ],
  },
  {
    title: "Waypoints",
    rows: [
      ["#waypoint save <name>", "Mark your current position."],
      ["#waypoint goto <name>", "Travel to a saved waypoint."],
      ["#waypoint list", "Show everything you've saved."],
    ],
  },
];

const settings: [string, string][] = [
  ["#set allowBreak true", "Let it break blocks in the way"],
  ["#set allowPlace true", "Let it bridge and scaffold"],
  ["#set allowSprint false", "Walk instead of sprinting"],
  ["#set avoidance true", "Route around mobs"],
  ["#set renderPath true", "Draw the calculated path in-world"],
  ["#set list", "Show every available setting"],
];

const troubles: [string, string][] = [
  [
    "Commands do nothing",
    "The jar is probably for a different loader or Minecraft version. Check that the jar name matches the version you launched.",
  ],
  [
    "It refuses to break blocks",
    "Run #set allowBreak true. Some tasks also need allowPlace for bridging.",
  ],
  [
    "It keeps stopping mid-path",
    "Chunks may not be loaded yet, or the goal is unreachable. Try a nearer goal, or run #explore first.",
  ],
  [
    "The game crashes on startup",
    "Two conflicting Baritone jars in the mods folder is the usual cause — keep only one.",
  ],
];

const sections = [
  { id: "install", label: "Install", icon: Download },
  { id: "first-command", label: "First command", icon: Rocket },
  { id: "commands", label: "Command reference", icon: Terminal },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
  { id: "troubleshooting", label: "Troubleshooting", icon: LifeBuoy },
];

const installSteps = [
  {
    title: "Install a mod loader",
    body: "Set up Fabric, Forge or NeoForge for a 1.21.x version of Minecraft.",
  },
  {
    title: "Add the jar",
    body: "Drop the matching Baritone jar into your .minecraft/mods folder.",
  },
  {
    title: "Launch with Java 21",
    body: "Start the profile you installed the loader on and join any world.",
  },
  {
    title: "Verify it loaded",
    body: "Type #help in chat. A command list means Baritone is running.",
  },
];

function GuidePage() {
  usePageView("/guide");

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <header className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-glow">
            Guide
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Baritone Guide <span className="text-ore">setup, commands and settings</span>
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
            Install Baritone, type a command with the{" "}
            <span className="font-mono text-foreground">#</span> prefix, and your player starts
            pathing. This page covers setup, the full command set, settings and the usual snags.
          </p>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-[200px_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                On this page
              </p>
              <ul className="mt-4 space-y-1">
                {sections.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary-glow"
                    >
                      <Icon className="size-3.5" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 space-y-16">
            <section id="install" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight">Install</h2>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {installSteps.map((step, i) => (
                  <li key={step.title} className="panel panel-hover rounded-xl p-5">
                    <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/15 font-mono text-xs text-primary-glow">
                      {i + 1}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
              <Link
                to="/download"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary-glow transition-colors duration-200 hover:bg-primary/20"
              >
                <Download className="size-4" />
                Get a 1.21.x build
              </Link>
            </section>

            <section id="first-command" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight">Your first command</h2>
              <div className="panel mt-5 overflow-hidden rounded-xl">
                <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-destructive/60" />
                  <span className="size-2.5 rounded-full bg-copper/60" />
                  <span className="size-2.5 rounded-full bg-primary/60" />
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Minecraft chat
                  </span>
                </div>
                <div className="space-y-2 p-5 font-mono text-sm">
                  <p className="text-primary-glow">#goto 120 64 -300</p>
                  <p className="text-muted-foreground">
                    <span className="text-copper">[Baritone]</span> Path calculated, 412 blocks
                  </p>
                  <p className="text-primary-glow">#stop</p>
                  <p className="text-muted-foreground">
                    <span className="text-copper">[Baritone]</span> All tasks cancelled
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                Baritone plots a route and walks there, jumping gaps, bridging and avoiding lava on
                the way. Type <span className="font-mono text-foreground">#stop</span> at any point
                to hand control back.
              </p>
            </section>

            <section id="commands" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight">Command reference</h2>
              <p className="mt-2 text-sm text-muted-foreground">Hover a row to copy it.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {commandGroups.map((group) => (
                  <div key={group.title} className="panel rounded-xl p-5">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-copper">
                      {group.title}
                    </h3>
                    <div className="mt-3 space-y-2">
                      {group.rows.map(([cmd, note]) => (
                        <CopyCommand key={cmd} command={cmd} note={note} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="settings" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                Change behaviour with <span className="font-mono text-foreground">#set</span>.
                Settings persist per world.
              </p>
              <div className="panel mt-5 space-y-2 rounded-xl p-5">
                {settings.map(([cmd, note]) => (
                  <CopyCommand key={cmd} command={cmd} note={note} />
                ))}
              </div>
            </section>

            <section id="troubleshooting" className="scroll-mt-24">
              <h2 className="text-2xl font-semibold tracking-tight">Troubleshooting</h2>
              <Accordion type="single" collapsible className="mt-5">
                {troubles.map(([q, a]) => (
                  <AccordionItem key={q} value={q} className="border-border/60">
                    <AccordionTrigger className="text-left text-sm font-semibold hover:text-primary-glow hover:no-underline">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="panel mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl p-5">
                <p className="text-sm text-muted-foreground">Still stuck? The FAQ covers servers, loaders and compatibility.</p>
                <Link
                  to="/faq"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-primary/40 hover:text-primary-glow"
                >
                  Read the FAQ
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

