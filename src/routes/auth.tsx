import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Baritone" },
      { name: "description", content: "Sign in to manage Baritone builds and site analytics." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Sign in — Baritone" },
      { property: "og:description", content: "Team sign-in for the Baritone site dashboard." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/auth" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMessage(error.message);
      navigate({ to: "/admin" });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) return setMessage(error.message);
    setMessage("Account created. You can sign in now.");
    setMode("signin");
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-[4px] bg-primary font-mono text-sm font-medium text-primary-foreground">
            B
          </span>
          <span className="text-base font-semibold">Baritone</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dashboard access for site maintainers.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary py-2.5 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        {message && <p className="mt-3 text-sm text-copper">{message}</p>}

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 font-mono text-xs text-muted-foreground underline underline-offset-4"
        >
          {mode === "signin" ? "Need an account?" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}
