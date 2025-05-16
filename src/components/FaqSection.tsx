
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
      question: "What makes SheldonAI different from other platforms?",
      answer: "SheldonAI adapts to how you think, giving personalized challenges and feedback in real time. Unlike static materials, it helps you build real problem-solving skills that grow with you, making learning active and tailored to your unique approach."
    },
    {
      question: "Is SheldonAI suitable for beginners?",
      answer: "Absolutely! SheldonAI is designed for everyone, whether you're new or experienced. It starts with easy challenges and adapts as you improve, so you always feel supported and can grow your problem-solving skills step by step at your own pace."
    },
    {
      question: "How many practice challenges do you offer?",
      answer: "Our library includes over 100 challenges across industries like tech, healthcare, finance, and retail. We keep adding new, real-world problems regularly, so you always have fresh and relevant mental workouts to sharpen your thinking and problem-solving skills."
    },
    {
      question: "When will SheldonAI be available?",
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
          Everything you need to know about SheldonAI
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
