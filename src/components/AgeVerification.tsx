import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const AgeVerification = () => {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefronts", id],
    queryFn: async () => {
      console.log("Fetching storefront:", id);
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      console.log("Storefront data:", data);
      return data;
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storefront?.password_required && password !== storefront?.password) {
      toast({
        variant: "destructive",
        description: "Incorrect password",
      });
      return;
    }
    // Handle successful password verification
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8"
      style={{
        backgroundColor: storefront?.primary_color || "#ffffff",
        color: storefront?.primary_font_color || "#000000",
      }}
    >
      {storefront?.logo && (
        <img
          src={storefront.logo}
          alt="Logo"
          className="w-32 h-32 object-contain"
        />
      )}

      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold">{storefront?.heading_text}</h1>
        <p className="text-xl">{storefront?.subheading_text}</p>
        <p>{storefront?.age_verification_text}</p>
        <Button>{storefront?.button_text || "Enter"}</Button>
      </div>

      {storefront?.password_required && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full"
          />
          <Button type="submit">Submit</Button>
        </form>
      )}
    </div>
  );
};