import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { submitToWaitlist } from "@/services/waitlistService";

// Define form validation schema
const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const validation = newsletterSchema.safeParse({ email });
    if (!validation.success) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Submit data to MongoDB via our API
      const result = await submitToWaitlist({
        name: 'Newsletter Subscriber', // Default name for newsletter signups
        education: 'Not specified', // Default education for newsletter signups
        email: email,
        source: 'newsletter'
      });

      toast({
        title: "You're on the list!",
        description: "We'll notify you when we launch.",
      });
      
      setEmail('');
    } catch (error) {
      console.error("Error submitting to newsletter:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't add you to the newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
