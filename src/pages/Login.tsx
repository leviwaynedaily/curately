import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    console.log("Login page - Session state:", session);
    if (session && !isLoading) {
      console.log("User is authenticated, redirecting to admin");
      navigate("/admin");
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/10 via-primary/20 to-neutral/90">
        <div className="animate-pulse text-slate">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/10 via-primary/20 to-neutral/90">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-primary/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Lock className="h-5 w-5 text-accent/80 group-hover:text-accent transition-colors" />
            <span className="text-lg font-bold bg-gradient-to-r from-accent/90 to-primary bg-clip-text text-transparent">
              Curately
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-up">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-primary/90">Welcome Back</h1>
            <p className="text-slate/70">Sign in to manage your storefronts</p>
          </div>

          <div className="glass-panel p-6 space-y-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#2A6041',
                      brandAccent: '#D4AF37',
                      brandButtonText: '#F5F5DC',
                      defaultButtonBackground: '#333333',
                      defaultButtonBackgroundHover: '#4A6572',
                      inputBackground: 'white',
                      inputBorder: '#E8E8E8',
                      inputBorderHover: '#D4AF37',
                      inputBorderFocus: '#2A6041',
                    },
                    space: {
                      buttonPadding: '0.75rem 1rem',
                      inputPadding: '0.75rem 1rem',
                    },
                    radii: {
                      borderRadiusButton: '0.5rem',
                      buttonBorderRadius: '0.5rem',
                      inputBorderRadius: '0.5rem',
                    },
                    fonts: {
                      bodyFontFamily: `'Inter', sans-serif`,
                      buttonFontFamily: `'Inter', sans-serif`,
                      inputFontFamily: `'Inter', sans-serif`,
                      labelFontFamily: `'Inter', sans-serif`,
                    },
                  },
                },
                className: {
                  container: 'space-y-4',
                  button: 'hover-card transition-all duration-300',
                  input: 'hover:border-accent focus:border-primary transition-colors duration-300',
                  label: 'text-slate font-medium',
                },
              }}
              theme="custom"
              providers={[]}
              redirectTo={`${window.location.origin}/admin`}
            />
          </div>

          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-slate/70 hover:text-primary transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-slate/60 bg-white/5 backdrop-blur-sm border-t border-primary/5">
        <div className="max-w-6xl mx-auto">
          © {new Date().getFullYear()} Curately. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;