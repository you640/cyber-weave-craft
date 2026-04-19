import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <span className="font-mono text-xs px-3 py-2 wire-border opacity-50">
        [ ... ]
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        to="/auth"
        className="hidden sm:block font-mono text-xs px-3 py-2 wire-border hover:bg-[hsl(var(--wire-bg-soft))] transition-colors"
      >
        Login
      </Link>
    );
  }

  const label = user.email?.split("@")[0] ?? "user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-mono text-xs px-3 py-2 wire-border hover:bg-[hsl(var(--wire-bg-soft))] transition-colors">
        [ {label} ▾ ]
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="wire-border-solid font-mono text-xs">
        <DropdownMenuLabel className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer">
          Odhlásiť sa →
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
