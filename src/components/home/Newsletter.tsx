import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically integrate with a newsletter service
    toast({
      title: "Thanks for subscribing!",
      description: "We'll keep you updated with our latest news.",
    });
    setEmail("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 bounce-in" style={{ animationDelay: '1.3s' }}>
      <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Mail className="h-6 w-6 text-primary/80" />
          <h3 className="text-lg font-semibold text-primary">Stay Updated</h3>
        </div>
        <p className="text-sm text-slate text-center mb-6">
          Subscribe to our newsletter for the latest updates and features.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow bg-white/50"
            required
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;