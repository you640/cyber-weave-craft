import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutGrid, HeartPulse, Stethoscope, ShieldCheck, FileText,
  Terminal, Zap, Plug, KeyRound, RefreshCw,
} from "lucide-react";

type Action = {
  label: string;
  hint?: string;
  icon: typeof LayoutGrid;
  to?: string;
  run?: () => void;
};

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    (window as Window & { __openCmdK?: () => void }).__openCmdK = () => setOpen(true);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => () => {
    setOpen(false);
    navigate(to);
  };

  const nav: Action[] = [
    { label: "Overview", icon: LayoutGrid, to: "/dashboard", hint: "G O" },
    { label: "Health", icon: HeartPulse, to: "/dashboard/health", hint: "G H" },
    { label: "Diagnostics", icon: Stethoscope, to: "/dashboard/diagnostics" },
    { label: "WP Audit", icon: ShieldCheck, to: "/dashboard/wp-audit" },
    { label: "Reports", icon: FileText, to: "/dashboard/reports", hint: "G R" },
    { label: "Shell", icon: Terminal, to: "/dashboard/shell", hint: "G S" },
    { label: "Shell Live", icon: Zap, to: "/dashboard/shell-live" },
    { label: "MCP", icon: Plug, to: "/dashboard/mcp" },
    { label: "MFA", icon: KeyRound, to: "/dashboard/mfa" },
  ];

  const actions: Action[] = [
    { label: "Refresh page", icon: RefreshCw, run: () => location.reload() },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Hľadaj sekciu alebo akciu…" />
      <CommandList>
        <CommandEmpty>Nič nenájdené.</CommandEmpty>
        <CommandGroup heading="Navigácia">
          {nav.map((a) => (
            <CommandItem key={a.label} onSelect={a.to ? go(a.to) : a.run}>
              <a.icon className="mr-2 h-4 w-4" />
              <span>{a.label}</span>
              {a.hint && (
                <span className="ml-auto text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  {a.hint}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Akcie">
          {actions.map((a) => (
            <CommandItem
              key={a.label}
              onSelect={() => {
                setOpen(false);
                a.run?.();
              }}
            >
              <a.icon className="mr-2 h-4 w-4" />
              <span>{a.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
