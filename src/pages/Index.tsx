
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookText, BarChart3, Users, Briefcase, ArrowUp } from "lucide-react";
import { LogoCloud } from "@/components/LogoCloud";
import { FeatureCard } from "@/components/FeatureCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { FloatingElements } from "@/components/FloatingElements";
import { AppScreens } from "@/components/AppScreens";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <FloatingElements />
      
      {/* Navbar */}
      <nav className="relative z-10 py-6 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">CaseAI</div>
        <div className="flex gap-4 items-center">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50">Login</Button>
          <Button className="bg-black hover:bg-gray-800 text-white">Sign Up</Button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative z-10 pt-12 md:pt-24 pb-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block mb-4 px-3 py-1 bg-brand-gray rounded-full text-sm font-medium text-gray-700">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-green mr-2"></span>
              Coming Soon
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Practice Case Interviews <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-green-400">with AI</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Master business problem-solving through structured practice with our AI interviewer. Get instant feedback and improve with every session.
            </p>
            
            <div className="mb-12">
              <NewsletterForm />
            </div>
            
            <div className="mb-8">
              <LogoCloud />
            </div>
          </div>
          
          <div className="relative">
            <div className="pulse-animation absolute w-full h-full rounded-full"></div>
            <div className="relative">
              <AppScreens />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your Path to Structured Problem Solving</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides everything you need to master business case interviews
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Case Gym Reps"
            description="Practice with written & video cases across industries, with timer, instant scoring, and highlighted insights."
            icon={<BookText className="w-6 h-6 text-brand-green" />}
            animationDelay="animation-delay-200"
          />
          
          <FeatureCard
            title="Adaptive Difficulty"
            description="Our MECE Engine ramps complexity as you improve, preventing plateaus and keeping stretch consistent."
            icon={<BarChart3 className="w-6 h-6 text-brand-green" />}
            animationDelay="animation-delay-400"
          />
          
          <FeatureCard
            title="Live 1-v-1 Battles"
            description="Schedule head-to-head matches vs. peers with real-time scoring, public leaderboard, and post-match debrief."
            icon={<Users className="w-6 h-6 text-brand-green" />}
            animationDelay="animation-delay-200"
          />
          
          <FeatureCard
            title="Icon Playbooks"
            description="Weekly 'Think Like Elon/Jobs/Nadella' cases with step-by-step solution walkthroughs & mental-model breakdowns."
            icon={<Briefcase className="w-6 h-6 text-brand-green" />}
            animationDelay="animation-delay-400"
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-bold mb-4">Be the First to Know</h2>
            <p className="text-gray-600 mb-6">
              Join our waitlist and get early access when we launch. Plus, receive exclusive tips to prepare for your case interviews.
            </p>
            <div className="mb-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-xl">CaseAI</span>
            <p className="text-gray-600 text-sm mt-1">© 2025 CaseAI. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
            <Button variant="outline" size="sm" className="mt-4 md:mt-0">
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
