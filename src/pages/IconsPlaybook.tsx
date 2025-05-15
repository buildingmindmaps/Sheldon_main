
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { NewsletterForm } from '@/components/NewsletterForm';

const IconsPlaybook = () => {
  const featuredPost = {
    title: "Think Like Elon Musk: First Principles Thinking",
    excerpt: "Explore how Elon Musk breaks down complex problems to their fundamental truths and builds up from there, with practical examples and exercises.",
    date: "May 10, 2025",
    author: "CaseAI Team",
    category: "Mental Models",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470&auto=format&fit=crop"
  };

  const recentPosts = [
    {
      title: "Steve Jobs' Product Intuition Framework",
      excerpt: "Learn how Jobs developed his legendary product sense and how to apply his thinking to your case solutions.",
      date: "May 5, 2025",
      category: "Product Strategy",
      image: "https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "Satya Nadella's Transformation Playbook",
      excerpt: "Examine how Nadella led Microsoft's massive transformation and apply his leadership principles to organizational cases.",
      date: "April 28, 2025",
      category: "Leadership",
      image: "https://images.unsplash.com/photo-1553484771-689577e70e26?q=80&w=1470&auto=format&fit=crop"
    },
    {
      title: "Jeff Bezos and the Working Backwards Method",
      excerpt: "Master Bezos' unique approach to innovation and learn how to incorporate it into your case frameworks.",
      date: "April 21, 2025",
      category: "Innovation",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  // Full article content
  const fullArticle = {
    title: "Think Like Elon Musk: First Principles Thinking",
    subtitle: "Breaking Down Complex Problems to Their Fundamental Truths",
    author: "CaseAI Team",
    publishDate: "May 10, 2025",
    readTime: "8 min read",
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470&auto=format&fit=crop",
    content: [
      {
        type: "paragraph",
        text: "In the world of business problem-solving, few approaches are as powerful as first principles thinking. Made famous by Elon Musk, this method involves breaking down complex problems into their most fundamental truths and then rebuilding solutions from the ground up—rather than by analogy to what others have done before."
      },
      {
        type: "heading",
        text: "What is First Principles Thinking?"
      },
      {
        type: "paragraph",
        text: "First principles thinking is a problem-solving approach that involves decomposing a complex problem into its most basic, fundamental elements. Instead of following conventional wisdom or making decisions based on what others have done, you start with the most fundamental truths you know to be solid and build up from there."
      },
      {
        type: "quote",
        text: "I think it's important to reason from first principles rather than by analogy. The normal way we conduct our lives is we reason by analogy. We are doing this because it's like something else that was done, or it is like what other people are doing... with slight iterations on a theme. First principles is kind of a physics way of looking at the world. You boil things down to the most fundamental truths and say, 'What are we sure is true?' ... and then reason up from there.",
        author: "Elon Musk"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1470&auto=format&fit=crop",
        caption: "Breaking down problems to their core components is essential to first principles thinking"
      },
      {
        type: "heading",
        text: "How Musk Applied First Principles to SpaceX"
      },
      {
        type: "paragraph",
        text: "When Musk wanted to create SpaceX, conventional wisdom suggested that rockets were expensive, and space exploration was only for governments with massive budgets. Instead of accepting this, he asked: \"What are rockets made of? What is the value of those materials on the market?\""
      },
      {
        type: "paragraph",
        text: "He discovered that the raw materials for rockets (aluminum, titanium, carbon fiber, etc.) cost only about 2% of the typical price of a rocket. This insight led him to conclude that vertical integration and reusability could dramatically reduce costs—a fundamental rethinking that has revolutionized the space industry."
      },
      {
        type: "heading",
        text: "How to Apply First Principles to Case Interviews"
      },
      {
        type: "paragraph",
        text: "For consultants and business leaders, first principles thinking can be a game-changer in case interviews and real-world problem-solving. Here's how to apply this approach:"
      },
      {
        type: "list",
        items: [
          "<strong>Identify and question assumptions:</strong> What facts do we know to be true? What assumptions are we making that might not be valid?",
          "<strong>Break down the problem:</strong> What are the fundamental elements of this business challenge?",
          "<strong>Rebuild from scratch:</strong> If we were to create this business/product/solution from scratch, how would we do it?",
          "<strong>Focus on fundamental value:</strong> What is the core value proposition for the customer? What fundamental need are we addressing?"
        ]
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1470&auto=format&fit=crop",
        caption: "Working through complex business problems requires systematic thinking"
      },
      {
        type: "heading",
        text: "Case Example: Reimagining Product Pricing"
      },
      {
        type: "paragraph",
        text: "Consider a case where a software company is struggling with pricing their enterprise product. Traditional thinking might lead you to benchmark against competitors and make incremental changes. But first principles thinking would ask:"
      },
      {
        type: "list",
        items: [
          "What fundamental value does our product provide to customers?",
          "What is the actual cost structure of delivering this value?",
          "What would be the most rational way to price based on the value created, not what others charge?",
          "Could we completely reimagine the pricing model based on actual usage or value delivered?"
        ]
      },
      {
        type: "paragraph",
        text: "This might lead to innovative solutions like value-based pricing or completely new business models, rather than simply adjusting existing pricing structures."
      },
      {
        type: "heading",
        text: "Exercises to Develop First Principles Thinking"
      },
      {
        type: "list",
        items: [
          "<strong>The Five Whys:</strong> For any business problem, ask \"why\" at least five times to get to the root cause.",
          "<strong>Assumption Listing:</strong> List all assumptions about a problem, then systematically question each one.",
          "<strong>Blank Page Exercise:</strong> Imagine you're solving a problem with no existing solutions to reference.",
          "<strong>Fundamental Value Analysis:</strong> Define what fundamental value your product/service provides, without referencing features or competitors."
        ]
      },
      {
        type: "paragraph",
        text: "By developing these thinking skills, you'll approach case interviews and real business problems with a fresh perspective that can lead to breakthrough insights and solutions."
      },
      {
        type: "conclusion",
        text: "First principles thinking is not just a tool for visionaries like Elon Musk—it's a powerful approach that any business leader can use to solve complex problems and drive innovation. By breaking down challenges to their fundamental truths and building solutions from there, you can discover opportunities that others miss and create value in ways that others haven't imagined."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      {/* Header - with spacing for fixed navbar */}
      <header className="pt-24 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Playbook
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Weekly case studies and mental models from the world's most innovative business leaders
          </motion.p>
        </div>
      </header>
      
      {/* Featured Post - Full Article */}
      <section className="py-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div 
          className="relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative h-96 md:h-[500px]">
            <img 
              src={featuredPost.image} 
              alt={featuredPost.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
              <span className="inline-block px-3 py-1 bg-brand-green/80 rounded-full text-sm font-medium mb-4">
                {featuredPost.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-lg mb-6 text-gray-200 max-w-3xl">{featuredPost.excerpt}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{featuredPost.date}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{featuredPost.author}</span>
                </div>
                
                <Button className="bg-white text-black hover:bg-gray-200">
                  Read Playbook <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Full Article Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-12 max-w-4xl mx-auto">
        <article>
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{fullArticle.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{fullArticle.subtitle}</p>
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold">
                  CA
                </div>
                <div>
                  <p className="font-medium">{fullArticle.author}</p>
                  <p className="text-sm text-gray-600">{fullArticle.publishDate}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{fullArticle.readTime}</span>
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none mb-12">
            {fullArticle.content.map((block, index) => {
              switch(block.type) {
                case 'paragraph':
                  return <p key={index} className="mb-6">{block.text}</p>;
                case 'heading':
                  return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{block.text}</h2>;
                case 'quote':
                  return (
                    <blockquote key={index} className="border-l-4 border-brand-green pl-4 italic my-8 py-2 text-gray-700">
                      <p>"{block.text}"</p>
                      {block.author && <cite className="block mt-2 text-sm not-italic font-medium">— {block.author}</cite>}
                    </blockquote>
                  );
                case 'image':
                  return (
                    <figure key={index} className="my-10">
                      <img src={block.url} alt={block.caption || ''} className="rounded-lg w-full h-auto" />
                      <figcaption className="text-center text-sm text-gray-500 mt-2">{block.caption}</figcaption>
                    </figure>
                  );
                case 'list':
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2 mb-6">
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex} dangerouslySetInnerHTML={{__html: item}}></li>
                      ))}
                    </ul>
                  );
                case 'conclusion':
                  return (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-green my-8">
                      <h3 className="font-bold text-xl mb-3">Conclusion</h3>
                      <p>{block.text}</p>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </article>
      </section>
      
      {/* Recent Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Recent Playbooks</h2>
          <Button variant="outline" className="border-gray-300">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-brand-green">{post.category}</span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-4">
                  <Button variant="outline" className="w-full">Read Playbook</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Newsletter - Updated to match home page */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-brand-gray rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
          <div className="relative z-10 max-w-lg">
            <BookText className="w-10 h-10 text-brand-green mb-4" />
            <h2 className="text-3xl font-bold mb-4">Get weekly playbooks in your inbox</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to receive our Playbook directly to your email every week, plus exclusive tips on structured problem-solving.
            </p>
            <div className="max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* Using global Footer component */}
      <Footer />
    </div>
  );
};

export default IconsPlaybook;
