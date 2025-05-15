
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "You're on the list!",
        description: "We'll notify you when we launch.",
      });
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-12 bg-white border-gray-200 focus-visible:ring-brand-green"
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="h-12 px-6 bg-[hsl(var(--brand-green))] hover:bg-brand-black hover:text-white text-black transition-colors duration-300"
      >
        {isLoading ? "Submitting..." : "Join Waitlist"}
      </Button>
    </form>
  );
}
