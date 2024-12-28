import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-primary">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-secondary">Welcome to Curately</h1>
          <p className="text-secondary/80 mt-2">Sign in to access your account</p>
        </div>
        <div className="rounded-lg border bg-secondary p-6 shadow-xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0EA5E9',
                    brandAccent: '#0284C7',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={`${window.location.origin}/admin`}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;