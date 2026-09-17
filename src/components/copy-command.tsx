import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCommand({ command, note }: { command: string; note?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="group flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5">
      <div className="min-w-0">
        <code className="block truncate font-mono text-xs text-primary-glow">{command}</code>
        {note ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p> : null}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${command}`}
        className="mt-0.5 shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-primary/15 hover:text-primary-glow focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? <Check className="size-3.5 text-copper" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
