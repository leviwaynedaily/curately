import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-neutral/10 to-slate/5">
      <header className="sticky top-0 z-50 w-full border-b bg-white/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Left empty intentionally after removing dashboard text */}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral/5">
                <User className="h-4 w-4 text-slate" />
                <span className="text-slate">{user?.email}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className={cn(
        "container py-6 animate-fade-up",
        "prose prose-slate max-w-none",
        "prose-headings:text-primary prose-headings:font-semibold",
        "prose-p:text-slate prose-p:leading-relaxed",
        "prose-strong:text-primary/90 prose-strong:font-semibold",
        "prose-a:text-accent hover:prose-a:text-accent/80",
      )}>
        {children}
      </main>
    </div>
  );
};