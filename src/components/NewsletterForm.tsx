
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterForm = () => {
  const [name, setName] = useState('');
  const [education, setEducation] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !education || !email) {
      toast.error("All fields are required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ name, education, email }]);
        
      if (error) {
        if (error.code === '23505') {
          toast.error("You're already on our waitlist!");
        } else {
          toast.error("Something went wrong. Please try again.");
          console.error(error);
        }
        return;
      }
      
      toast.success("Thank you for joining our waitlist!");
      setName('');
      setEducation('');
      setEmail('');
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1"
        />
        <Input
          placeholder="Your education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          required
          className="flex-1"
        />
      </div>
      
      <div className="flex gap-3">
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={isSubmitting} className="bg-brand-green hover:bg-brand-green/90 text-black">
          {isSubmitting ? "Adding..." : "Join Waitlist"}
        </Button>
      </div>
    </form>
  );
};
