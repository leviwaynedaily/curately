import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Lock, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-primary/5 via-neutral/10 to-slate/5">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-white/50 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/admin')}
                >
                  <Lock className="h-5 w-5 text-accent" />
                  <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                </div>
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
            "container py-6 animate-fade-up flex-1",
            "prose prose-slate max-w-none",
            "prose-headings:text-primary prose-headings:font-semibold",
            "prose-p:text-slate prose-p:leading-relaxed",
            "prose-strong:text-primary/90 prose-strong:font-semibold",
            "prose-a:text-accent hover:prose-a:text-accent/80",
          )}>
            {children}
          </main>
          <footer className="py-4 border-t bg-white/50 backdrop-blur-sm">
            <div className="container text-center text-sm text-slate">
              Copyright © {new Date().getFullYear()} Curately. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};