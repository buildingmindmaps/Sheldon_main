import React, { FC, useState,usEffect, useMemo } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// In a real project, import these from 'lucide-react'
// import { Search, Settings, UserCircle, XCircle, ArrowLeft } from 'lucide-react';

import DOMPurify from 'dompurify';

// --- Placeholder Components (for self-containment) ---
const Search: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const Settings: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.73l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const UserCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.52 19c.64-2.2 1.84-4 3.22-5.26C10.1 12.6 11.5 12 13 12h0c1.5 0 2.9.6 4.26 1.74 1.38 1.26 2.58 3.06 3.22 5.26"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const XCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const ArrowLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;


//<editor-fold desc="TypeScript Types and Interfaces">
interface SWOTAppProps {
  onBack: () => void;
}

interface AppTheme {
  colors: {
    background: string;
    primary: string;
    lightBlue: string;
    buttonText: string;
    gradients: {
      purple: { start: string; end: string; };
      green: { start: string; end: string; };
      blue: { start: string; end: string; };
    };
  };
}

interface ModulePartBase { title: string; content: string; interactionType: string; }
interface ImageInteraction extends ModulePartBase { interactionType: 'image'; imageSrc: string; imageAlt: string; }
interface MultipleChoiceSingle extends ModulePartBase { interactionType: 'multiple_choice_single'; question: string; options: string[]; correctAnswer: string; explanation: string; hotspots?: { term: string; definition: string }[]; }
interface QuizMultipleCorrect extends ModulePartBase { interactionType: 'quiz_multiple_correct'; question: string; options: string[]; correctAnswers: string[]; explanation: string; }
interface TrueFalseStatement extends ModulePartBase { interactionType: 'true_false_statement'; question: string; correctAnswer: boolean; explanation: string; }
interface DragAndDropOrdering extends ModulePartBase { interactionType: 'drag_and_drop_ordering'; question: string; items: string[]; correctOrder: string[];onCorrect: () => void; onIncorrect: () => void; }
interface ScenarioDecisionMaking extends ModulePartBase { interactionType: 'scenario_decision_making'; scenario: string; choices: { text: string; feedback: string }[]; correctChoice: string; }
interface MatchingTermToDefinition extends ModulePartBase { interactionType: 'matching_term_to_definition'; question: string; pairs: { term: string; definition: string }[]; customStyles?: { [key: string]: string | boolean }; }
interface CategorySorting extends ModulePartBase { interactionType: 'category_sorting'; question: string; categories: string[]; items: { text: string; category: string }[]; }
interface CustomTowsVisualization extends ModulePartBase { interactionType: 'custom_tows_visualization'; customStyles?: { [key: string]: string }; }
interface HotspotTextInteractionType extends ModulePartBase { interactionType: 'hotspot_text_interaction'; hotspots: {term: string; definition: string}[]; }
type ModulePartType = | ImageInteraction | MultipleChoiceSingle | QuizMultipleCorrect | TrueFalseStatement | DragAndDropOrdering | ScenarioDecisionMaking | MatchingTermToDefinition | CategorySorting | CustomTowsVisualization | HotspotTextInteractionType;
interface HeaderProps { courseTitle: string; onBack: () => void; }
interface ProgressBarProps { currentPart: number; totalParts: number; }
interface ModuleCompletionMessageProps { onClose: () => void; onRestart: () => void; }
interface ModulePartProps { part: ModulePartType; onCompletePart: () => void; }
interface InteractionProps { onCorrect: () => void; onIncorrect: () => void; }
interface MultipleChoiceSingleProps extends InteractionProps { question: string; options: string[]; correctAnswer: string; explanation: string; }
interface QuizMultipleCorrectProps extends InteractionProps { question: string; options: string[]; correctAnswers: string[]; explanation: string; }
interface TrueFalseStatementProps extends InteractionProps { question: string; correctAnswer: boolean; explanation: string; }
interface DragAndDropOrderingProps extends InteractionProps { question: string; items: string[]; correctOrder:  string[];onCorrect: () => void;onIncorrect: () => void; }
interface ScenarioDecisionMakingProps extends InteractionProps { scenario: string; choices: { text: string; feedback: string }[]; correctChoice: string; }
interface MatchingTermToDefinitionProps extends InteractionProps { question: string; pairs: { term: string; definition: string }[]; customStyles?: { [key: string]: string | boolean }; }
interface CategorySortingProps extends InteractionProps { question: string; categories: string[]; items: { text: string; category: string }[]; }
interface HotspotTextInteractionProps { text: string; hotspots: { term: string; definition: string }[]; }
interface TOWSMatrixVisualizationProps { customStyles?: { [key: string]: string }; }
interface HighlightDifficultWordsProps { html: string; }
//</editor-fold>
// Icon Components
const LightningIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5Z"/>
  </svg>
);
//<editor-fold desc="Theme and Data">
const theme: AppTheme = {
  colors: {
    background: '#f8f9fa', primary: '#6f42c1', lightBlue: '#eef2ff', buttonText: '#ffffff',
    gradients: { purple: { start: '#8a2be2', end: '#6f42c1' }, green: { start: '#28a745', end: '#218838' }, blue: { start: '#007bff', end: '#0056b3' }, },
  },
};
const difficultWords: Record<string, string> = { "framework": "A basic structure underlying a system, concept, or text.", "strategic": "Relating to the identification of long-term or overall aims and interests and the means of achieving them.", "vulnerable": "Exposed to the possibility of being attacked or harmed, either physically or emotionally.", "mitigation": "The action of reducing the severity, seriousness, or painfulness of something.", "systematically": "According to a fixed plan or system; methodically.", };
//</editor-fold>

//<editor-fold desc="Child Components">

// UPDATED: Header component now includes the onBack prop and a back button
const Header: FC<HeaderProps> = ({ courseTitle, onBack }) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-20 border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft width={24} height={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold flex-grow text-gray-800">
            {courseTitle}
            </h1>
        </div>
        <nav className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200"> <ArrowLeft width={24} height={24} /> </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200"> <ArrowLeft width={24} height={24} /> </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200"> <UserCircle width={24} height={24} /> </button>
        </nav>
      </div>
    </header>
  );
};

const ProgressBar: FC<ProgressBarProps> = ({ currentPart, totalParts }) => {
  const progressPercentage = totalParts > 0 ? (currentPart / totalParts) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-4">
      <motion.div className="h-2.5 rounded-full" style={{ background: `linear-gradient(to right, ${theme.colors.gradients.green.start}, ${theme.colors.gradients.green.end})`}} initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
      <div className="mt-1 text-xs text-gray-600 text-right"> {Math.round(progressPercentage)}% complete • {currentPart} of {totalParts} sections </div>
    </div>
  );
};

const ModuleCompletionMessage: FC<ModuleCompletionMessageProps> = ({ onClose, onRestart }) => (
  <motion.div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10 z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center max-w-md w-full" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
      <svg className="w-20 h-20 text-green-500 mb-4" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="2" fill="#D1FAE5" />
        <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} stroke="#10B981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
      </svg>
      <h2 className="text-2xl font-bold mb-2 text-green-700">Congratulations!</h2>
      <p className="text-gray-700 mb-6 text-center">You have successfully completed this module. Keep up the great work!</p>
      <div className="flex gap-4">
        <button onClick={onRestart} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow transition-all duration-200"> Restart Module </button>
        <button onClick={onClose} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition-all duration-200"> Close </button>
      </div>
    </motion.div>
  </motion.div>
);

const HighlightDifficultWords: FC<HighlightDifficultWordsProps> = ({ html }) => {
  const [tooltip, setTooltip] = useState<{ visible: boolean; word: string; definition: string; x: number; y: number }>({ visible: false, word: '', definition: '', x: 0, y: 0 });
  function escapeRegExp(string: string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  const words = Object.keys(difficultWords).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${words.map(escapeRegExp).join('|')})\\b`, 'gi');
  const processedHtml = html.replace(regex, (match) => { const key = match.toLowerCase(); if (difficultWords[key]) { return `<span class="difficult-word" tabindex="0" data-word="${key}" data-definition="${difficultWords[key]}">${match}</span>`; } return match; });
  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => { const target = e.target as HTMLElement; if (target.classList && target.classList.contains('difficult-word')) { const rect = target.getBoundingClientRect(); setTooltip({ visible: true, word: target.dataset.word || '', definition: target.dataset.definition || '', x: rect.left + rect.width / 2, y: rect.top, }); } };
  const handleMouseOut = () => { setTooltip(prev => ({ ...prev, visible: false })); };
  const sanitizedHtml = DOMPurify.sanitize(processedHtml);
  return (
    <div className="relative">
      <div className="prose max-w-none leading-relaxed tracking-normal" style={{ wordSpacing: '0.08em', lineHeight: '1.8', fontSize: '1.08rem' }} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} />
      {tooltip.visible && <div className="fixed z-50 bg-white text-gray-900 rounded-lg shadow-lg px-4 py-2 text-sm border border-gray-200" style={{ left: `${tooltip.x}px`, top: `${tooltip.y - 10}px`, transform: 'translate(-50%, -100%)', pointerEvents: 'none', minWidth: '200px', maxWidth: '90vw', }} role="tooltip" aria-live="polite"> <span className="font-semibold text-indigo-700">{tooltip.word}</span>: {tooltip.definition} </div>}
      <style>{`.difficult-word { border-bottom: 1.5px dotted #22c55e; cursor: help; border-radius: 0.375rem; padding: 0 1px; transition: box-shadow 0.2s; outline: none; background: none; } .difficult-word:hover { box-shadow: 0 2px 8px 0 rgba(34,197,94,0.15); }`}</style>
    </div>
  );
}

const TOWSMatrixVisualization: FC<TOWSMatrixVisualizationProps> = ({ customStyles = {} }) => {
    const styles = {
    backgroundColor: customStyles.backgroundColor || 'bg-gray-50',
    borderColor: customStyles.borderColor || 'border-gray-200',
    textColor: customStyles.textColor || 'text-gray-700',
    headingColor: customStyles.headingColor || 'text-gray-800',
    highlightColor: customStyles.highlightColor || 'bg-blue-50'
  };

  const strategies = [
    { type: 'SO Strategies', heading: 'Strengths-Opportunities', description: 'Leverage internal strengths to capitalize on external opportunities', examples: ['Market expansion', 'New product development', 'Strategic acquisitions'] },
    { type: 'ST Strategies', heading: 'Strengths-Threats', description: 'Use organizational strengths to minimize external threats', examples: ['Quality improvement', 'Competitive positioning', 'Risk mitigation'] },
    { type: 'WO Strategies', heading: 'Weaknesses-Opportunities', description: 'Improve internal weaknesses by leveraging external opportunities', examples: ['Strategic partnerships', 'Technology adoption', 'Capability development'] },
    { type: 'WT Strategies', heading: 'Weaknesses-Threats', description: 'Defensive strategies to minimize weaknesses and avoid threats', examples: ['Cost reduction', 'Market focus', 'Business model redesign'] }
  ];

  
  return (
    <div className={`my-6 rounded-lg shadow-sm overflow-hidden ${styles.backgroundColor} border ${styles.borderColor}`}>
      <div className={`p-4 border-b ${styles.borderColor}`}>
        <h3 className={`font-semibold ${styles.headingColor}`}>TOWS Strategic Matrix</h3>
        <p className={`text-sm ${styles.textColor}`}>Combining SWOT elements to develop actionable strategies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {strategies.map(strategy => (
          <div key={strategy.type} className={`p-4 rounded-lg border ${styles.borderColor}`}>
            <h4 className={`font-medium mb-2 ${styles.headingColor}`}>{strategy.type}</h4>
            <p className={`text-sm mb-2 italic ${styles.textColor}`}>{strategy.description}</p>
            <div className={`${styles.highlightColor} rounded-md p-3 mt-2`}>
              <p className="text-sm font-medium mb-1">Example Strategies:</p>
              <ul className="text-sm list-disc pl-4 space-y-1">
                {strategy.examples.map((example, i) => <li key={i}>{example}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className={`border-t ${styles.borderColor} p-4 text-sm ${styles.textColor}`}>
        <p>Apply these strategy types to translate SWOT findings into concrete action plans.</p>
      </div>
    </div>
  );
};

export interface Item {
    id: string;
    content: string;
}

// Props for the individual sortable item component
interface SortableItemProps {
    item: Item;
    isAnswered: boolean;
    isCorrect: boolean;
}


// SortableItem Component: This is the visual representation of each draggable item.
const SortableItem: FC<SortableItemProps> = ({ item, isAnswered, isCorrect }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
        touchAction: 'none', // Critical for mobile drag-and-drop
    };

    // Dynamic classes for styling based on state
    const answeredCorrectClass = isAnswered && isCorrect ? 'bg-green-100 border-green-500' : '';
    const answeredIncorrectClass = isAnswered && !isCorrect ? 'bg-red-100 border-red-500' : '';
    const cursorClass = isAnswered ? 'cursor-not-allowed' : 'cursor-grab';
    const draggingClass = isDragging ? 'shadow-lg' : '';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`p-3 bg-white border border-gray-300 rounded-md flex items-center justify-between relative ${answeredCorrectClass} ${answeredIncorrectClass} ${cursorClass} ${draggingClass}`}
        >
            <div className="flex items-center w-full">
                {/* The drag handle area */}
                <span
                    {...listeners}
                    className={`text-gray-400 mr-3 ${isAnswered ? '' : 'cursor-grab'}`}
                >
                    ☰
                </span>
                {/* The content of the item */}
                <span>{item.content}</span>
            </div>
        </div>
    );
};

//</editor-fold>

//<editor-fold desc="Interaction Components">
// All interaction components are assumed to be defined as in the original file.
// They are omitted here for brevity but should be included in the final code.
const MultipleChoiceSingleInteraction: FC<MultipleChoiceSingleProps> = ({ question, options, correctAnswer, explanation, onCorrect, onIncorrect }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSubmit = (option: string) => {
    setSelected(option);
    setIsAnswered(true);
    if (option === correctAnswer) {
      setFeedback('Correct! ' + explanation);
      onCorrect();
    } else {
      setFeedback('Incorrect. ' + explanation);
      onIncorrect();
    }
  };

  return (
    <div className="p-6 rounded-lg my-6 border border-blue-200" style={{ backgroundColor: theme.colors.lightBlue }}>
      <p className="font-semibold text-lg mb-4">{question}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <motion.button
            key={option}
            onClick={() => !isAnswered && handleSubmit(option)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border text-left
              ${isAnswered && option === correctAnswer ? 'bg-green-100 border-green-500' : ''}
              ${isAnswered && option === selected && option !== correctAnswer ? 'bg-red-100 border-red-500' : 'bg-white border-gray-300 hover:shadow-md'}
              ${isAnswered ? 'cursor-not-allowed' : ''}
            `}
            disabled={isAnswered}
          >
            {option}
          </motion.button>
        ))}
      </div>
      {feedback && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-sm ${selected === correctAnswer ? 'text-green-700' : 'text-red-700'}`}
        >
          {feedback}
        </motion.p>
      )}
    </div>
  );
};


const QuizMultipleCorrectInteraction: FC<QuizMultipleCorrectProps> = ({ question, options, correctAnswers, explanation, onCorrect, onIncorrect }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    setIsAnswered(true);
    const isCorrect = correctAnswers.every((ans) => selectedOptions.includes(ans)) &&
                      selectedOptions.length === correctAnswers.length;

    if (isCorrect) {
      setFeedback('Correct! ' + explanation);
      onCorrect();
    } else {
      setFeedback('Incorrect. ' + explanation);
      onIncorrect();
    }
  };

  return (
    <div className="p-6 rounded-lg my-6 border border-blue-200" style={{ backgroundColor: theme.colors.lightBlue }}>
      <p className="font-semibold text-lg mb-4">{question}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <motion.button
            key={option}
            onClick={() => handleSelect(option)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border text-left
              ${isAnswered && correctAnswers.includes(option) ? 'bg-green-100 border-green-500' : ''}
              ${isAnswered && !correctAnswers.includes(option) && selectedOptions.includes(option) ? 'bg-red-100 border-red-500' : ''}
              ${selectedOptions.includes(option) && !isAnswered ? 'bg-orange-100 border-orange-500' : 'bg-white border-gray-300 hover:shadow-md'}
              ${isAnswered ? 'cursor-not-allowed' : ''}
            `}
            disabled={isAnswered}
          >
            {option}
          </motion.button>
        ))}
      </div>
      {!isAnswered && (
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-shadow duration-200"
        >
          Submit
        </button>
      )}
      {feedback && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-sm ${feedback.startsWith('Correct') ? 'text-green-700' : 'text-red-700'}`}
        >
          {feedback}
        </motion.p>
      )}
    </div>
  );
};

const TrueFalseStatementInteraction: FC<TrueFalseStatementProps> = ({ question, correctAnswer, explanation, onCorrect, onIncorrect }) => {
    const [selected, setSelected] = useState<boolean | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);

    const handleSubmit = (answer: boolean) => {
        setSelected(answer);
        setIsAnswered(true);
        if (answer === correctAnswer) {
            setFeedback('Correct! ' + explanation);
            onCorrect();
        } else {
            setFeedback('Incorrect. ' + explanation);
            onIncorrect();
        }
    };

    return (
        <div className="p-6 rounded-lg my-6 border border-blue-200" style={{ backgroundColor: theme.colors.lightBlue }}>
            <p className="font-semibold text-lg mb-4">{question}</p>
            <div className="flex space-x-4">
                <motion.button
                    onClick={() => !isAnswered && handleSubmit(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg border
                        ${isAnswered && correctAnswer === true ? 'bg-green-100 border-green-500' : ''}
                        ${isAnswered && selected === true && correctAnswer !== true ? 'bg-red-100 border-red-500' : 'bg-white border-gray-300 hover:shadow-md'}
                        ${isAnswered ? 'cursor-not-allowed' : ''}`}
                    disabled={isAnswered}
                >
                    True
                </motion.button>
                <motion.button
                    onClick={() => !isAnswered && handleSubmit(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg border
                        ${isAnswered && correctAnswer === false ? 'bg-green-100 border-green-500' : ''}
                        ${isAnswered && selected === false && correctAnswer !== false ? 'bg-red-100 border-red-500' : 'bg-white border-gray-300 hover:shadow-md'}
                        ${isAnswered ? 'cursor-not-allowed' : ''}`}
                    disabled={isAnswered}
                >
                    False
                </motion.button>
            </div>
            {feedback && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 text-sm ${selected === correctAnswer ? 'text-green-700' : 'text-red-700'}`}
                >
                    {feedback}
                </motion.p>
            )}
        </div>
    );
};

// Main DragAndDropOrderingInteraction Component
const DragAndDropOrderingInteraction: FC<DragAndDropOrderingProps> = ({ question, items, correctOrder, onCorrect, onIncorrect }) => {
    const [currentOrder, setCurrentOrder] = useState<Item[]>(items);
    const [feedback, setFeedback] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);

    // Memoize the item IDs for dnd-kit context
    const itemIds = useMemo(() => currentOrder.map(item => item.id), [currentOrder]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        if (isAnswered) return; // Don't allow re-ordering after answering
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setCurrentOrder((prevOrder) => {
                const oldIndex = prevOrder.findIndex(item => item.id === active.id);
                const newIndex = prevOrder.findIndex(item => item.id === over.id);
                return arrayMove(prevOrder, oldIndex, newIndex);
            });
        }
    }

    const handleSubmit = () => {
        setIsAnswered(true);
        const isCorrect = JSON.stringify(currentOrder.map(i => i.id)) === JSON.stringify(correctOrder.map(i => i.id));
        if (isCorrect) {
            setFeedback('Correct! You have ordered them correctly.');
            onCorrect();
        } else {
            setFeedback('Incorrect. Review the proper sequence.');
            onIncorrect();
        }
    };

    return (
        <div className="p-6 rounded-lg my-6 border border-blue-200 bg-blue-50">
            <p className="font-semibold text-lg mb-4">{question}</p>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {currentOrder.map((item, index) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                isAnswered={isAnswered}
                                isCorrect={isAnswered && correctOrder[index] ? item.id === correctOrder[index].id : false}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {!isAnswered && (
                <button
                    onClick={handleSubmit}
                    className="mt-6 px-6 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-shadow duration-200"
                >
                    Check Order
                </button>
            )}

            {feedback && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 text-sm ${feedback.startsWith('Correct') ? 'text-green-700' : 'text-red-700'}`}
                >
                    {feedback}
                </motion.p>
            )}
        </div>
    );
};

export default DragAndDropOrderingInteraction;

const ScenarioDecisionMakingInteraction: FC<ScenarioDecisionMakingProps> = ({ scenario, choices, correctChoice, onCorrect, onIncorrect }) => {
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);

    const handleSubmit = (choice: { text: string; feedback: string }) => {
        setSelectedChoice(choice.text);
        setIsAnswered(true);
        if (choice.text === correctChoice) {
            setFeedback('Correct! ' + choice.feedback);
            onCorrect();
        } else {
            setFeedback('Incorrect. ' + choice.feedback);
            onIncorrect();
        }
    };

    return (
        <div className="p-6 rounded-lg my-6 border border-blue-200" style={{ backgroundColor: theme.colors.lightBlue }}>
            <p className="font-semibold text-lg mb-4">Scenario:</p>
            <p className="mb-6">{scenario}</p>
            <div className="space-y-4">
                {choices.map((choice) => (
                    <motion.button
                        key={choice.text}
                        onClick={() => !isAnswered && handleSubmit(choice)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`block w-full p-4 rounded-lg border text-left
                            ${isAnswered && choice.text === correctChoice ? 'bg-green-100 border-green-500' : ''}
                            ${isAnswered && choice.text === selectedChoice && choice.text !== correctChoice ? 'bg-red-100 border-red-500' : 'bg-white border-gray-300 hover:shadow-md'}
                            ${isAnswered ? 'cursor-not-allowed' : ''}`}
                        disabled={isAnswered}
                    >
                        {choice.text}
                    </motion.button>
                ))}
            </div>
            {feedback && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 text-sm ${selectedChoice === correctChoice ? 'text-green-700' : 'text-red-700'}`}
                >
                    {feedback}
                </motion.p>
            )}
        </div>
    );
};


const MatchingTermToDefinitionInteraction: FC<MatchingTermToDefinitionProps> = ({ question, pairs, onCorrect, onIncorrect, customStyles }) => {
  const [leftColumn] = useState<string[]>(() => pairs.map(p => p.term).sort(() => Math.random() - 0.5));
  const [rightColumn] = useState<string[]>(() => pairs.map(p => p.definition).sort(() => Math.random() - 0.5));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');

  const styles = {
  containerHeight:
    typeof customStyles?.containerHeight === 'string' || typeof customStyles?.containerHeight === 'number'
      ? customStyles.containerHeight
      : 'auto',
  minHeight:
    typeof customStyles?.minHeight === 'string' || typeof customStyles?.minHeight === 'number'
      ? customStyles.minHeight
      : '60px',
  termBackground: customStyles?.termBackground || 'bg-white',
  definitionBackground: customStyles?.definitionBackground || 'bg-white',
  matchedBackground: customStyles?.matchedBackground || 'bg-green-100',
};


  const columnClass = customStyles?.equalWidth ? "grid-cols-2" : "grid-cols-2";

  const handleLeftClick = (term: string) => {
    if (isAnswered) return;
    setSelectedLeft(selectedLeft === term ? null : term);
  };

  const handleRightClick = (definition: string) => {
    if (isAnswered || !selectedLeft) return;

    const matchedPair = pairs.find(p => p.term === selectedLeft && p.definition === definition);
    if (matchedPair) {
      setMatches(prev => ({ ...prev, [selectedLeft]: definition }));
      setSelectedLeft(null);
      if (Object.keys(matches).length + 1 === pairs.length) {
        setIsAnswered(true);
        setFeedback('Correct! All pairs matched.');
        onCorrect();
      }
    } else {
      setFeedback('Incorrect match, try again.');
      setTimeout(() => setFeedback(''), 1000);
      onIncorrect();
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-lg my-4 sm:my-6 border border-blue-200" style={{ backgroundColor: theme.colors.lightBlue }}>
      <p className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">{question}</p>
      <div className={`grid grid-cols-1 md:${columnClass} gap-3 sm:gap-4`}>
        <div className="space-y-1 sm:space-y-2">
          {leftColumn.map((term) => (
            <motion.button
              key={term}
              onClick={() => handleLeftClick(term)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`block w-full p-3 rounded-md border text-left
                ${selectedLeft === term ? 'bg-orange-100 border-orange-500' : ''}
                ${matches[term] ? styles.matchedBackground + ' border-green-500 cursor-not-allowed' : styles.termBackground + ' border-gray-300 hover:shadow-md'}
                ${isAnswered ? 'cursor-not-allowed' : ''}`}
              style={{ height: styles.containerHeight, minHeight: styles.minHeight, display: 'flex', alignItems: 'center' }}
              disabled={!!matches[term] || isAnswered}
            >
              {term}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {rightColumn.map((definition) => (
            <motion.button
              key={definition}
              onClick={() => handleRightClick(definition)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className={`block w-full p-3 rounded-md border text-left
                ${Object.values(matches).includes(definition) ? styles.matchedBackground + ' border-green-500 cursor-not-allowed' : styles.definitionBackground + ' border-gray-300 hover:shadow-md'}
                ${isAnswered ? 'cursor-not-allowed' : ''}`}
              style={{ height: styles.containerHeight, minHeight: styles.minHeight, display: 'flex', alignItems: 'center' }}
              disabled={Object.values(matches).includes(definition) || isAnswered}
            >
              {definition}
            </motion.button>
          ))}
        </div>
      </div>
      {feedback && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 text-sm ${feedback.startsWith('Correct') ? 'text-green-700' : 'text-red-700'}`}>{feedback}</motion.p>}
    </div>
  );
};

const CategorySortingInteraction: FC<CategorySortingProps> = ({ question, categories, items, onCorrect, onIncorrect }) => {
  type ItemState = { text: string; category: string; currentCategory: string | null };
  const [currentItems, setCurrentItems] = useState<ItemState[]>(() => items.map(item => ({ ...item, currentCategory: null })).sort(() => Math.random() - 0.5));
  const [feedback, setFeedback] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('itemId', itemId);
    setDraggedItem(itemId);
  };

  const handleDrop = (e: React.DragEvent, targetCategory: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    if (itemId) {
      setCurrentItems(prev => prev.map(item => item.text === itemId ? { ...item, currentCategory: targetCategory } : item));
      setDraggedItem(null);
    }
  };

  const handleItemTap = (itemId: string) => {
    if (isAnswered) return;
    setDraggedItem(draggedItem === itemId ? null : itemId);
  };

  const handleCategoryTap = (categoryId: string) => {
    if (isAnswered || !draggedItem) return;
    setCurrentItems(prev => prev.map(item => item.text === draggedItem ? { ...item, currentCategory: categoryId } : item));
    setDraggedItem(null);
  };
  
   const handleUndoPlacement = (itemId: string) => {
    if (isAnswered) return;
    setCurrentItems(prev => prev.map(item =>
      item.text === itemId ? { ...item, currentCategory: null } : item
    ));
  };


  const handleSubmit = () => {
    setIsAnswered(true);
    const allCorrect = currentItems.every(item => item.currentCategory === item.category);
    if (allCorrect) {
      setFeedback('Correct! All items categorized accurately.');
      onCorrect();
    } else {
      setFeedback('Incorrect. Some items are in the wrong category.');
      onIncorrect();
    }
  };

  return (
    <div className="p-6 rounded-lg my-6 border border-blue-200" style={{ backgroundColor: theme.colors.lightBlue }}>
      <p className="font-semibold text-lg mb-4">{question}</p>
       <div className="block md:hidden mb-4 text-sm text-gray-700 p-4 bg-gray-50 rounded-md border border-gray-200">
        <p className="font-medium mb-2">Mobile Instructions:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Tap an item to <span className="text-blue-600 font-medium">select it</span></li>
          <li>Then tap a category to <span className="text-green-600 font-medium">place it there</span></li>
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r pr-4">
           <h4 className="font-medium text-gray-700 mb-3">Items to Sort:</h4>
          <div className="space-y-2">
            {currentItems.filter(item => item.currentCategory === null).map(item => (
              <div
                key={item.text}
                draggable={!isAnswered}
                onDragStart={(e) => handleDragStart(e, item.text)}
                onClick={() => handleItemTap(item.text)}
                className={`p-3 bg-white border rounded-md relative select-none
                  ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${draggedItem === item.text ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                {item.text}
              </div>
            ))}
             {currentItems.filter(item => item.currentCategory === null).length === 0 && (
                <div className="mt-3 px-3 py-2 text-sm text-center text-green-700 bg-green-50 border border-green-200 rounded-md">
                  All items placed! Click "Check Categories".
                </div>
              )}
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(cat => (
            <div
              key={cat}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, cat)}
              onClick={() => handleCategoryTap(cat)}
              className={`p-4 min-h-[120px] rounded-lg border-2
                ${draggedItem ? 'bg-blue-50 cursor-pointer' : ''}
                ${isAnswered ? 'pointer-events-none' : ''}`}
            >
              <h4 className="font-semibold text-lg mb-3 text-deep-blue">{cat}</h4>
              <div className="space-y-2">
                {currentItems.filter(item => item.currentCategory === cat).map(item => (
                  <div key={item.text}
                       className={`p-3 bg-white border rounded-md relative
                         ${isAnswered && item.currentCategory === item.category ? 'border-green-500 bg-green-100' : ''}
                         ${isAnswered && item.currentCategory !== item.category ? 'border-red-500 bg-red-100' : ''}`}>
                    {item.text}
                     {!isAnswered && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUndoPlacement(item.text);}}
                        className="absolute top-1 right-1 text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100"
                        title="Undo placement"
                      >
                       <XCircle width={16} height={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
       {!isAnswered && (
        <button onClick={handleSubmit} disabled={currentItems.some(item => item.currentCategory === null)}
          className={`mt-6 px-6 py-3 rounded-lg font-medium
            ${currentItems.some(item => item.currentCategory === null) 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
          Check Categories
        </button>
      )}

      {feedback && <div className={`mt-4 p-3 text-sm rounded-md ${feedback.startsWith('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{feedback}</div>}
    </div>
  );
};


const HotspotTextInteractionComponent: FC<HotspotTextInteractionProps> = ({ text, hotspots }) => {
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

    const handleMouseEnter = (e: React.MouseEvent, definition: string) => {
        setTooltip({ visible: true, content: definition, x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    let processedText = text;
    hotspots.forEach(hotspot => {
        const regex = new RegExp(`\\b${hotspot.term}\\b`, 'g');
        processedText = processedText.replace(regex, `<span class="hotspot-term" data-definition="${hotspot.definition}">${hotspot.term}</span>`);
    });

    const sanitizedHtml = DOMPurify.sanitize(processedText);

    return (
        <div className="relative text-base leading-relaxed">
            <div
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                onMouseOver={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.classList.contains('hotspot-term')) {
                        handleMouseEnter(e, target.dataset.definition || '');
                    }
                }}
                onMouseOut={(e) => {
                     const target = e.target as HTMLElement;
                    if (target.classList.contains('hotspot-term')) {
                       handleMouseLeave();
                    }
                }}
            />
            {tooltip.visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bg-gray-800 text-white text-xs p-2 rounded-md shadow-lg z-50 pointer-events-none"
                    style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
                >
                    {tooltip.content}
                </motion.div>
            )}
             <style>{`
                .hotspot-term {
                    cursor: help;
                    position: relative;
                    color: #5ca6f9;
                    border-bottom: 1px dotted #5ca6f9;
                }
            `}</style>
        </div>
    );
};


//</editor-fold>

//<editor-fold desc="Module View (Main Content Renderer)">
const ModulePart: FC<ModulePartProps> = ({ part, onCompletePart }) => {
  const handleInteractionCorrect = () => {
    onCompletePart();
  };
   const handleInteractionIncorrect = () => {
    // This now also marks the part as complete, allowing the user to continue.
    onCompletePart();
  };


  const renderInteraction = () => {
    switch (part.interactionType) {
      case 'multiple_choice_single':
        return <MultipleChoiceSingleInteraction {...part} onCorrect={handleInteractionCorrect} onIncorrect={handleInteractionIncorrect} />;
      case 'quiz_multiple_correct':
        return <QuizMultipleCorrectInteraction {...part} onCorrect={handleInteractionCorrect} onIncorrect={handleInteractionIncorrect} />;
      case 'true_false_statement':
        return <TrueFalseStatementInteraction {...part} onCorrect={handleInteractionCorrect} onIncorrect={handleInteractionIncorrect} />;
      case 'drag_and_drop_ordering':
        return <DragAndDropOrderingInteraction {...part} onCorrect={handleInteractionCorrect} onIncorrect={handleInteractionIncorrect} />;
      case 'scenario_decision_making':
        return <ScenarioDecisionMakingInteraction {...part} onCorrect={handleInteractionCorrect} onIncorrect={handleInteractionIncorrect} />;
      case 'matching_term_to_definition':
        return <MatchingTermToDefinitionInteraction {...part} onCorrect={handleInteractionCorrect} onIncorrect={handleInteractionIncorrect} />;
      case 'category_sorting':
        return <CategorySortingInteraction {...part} onCorrect={handleInteractionCorrect} onIncorrect={handleInteractionIncorrect} />;
      case 'hotspot_text_interaction':
         return <HotspotTextInteractionComponent text={part.content} hotspots={part.hotspots} />;
      case 'image':
      case 'custom_tows_visualization':
        return null; // These are rendered directly in the main return
      default:
        return null;
    }
  };
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4 border-gray-100 leading-tight">
        {part.title}
      </h2>
      <HighlightDifficultWords html={part.content} />
      {part.interactionType === 'custom_tows_visualization' && (
        <TOWSMatrixVisualization customStyles={part.customStyles} />)}
      {renderInteraction()}

    </div>
  );
};
//</editor-fold>

//<editor-fold desc="Main App Component">
// UPDATED: Renamed from App to SWOTApp and accept onBack prop
export const SWOTApp: FC<SWOTAppProps> = ({ onBack }) => {
  const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);
  const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());
  const [showCompletion, setShowCompletion] = useState<boolean>(false);

    const moduleContent: ModulePartType[] = [
        // Your module content array goes here. Omitted for brevity.
        { title: 'Introduction to SWOT Analysis', content: "<p ><strong>SWOT analysis</strong> is a strategic planning framework used to identify and analyze an organization's internal <strong>Strengths</strong> and <strong>Weaknesses</strong>, as well as external <strong>Opportunities</strong> and <strong>Threats</strong>.</p><br><p>Imagine you're the CEO of a growing tech startup. To navigate the competitive landscape, you need a clear understanding of where your company excels and where it's vulnerable. That's where SWOT comes in.</p><br> <p>It is typically visualized in a simple 2x2 grid, allowing for a clear overview of factors that impact decision-making.</p>", interactionType: 'image', imageSrc: '', imageAlt: '' },
        { title: 'Why SWOT Analysis Is Important', content: `
        <p>Understanding the importance of SWOT analysis goes beyond just listing factors. It serves as a vital compass for organizations:</p><br>
        <ul>
          <li>&bull; <strong>Strategic Planning:</strong> Enables organizations to systematically evaluate their current position and develop informed strategies.</li>
          <li>&bull; <strong>Risk Management:</strong> Highlights potential threats before they escalate, allowing for proactive mitigation.</li>
          <li>&bull; <strong>Risk Management:</strong> Highlights potential threats before they escalate, allowing for proactive mitigation.</li>
          <li>&bull; <strong>Opportunity Identification:</strong> Uncovers new market or operational opportunities that may have been overlooked.</li>
          <li>&bull; <strong>Competitive Advantage:</strong> Helps businesses leverage their strengths to outperform competitors.</li>
          <li>&bull; <strong>Objective Assessment:</strong> Encourages realistic understanding of both internal capabilities and external environment.</li>
          <li>&bull; <strong>Versatility:</strong> Applicable to businesses, nonprofits, projects, products, and even personal career planning.</li><br>
        </ul>
        <p>The insights gained from a thorough SWOT analysis are invaluable for effective decision-making across various organizational levels.</p>
      `,
 interactionType: 'multiple_choice_single', question: 'Which of these is NOT a primary benefit of SWOT analysis?', options: ["Identifying competitive advantages",
        "Forecasting stock market movements",
        "Highlighting potential threats",
        "Uncovering growth opportunities"], correctAnswer: 'Forecasting stock market movements', explanation: 'SWOT analysis is used for strategic planning and identifying organizational factors, but it is not designed to predict financial market movements, which require different specialized tools and methodologies.',  },
        { title: 'Elements of SWOT Analysis - Strengths & Weaknesses',
      content: `
        <p>The internal elements of SWOT analysis are Strengths and Weaknesses. These are factors that are within the organization's control.</p>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="p-4 font-semibold text-gray-700">Element</th>
                <th class="p-4 font-semibold text-gray-700">Type</th>
                <th class="p-4 font-semibold text-gray-700">Description</th>
                <th class="p-4 font-semibold text-gray-700">Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="p-4"><strong>Strengths</strong></td>
                <td class="p-4">Internal</td>
                <td class="p-4">Positive attributes or resources that provide an advantage</td>
                <td class="p-4">Strong brand, skilled staff, patents</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="p-4"><strong>Weaknesses</strong></td>
                <td class="p-4">Internal</td>
                <td class="p-4">Internal factors that place the organization at a disadvantage</td>
                <td class="p-4">Outdated tech, high turnover, poor finances</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4">Understanding these internal factors is crucial for leveraging what you do well and addressing areas where you fall short.</p>
      `,
      interactionType: 'multiple_choice_single',
      question: "Which of the following is an example of an internal factor in SWOT analysis?",
      options: ["Market trends", "Strong brand", "New technology", "Competition"],
      correctAnswer: "Strong brand",
      explanation: "A strong brand is an internal attribute that provides an advantage.",
    },
    {
      title: 'Elements of SWOT Analysis - Opportunities & Threats',
      content: `
        <p>The external elements of SWOT analysis are Opportunities and Threats. These are factors outside the organization's control but can significantly impact its future.</p>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="p-4 font-semibold text-gray-700">Element</th>
                <th class="p-4 font-semibold text-gray-700">Type</th>
                <th class="p-4 font-semibold text-gray-700">Description</th>
                <th class="p-4 font-semibold text-gray-700">Examples</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="p-4"><strong>Opportunities</strong></td>
                <td class="p-4">External</td>
                <td class="p-4">External factors the organization can exploit for growth</td>
                <td class="p-4">Market trends, new tech, partnerships</td>
              </tr>
              <tr class="hover:bg-gray-50">
                <td class="p-4"><strong>Threats</strong></td>
                <td class="p-4">External</td>
                <td class="p-4">External challenges that could cause trouble for the organization</td>
                <td class="p-4">Competition, regulation, economic shifts</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4">Monitoring and adapting to these external forces are key to an organization's long-term success and resilience.</p>
      `,
      interactionType: 'true_false_statement',
      question: "New technology is always an internal factor for a business.",
      correctAnswer: false,
      explanation: "New technology is an external opportunity that a business can leverage, making it an external factor.",
    },
    {
  title: 'Things to Remember When Conducting SWOT Analysis',
  content: `
    <p>To ensure your SWOT analysis is effective and yields actionable insights, keep these critical points in mind:</p><br>
    <ul>
      <li>&bull; <strong>Be Specific:</strong> Use concrete, data-driven statements rather than vague generalities.</li>
      <li>&bull; <strong>Stay Objective:</strong> Avoid personal biases or groupthink; involve diverse stakeholders and external inputs if needed.</li>
      <li>&bull; <strong>Focus on Both Internal and External Factors:</strong> Strengths/weaknesses are internal; opportunities/threats are external.</li>
      <li>&bull; <strong>Integrate Findings:</strong> Use the insights to develop actionable strategies, not just a list.</li>
      <li>&bull; <strong>Update Regularly:</strong> The business environment evolves, so revisit and revise the analysis periodically.</li>
      <li>&bull; <strong>Use Real Data:</strong> Base assessments on factual information, not assumptions.</li>
    </ul><br>
    <p style="color: #2563eb; font-weight: 400; margin-top: 12px;font-size: 0.875rem; font-style: italic;">
      Instructions: Drag and drop the steps below to arrange them in the correct order. Click "Check Order" when done.
    </p> `,
  interactionType: 'drag_and_drop_ordering',
  question: "Arrange the following steps in the ideal order for conducting an effective SWOT analysis:",
  items: [
    "Integrate Findings into strategies",
    "Be Specific with statements",
    "Update Regularly as the environment evolves",
    "Stay Objective and avoid biases",
  ],
  correctOrder: [
    "Be Specific with statements",
    "Stay Objective and avoid biases",
    "Integrate Findings into strategies",
    "Update Regularly as the environment evolves",
  ],
},
    {
      title: 'Common Mistakes in SWOT Analysis',
      content: `
        <p>Even with its simplicity, a SWOT analysis can go wrong if common mistakes are not avoided:</p>
        <ul>
          <li><strong>Lack of Objectivity:</strong> Allowing biases or internal politics to skew the analysis.</li>
          <li><strong>Vague Statements:</strong> Using unspecific terms that don't lead to actionable insights.</li>
          <li><strong>Ignoring External Factors:</strong> Focusing only on internal issues and missing market changes.</li>
          <li><strong>Overlooking Data:</strong> Not backing up points with evidence or metrics.</li>
          <li><strong>Failure to Act:</strong> Treating SWOT as a checklist rather than a basis for strategy.</li>
        </ul>
        <p class="mt-4">Being aware of these pitfalls will help you conduct a more robust and valuable analysis.</p>
      `,
      interactionType: 'scenario_decision_making',
      scenario: "Your company conducted a SWOT analysis, but primarily focused on its internal strengths and weaknesses, neglecting market shifts and competitor actions. What is the most likely consequence?",
      choices: [
        { text: "The SWOT analysis will be highly accurate and actionable.", feedback: "Incorrect. Ignoring external factors significantly limits the analysis's utility." },
        { text: "The company will miss out on key opportunities and be vulnerable to threats.", feedback: "Correct. A balanced view of internal and external factors is crucial." },
        { text: "The analysis will be too complex and difficult to understand.", feedback: "Incorrect. The issue is about scope, not complexity." },
      ],
      correctChoice: "The company will miss out on key opportunities and be vulnerable to threats.",
    },
    {
      title: 'Pros of SWOT Analysis',
      content: `
        <p>Despite potential pitfalls, SWOT analysis offers several significant advantages that make it a widely adopted strategic tool:</p>
        <ul>
          <li><strong>Simplicity:</strong> Easy to understand and implement.</li>
          <li><strong>Comprehensive View:</strong> Considers both internal and external environments.</li>
          <li><strong>Versatile:</strong> Applicable across industries and organizational sizes.</li>
          <li><strong>Facilitates Discussion:</strong> Encourages cross-functional collaboration and brainstorming.</li>
          <li><strong>Foundation for Action:</strong> Directly informs strategic choices and action plans.</li>
        </ul>
        <p class="mt-4">These inherent strengths contribute to its enduring relevance in strategic management.</p>
      `,
      interactionType: 'matching_term_to_definition',
      question: "Match each SWOT strength with its correct description:",
      pairs: [
        { term: 'Simplicity', definition: 'Easy to understand and implement.' },
        { term: 'Versatile', definition: 'Applicable across industries and organizational sizes.' },
        { term: 'Facilitates Discussion', definition: 'Encourages cross-functional collaboration.' },
      ],
      customStyles: {
        containerHeight: "100px",
        equalWidth: true,
        minHeight: "80px",
        termBackground: "bg-blue-50",
        definitionBackground: "bg-gray-50",
        matchedBackground: "bg-green-50",
      }
    },
    {
      title: 'The TOWS Matrix: Extending SWOT',
      content: `
        <p>The <strong>TOWS Matrix</strong> is an extension of SWOT that focuses on developing strategies by matching internal and external factors. While SWOT identifies the factors, TOWS helps to formulate specific strategies based on those factors.</p>
        
        <div class="bg-gray-50 p-6 rounded-lg shadow-sm my-4">
          <h3 class="font-semibold text-gray-700 mb-3">Strategic Approaches in TOWS</h3>
          <ul class="space-y-2">
            <li><strong>SO (Strengths-Opportunities):</strong> Use strengths to capitalize on opportunities.</li>
            <li><strong>ST (Strengths-Threats):</strong> Use strengths to counteract threats.</li>
            <li><strong>WO (Weaknesses-Opportunities):</strong> Use opportunities to address weaknesses.</li>
            <li><strong>WT (Weaknesses-Threats):</strong> Minimize weaknesses to avoid threats.</li>
          </ul>
        </div>
        
        <p class="mt-4">The TOWS matrix provides a framework for translating the raw insights from SWOT into actionable strategic initiatives.</p>
      `,
      interactionType: 'custom_tows_visualization',
      customStyles: {
        backgroundColor: "bg-gray-50",
        borderColor: "border-gray-200",
        textColor: "text-gray-700",
        headingColor: "text-gray-800",
        highlightColor: "bg-blue-50"
      }
    },
    {
      title: 'Real-World Examples of SWOT Analysis',
      content: `
        <p>To truly grasp the application of SWOT, let's examine real-world scenarios across different industries:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 class="font-semibold text-lg mb-2 text-deep-blue">FMCG Industry</h3>
            <ul>
              <li><strong>Strengths:</strong> Brand equity, wide distribution, product diversity.</li>
              <li><strong>Weaknesses:</strong> High dependency on retailers, low profit margins.</li>
              <li><strong>Opportunities:</strong> Market expansion, e-commerce, health trends.</li>
              <li><strong>Threats:</strong> Economic volatility, intense competition, regulatory changes.</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 class="font-semibold text-lg mb-2 text-deep-blue">Tourism (Galapagos Islands)</h3>
            <ul>
              <li><strong>Strengths:</strong> Unique natural resources, strong community involvement.</li>
              <li><strong>Weaknesses:</strong> Fragile environment, limited infrastructure.</li>
              <li><strong>Opportunities:</strong> Sustainable tourism development, academic partnerships.</li>
              <li><strong>Threats:</strong> Over-tourism, environmental degradation, regulatory changes.</li>
            </ul>
          </div>
        </div>
        <p class="mt-4">These examples demonstrate how SWOT can be applied to varied contexts to gain actionable insights.</p>
      `,
      interactionType: 'category_sorting',
      question: "Categorize the following examples into Internal (Strengths/Weaknesses) or External (Opportunities/Threats) factors.",
      categories: ['Internal Factors', 'External Factors'],
      items: [
        { text: 'Strong brand equity', category: 'Internal Factors' },
        { text: 'New market trends', category: 'External Factors' },
        { text: 'High operational costs', category: 'Internal Factors' },
        { text: 'Intense competition', category: 'External Factors' },
      ],
    },
    {
      title: 'Additional Subtopics & Conclusion',
      content: `
        <p>Beyond the core framework, consider these aspects for a holistic approach to SWOT analysis:</p>\n
        <ul><strong>When to Use SWOT Analysis</strong>
<li>Before launching a new product or service</li>
<li>During strategic planning cycles</li>
<li>When entering new markets</li>
<li>During organizational restructuring</li>
</ul>
<ul><strong>Who Should Be Involved</strong>
<li>Cross-functional teams (marketing, finance, operations, HR)</li>
<li>External stakeholders or consultants for objectivity</li>
<li>Decision-makers and implementers</li>
</ul>
<ul><strong>How to Present SWOT Findings</strong>
<li>Use a 2x2 grid for clarity</li>
<li>Supplement with charts or data tables if needed</li>
<li>Link each point to specific evidence or metrics</li>
  <strong><h2>Summary Table: SWOT vs. TOWS</h2></strong>
  <table style="border-collapse: collapse; width: 100%; background: #fafbfc;">
    <thead>
      <tr>
        <th style="text-align: left; padding: 12px; border-bottom: 2px solid #eaecef;">Aspect</th>
        <th style="text-align: left; padding: 12px; border-bottom: 2px solid #eaecef;">SWOT Analysis</th>
        <th style="text-align: left; padding: 12px; border-bottom: 2px solid #eaecef;">TOWS Matrix</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: bold; padding: 12px; border-bottom: 1px solid #eaecef;">Focus</td>
        <td style="padding: 12px; border-bottom: 1px solid #eaecef;">Identification</td>
        <td style="padding: 12px; border-bottom: 1px solid #eaecef;">Strategy formulation</td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 12px; border-bottom: 1px solid #eaecef;">Structure</td>
        <td style="padding: 12px; border-bottom: 1px solid #eaecef;">2x2 grid</td>
        <td style="padding: 12px; border-bottom: 1px solid #eaecef;">Matrix matching <span>internal/external</span></td>
      </tr>
      <tr>
        <td style="font-weight: bold; padding: 12px;">Output</td>
        <td style="padding: 12px;">List of factors</td>
        <td style="padding: 12px;">Actionable strategies</td>
      </tr>
    </tbody>
  </table>



        <h3 class="font-semibold text-lg mt-4 mb-2 text-deep-blue">Conclusion</h3>
        <p>SWOT analysis is a foundational tool for strategic planning. Its value lies in its simplicity and ability to drive actionable insights when conducted objectively.</p>
      `,
      interactionType: 'quiz_multiple_correct',
      question: "When is it appropriate to use a SWOT analysis? (Select all that apply)",
      options: [
        "Before launching a new product",
        "During annual financial reporting",
        "When entering new markets",
        "During organizational restructuring",
      ],
      correctAnswers: ["Before launching a new product", "When entering new markets", "During organizational restructuring"],
      explanation: "SWOT is best utilized for strategic planning activities like product launches, market entry, and organizational restructuring.",
    },

    ]
    
  const totalParts = moduleContent.length;

  const handleCompletePart = () => {
    setCompletedParts((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentPartIndex);
      return newSet;
    });
  };

  const handleNextPart = () => {
    if (currentPartIndex < totalParts - 1) {
      if (!completedParts.has(currentPartIndex)) handleCompletePart();
      setCurrentPartIndex((prev) => prev + 1);
    } else {
      if (!completedParts.has(currentPartIndex)) handleCompletePart();
      setShowCompletion(true);
    }
  };

  const handlePreviousPart = () => {
    if (currentPartIndex > 0) setCurrentPartIndex((prev) => prev - 1);
  };
  
  const handleRestart = () => {
      setCurrentPartIndex(0);
      setCompletedParts(new Set());
      setShowCompletion(false);
  }

  const isLastPart = currentPartIndex === totalParts - 1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPartIndex]);

  // Logic to disable the continue button
  const currentPart = moduleContent[currentPartIndex];
  const nonInteractiveTypes = ['image', 'custom_tows_visualization', 'hotspot_text_interaction'];
  const isInteractivePart = !nonInteractiveTypes.includes(currentPart.interactionType);
  const isContinueDisabled = isInteractivePart && !completedParts.has(currentPartIndex);

  
  return (
    <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}

            <div className="bg-white border-b px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto mb-2 sm:mb-0">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="responsive-button-text">Back to Modules</span>
                </Button>
                <h1 className="text-lg sm:text-xl font-semibold">SWOT Analysis</h1>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button variant="outline" className="rounded-full border-2 border-[#a3e635] text-black hover:bg-[#a3e635]/10 px-4 sm:px-5 py-1 sm:py-2 bg-white font-medium">
                  <LightningIcon />
                  <span className="ml-1.5">1</span>
                </Button>
                <Button className="rounded-lg bg-[#a3e635] hover:bg-[#d8fca3] text-black font-medium px-4 sm:px-8 py-1 sm:py-2 border-2 border-[#a3e635]">
                  Start Free Trial
                </Button>
              </div>
            </div>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ProgressBar currentPart={completedParts.size} totalParts={totalParts} />

        <AnimatePresence mode="wait">
            <motion.div
                key={currentPartIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 md:p-10 rounded-lg shadow-lg mt-8"
            >
                <ModulePart
                    part={moduleContent[currentPartIndex]}
                    onCompletePart={handleCompletePart}
                />

                <div className="mt-10 flex justify-between">
                    <button onClick={handlePreviousPart} disabled={currentPartIndex === 0} className={`px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 ${currentPartIndex === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        Previous
                    </button>
                    <button 
                        onClick={handleNextPart} 
                        disabled={isContinueDisabled}
                        style={isContinueDisabled ? {} : { // Clear inline styles when disabled for classes to take over
                            backgroundColor: isLastPart ? 'transparent' : theme.colors.primary, 
                            color: theme.colors.buttonText, 
                            backgroundImage: isLastPart ? `linear-gradient(to right, ${theme.colors.gradients.purple.start}, ${theme.colors.gradients.purple.end})` : 'none' 
                        }} 
                        className={`px-8 py-3 rounded-lg font-semibold text-base transition-all duration-300 
                            ${isContinueDisabled 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'hover:bg-black hover:text-white'
                            }`
                        }>
                        {isLastPart ? 'Finish Module' : 'Continue'}
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>

        <AnimatePresence>
            {showCompletion && <ModuleCompletionMessage onClose={onBack} onRestart={handleRestart} />}
        </AnimatePresence>
      </main>
    </div>
  );
};
//</editor-fold>