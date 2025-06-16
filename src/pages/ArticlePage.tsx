import React, { useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { WaitlistForm } from '@/components/WaitlistForm';
import { BookText } from 'lucide-react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { slugify } from '@/lib/utils/slug';
// Import the new NetflixChallengeGame component
import NetflixChallengeGame from './NetflixChallengeGame'; // Adjust the path as necessary

// Sample article database - in a real app, this would come from an API or CMS
const articles = [
	{
		id: 1,
		title: "Think Like Elon Musk: First Principles Thinking",
		subtitle: "Breaking Down Complex Problems to Their Fundamental Truths",
		author: "SheldonAI Team",
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
				text: "How to Apply First Principles to Case "
			},
			{
				type: "paragraph",
				text: "For consultants and business leaders, first principles thinking can be a game-changer in case and real-world problem-solving. Here's how to apply this approach:"
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
				text: "By developing these thinking skills, you'll approach case and real business problems with a fresh perspective that can lead to breakthrough insights and solutions."
			},
			{
				type: "conclusion",
				text: "First principles thinking is not just a tool for visionaries like Elon Musk—it's a powerful approach that any business leader can use to solve complex problems and drive innovation. By breaking down challenges to their fundamental truths and building solutions from there, you can discover opportunities that others miss and create value in ways that others haven't imagined."
			}
		]
	}
	// Add more articles as needed
];

const ArticlePage = () => {
	const { slug } = useParams();
	const location = useLocation();
	const gameRef = useRef<HTMLDivElement>(null);

	// Handle old URL format (redirect from /article to new format)
	if (location.pathname === '/article') {
		// Redirect to the slugified version of the first article
		const defaultArticle = articles[0];
		const defaultSlug = slugify(defaultArticle.title);
		return <Navigate to={`/${defaultSlug}`} replace />;
	}

	// Find the article that matches the provided slug
	const article = slug
		? articles.find(a => slugify(a.title) === slug)
		: articles[0];

	// If no matching article is found, use the default article
	const fullArticle = article || articles[0];

	// Function to scroll to the game component
	const scrollToGame = () => {
		gameRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Set page title based on article
	useEffect(() => {
		document.title = `${fullArticle.title} | SheldonAI`;
	}, [fullArticle.title]);

	return (
		<div className="min-h-screen bg-white">
			<NavBar />

			{/* Article Content - with adjusted spacing for better layout flow after banner removal */}
			<section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
				<article>
					{/* Article header info moved here to maintain context */}
					<div className="mb-8">
						<h1 className="text-3xl md:text-4xl font-bold mb-4">
							{fullArticle.title}
						</h1>
						<p className="text-lg sm:text-xl text-gray-700 mb-6">
							{fullArticle.subtitle}
						</p>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 pb-6">
							<div className="flex items-center space-x-4 mb-4 sm:mb-0">
								<div className="h-12 w-12 bg-brand-green rounded-full flex items-center justify-center text-lg font-semibold text-white">
									CA
								</div>
								<div>
									<p className="font-medium text-gray-900">{fullArticle.author}</p>
									<p className="text-sm text-gray-600">{fullArticle.publishDate}</p>
								</div>
							</div>
							<span className="text-sm text-gray-600">{fullArticle.readTime}</span>
						</div>
					</div>

					<div className="relative h-96 md:h-[500px] mb-10 rounded-xl overflow-hidden">
						<img
							src={fullArticle.heroImage}
							alt={fullArticle.title}
							className="absolute inset-0 w-full h-full object-cover"
						/>
					</div>

					<div className="prose prose-lg max-w-none mb-12">
						{fullArticle.content.map((block, index) => {
							// Check if the next block is the conclusion, and if so, render the game before it.
							// This ensures the game is always before the *last* content block if that block is 'conclusion'.
							if (block.type === 'conclusion') {
								return (
									<React.Fragment key={`game-${index}`}>
										{/* Title and subtitle for the game section */}
										<div className="mt-12 mb-6">
											<h2 className="text-2xl font-bold text-gray-800 underline">Practise your learnings :</h2>
											<p className="text-lg text-gray-600 mt-1 italic">Play the game and apply the concepts</p>
										</div>

										{/* NetflixChallengeGame component moved here, with background color */}
										<div ref={gameRef} className="py-6 px-4 sm:px-6 lg:px-12 w-full max-w-4xl mx-auto bg-[#f6f6f6] rounded-lg shadow-md my-8">
											<NetflixChallengeGame scrollToHeader={scrollToGame} />
										</div>
										{/* Render the conclusion block itself */}
										<div className="bg-gray-50 p-6 rounded-lg border-l-4 border-brand-green my-8">
											<h3 className="font-bold text-xl mb-3">Conclusion</h3>
											<p>{block.text}</p>
										</div>
									</React.Fragment>
								);
							}

							// Original rendering for other content types
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
								default:
									return null;
							}
						})}
					</div>
				</article>
			</section>

			{/* Newsletter/Waitlist CTA - matching the home page style */}
			<section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
				<div className="bg-brand-gray rounded-2xl p-8 sm:p-12 relative overflow-hidden">
					<div className="absolute right-0 bottom-0 w-64 h-64 bg-brand-green opacity-10 rounded-full -mr-20 -mb-20"></div>
					<div className="relative z-10 max-w-lg">
						<BookText className="w-10 h-10 text-brand-green mb-4" />
						<h2 className="text-3xl font-bold mb-4">Want to stay updated?</h2>
						<p className="text-gray-600 mb-6">
							Join our waitlist to receive updates on our launch and exclusive tips for case preparation.
						</p>
						<div className="max-w-md">
							<WaitlistForm />
						</div>
					</div>
				</div>
			</section>

			{/* Using global Footer component */}
			<Footer />
		</div>
	);
};

export default ArticlePage;
