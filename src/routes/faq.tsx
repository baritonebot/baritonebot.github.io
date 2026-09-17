import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageView } from "@/lib/analytics";
import { SITE_URL, GITHUB_URL } from "@/lib/site";

const TITLE = "Baritone FAQ — Servers, Loaders and Compatibility";
const DESCRIPTION =
  "Answers about Baritone: whether servers allow it, which mod loaders are supported, why only 1.21.x builds are listed, Impact compatibility and performance.";

const faqItems = [
  {
    category: "Basics",
    q: "Is Baritone a cheat or a quality-of-life mod?",
    a: "It is automation. Baritone moves, mines and builds on your own account using normal game actions — it does not give combat or speed advantages beyond playing efficiently.",
  },
  {
    category: "Basics",
    q: "How do I stop it mid-task?",
    a: "Type #stop in chat. That cancels pathing, mining and building immediately and hands control back to you.",
  },
  {
    category: "Servers",
    q: "Will it work on my server?",
    a: "Baritone is client-side, so it runs anywhere technically. Many servers allow it, some ban automation outright. Read the server rules before you enable it.",
  },
  {
    category: "Compatibility",
    q: "Which loaders are supported?",
    a: "Fabric, Forge and NeoForge for the current 1.21.x line. Each build is a standalone jar with no extra dependencies.",
  },
  {
    category: "Compatibility",
    q: "Why are only 1.21.x builds listed here?",
    a: "This site tracks the current release line so downloads stay unambiguous. Every older Minecraft version and development build is on the GitHub repository.",
  },
  {
    category: "Compatibility",
    q: "Does it work with Impact?",
    a: "Yes. Baritone is designed to coexist with Impact and similar clients — keybinds and movement control do not fight each other.",
  },
  {
    category: "Performance",
    q: "Does it hurt performance?",
    a: "Pathfinding runs on a background thread and is designed to stay off the render loop. Very long paths use more memory while calculating, then settle.",
  },
] as const;

const faqs = faqItems.map((item) => [item.q, item.a] as const);

const categories = ["All", "Basics", "Servers", "Compatibility", "Performance"] as const;


export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/faq" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "FAQ", item: SITE_URL + "/faq" },
          ],
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  usePageView("/faq");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqItems.filter(
      (item) =>
        (category === "All" || item.category === category) &&
        (q === "" || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)),
    );
  }, [query, category]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        <header className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-glow">
            FAQ
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Baritone FAQ <span className="text-ore">servers, loaders and compatibility</span>
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
            Servers, loaders, performance and the questions that come up most before installing
            Baritone.
          </p>
        </header>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions"
              aria-label="Search questions"
              className="w-full rounded-lg border border-border bg-background/50 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  category === c
                    ? "border-primary/50 bg-primary/15 text-primary-glow"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="panel mt-8 rounded-xl p-6 text-sm text-muted-foreground">
            No questions match that search.
          </p>
        ) : (
          <Accordion type="single" collapsible className="mt-8">
            {filtered.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-border/60">
                <AccordionTrigger className="gap-4 text-left text-base font-semibold hover:text-primary-glow hover:no-underline">
                  <span>{item.q}</span>
                  <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-copper">
                    {item.category}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="max-w-[64ch] text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="panel mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl p-6">
          <div>
            <h2 className="text-sm font-semibold">Still have a question?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The guide walks through setup and commands, and GitHub has the full issue tracker.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/guide"
              className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary-glow transition-colors duration-200 hover:bg-primary/20"
            >
              Read the guide
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-primary/40 hover:text-primary-glow"
            >
              GitHub
            </a>
          </div>
        </div>
      </main>


      <SiteFooter />
    </div>
  );
}
