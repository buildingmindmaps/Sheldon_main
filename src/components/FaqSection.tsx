
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

function FaqItem({ question, answer, isOpen, toggleOpen }: FaqItemProps) {
  return (
    <motion.div 
      className="border-b border-gray-200 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={toggleOpen}
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 py-2"
      >
        <span>{question}</span>
        {isOpen ? (
          <Minus className="h-4 w-4 text-brand-green flex-shrink-0" />
        ) : (
          <Plus className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="py-3 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqItems = [
    {
      question: "What makes CaseAI different from other case interview prep platforms?",
      answer: "CaseAI provides a truly interactive experience with an AI interviewer that adapts to your responses in real-time. Unlike static case materials or recorded videos, our platform simulates the dynamic nature of actual case interviews, providing personalized feedback and guidance tailored to your specific approach."
    },
    {
      question: "Is CaseAI suitable for beginners who have never done case interviews before?",
      answer: "Absolutely! CaseAI is designed to support users at all levels, from complete beginners to experienced candidates. Our adaptive difficulty system ensures that the cases match your current skill level and gradually increase in complexity as you improve."
    },
    {
      question: "How many practice cases do you offer?",
      answer: "Our library includes over 100 cases spanning multiple industries including technology, healthcare, retail, finance, and more. We regularly add new cases based on real consulting interviews and business scenarios."
    },
    {
      question: "Can I use CaseAI to prepare for specific consulting firms?",
      answer: "Yes, CaseAI includes firm-specific preparation modules tailored to the unique case interview styles of major consulting firms like McKinsey, BCG, Bain, and others."
    },
    {
      question: "When will CaseAI be available?",
      answer: "We're currently in the final stages of development and plan to launch soon. Join our waitlist to be among the first to access the platform and receive exclusive early access benefits."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-600">
          Everything you need to know about CaseAI
        </p>
      </div>
      
      <div className="space-y-1">
        {faqItems.map((item, index) => (
          <FaqItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            toggleOpen={() => toggleFaq(index)}
          />
        ))}
      </div>
    </section>
  );
}
