
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form validation schema with required fields
const waitlistSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  education: z.string().min(2, { message: "Please provide your education" }),
  email: z.string().email({ message: "Please enter a valid email address" })
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

export function WaitlistForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form
  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: '',
      education: '',
      email: '',
    }
  });

  const onSubmit = async (data: WaitlistFormData) => {
    setIsLoading(true);
    
    try {
      // Insert data into Supabase
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            name: data.name,
            education: data.education,
            email: data.email
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting to waitlist:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't add you to the waitlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full max-w-md mx-auto">
        <div className="flex flex-row gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="h-12 bg-white border-gray-200 focus-visible:ring-brand-green"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Education"
                    className="h-12 bg-white border-gray-200 focus-visible:ring-brand-green"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="h-12 bg-white border-gray-200 focus-visible:ring-brand-green"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-12 px-6 mt-2 bg-[hsl(var(--brand-green))] hover:bg-brand-black hover:text-white text-black transition-colors duration-300"
        >
          {isLoading ? "Submitting..." : "Join Waitlist"}
        </Button>
      </form>
    </Form>
  );
}
