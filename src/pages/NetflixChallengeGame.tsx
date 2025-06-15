import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Types
type InteractionType =
    | 'multiple_choice_single'
    | 'drag_and_drop_ordering'
    | 'matching_pairs'
    | 'custom_visualization'
    | 'content_only';

// Define base properties for all module parts
interface ModulePartBase {
    title: string;
    content: string;
    interactionType: InteractionType;
    rightFeedback?: string;
    wrongFeedback?: string;
    maxAttempts?: number;
    canSkip?: boolean;
    skipMessage?: string;
}

// Specific module types
interface MultipleChoiceModule extends ModulePartBase {
    interactionType: 'multiple_choice_single';
    question: string;
    options: string[];
    correctAnswer: string;
}

interface DragAndDropModule extends ModulePartBase {
    interactionType: 'drag_and_drop_ordering';
    question: string;
    buckets: { name: string; id: string }[];
    itemsToSort: { id: string; text: string }[];
    correctSorting: { [bucketId: string]: string[] };
}

interface MatchingPairsModule extends ModulePartBase {
    interactionType: 'matching_pairs';
    question: string;
    leftItems: { id: string; text: string }[];
    rightItems: { id: string; text: string }[];
    correctMatches: { [leftId: string]: string };
}

// Custom visualization sub-types share interactionType 'custom_visualization' but have distinct 'subType'
type CustomVisualizationSubType = 'sliders' | 'dropdowns' | 'challenge_analysis' | 'process_analysis';

interface SliderModule extends ModulePartBase {
    interactionType: 'custom_visualization';
    subType: 'sliders';
    question: string;
    componentsToRate: { name: string; initialValue: number; correctValue: number }[];
}

interface DropdownModule extends ModulePartBase {
    interactionType: 'custom_visualization';
    subType: 'dropdowns';
    question: string;
    textSegments: (string | { id: string; options: string[]; correctAnswer: string })[];
}

interface ChallengeAnalysisModule extends ModulePartBase {
    interactionType: 'custom_visualization';
    subType: 'challenge_analysis';
    question: string;
    challengeDropdown: { options: string[]; analysisData: { [key: string]: { problem: string; need: string; assumptions: { id: string; text: string }[]; correctAssumptionId: string } } };
    assumptionsToSort: { id: string; text: string }[];
    correctAssumptionBucketId: string;
}

interface ProcessAnalysisModule extends ModulePartBase {
    interactionType: 'custom_visualization';
    subType: 'process_analysis';
    question: string;
    processDropdown: { options: string[] };
    potentialWastes: { id: string; text: string }[];
    optimizationSuggestions: { [wasteId: string]: string };
}

interface ContentOnlyModule extends ModulePartBase {
    interactionType: 'content_only';
}

// Union type for ModulePart: it can be ANY of the defined module types
type ModulePart =
    | MultipleChoiceModule
    | DragAndDropModule
    | MatchingPairsModule
    | SliderModule
    | DropdownModule
    | ChallengeAnalysisModule
    | ProcessAnalysisModule
    | ContentOnlyModule;


// --- Interaction Components ---

// Utility component for feedback message box
const FeedbackBox = ({ isCorrect, message }: { isCorrect: boolean | null; message: string }) => {
    if (isCorrect === null) return null;
    const bgColor = isCorrect ? 'bg-green-100' : 'bg-red-100';
    const textColor = isCorrect ? 'text-green-800' : 'text-red-800';
    return (
        <div className={`mt-4 p-4 rounded-lg ${bgColor} ${textColor}`}>
            {message}
        </div>
    );
};


// Multiple Choice Single Component
const MultipleChoiceSingle = ({
                                  part,
                                  onAttempt,
                                  showFeedback,
                                  attempted,
                                  currentAttempt,
                              }: {
    part: MultipleChoiceModule;
    onAttempt: (isCorrect: boolean) => void;
    showFeedback: boolean;
    attempted: boolean;
    currentAttempt: number;
}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrectAttempt, setIsCorrectAttempt] = useState<boolean | null>(null);

    const handleSubmit = () => {
        const isCorrect = selectedOption === part.correctAnswer;
        setIsCorrectAttempt(isCorrect);
        onAttempt(isCorrect);
    };

    const getOptionClasses = (option: string) => {
        let classes = 'p-3 border rounded-lg cursor-pointer transition-all duration-200 ';
        if (selectedOption === option) {
            classes += 'bg-blue-200 border-blue-500 ';
        } else {
            classes += 'bg-white border-gray-300 hover:bg-gray-100 ';
        }

        if (attempted && showFeedback) {
            if (option === part.correctAnswer) {
                classes += 'border-green-500 bg-green-100 '; // Correct answer indication
            } else if (selectedOption === option && !isCorrectAttempt) {
                classes += 'border-red-500 bg-red-100 '; // Wrong selected answer indication
            }
        }
        return classes;
    };

    const feedbackMessage = isCorrectAttempt ? part.rightFeedback : `${part.wrongFeedback} (Attempt ${currentAttempt}/${part.maxAttempts || 1})`;

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">{part.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {part.options.map((option) => (
                    <div
                        key={option}
                        className={getOptionClasses(option)}
                        onClick={() => !attempted && setSelectedOption(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>
            {!attempted && (
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Answer
                </button>
            )}
            {attempted && showFeedback && <FeedbackBox isCorrect={isCorrectAttempt} message={feedbackMessage || ''} />}
        </div>
    );
};


// Drag and Drop Ordering Component
const DragAndDropOrdering = ({
                                 part,
                                 onAttempt,
                                 showFeedback,
                                 attempted,
                                 currentAttempt,
                                 isCorrectProp,
                             }: {
    part: DragAndDropModule;
    onAttempt: (isCorrect: boolean) => void;
    showFeedback: boolean;
    attempted: boolean;
    currentAttempt: number;
    isCorrectProp: boolean | null;
}) => {
    const [items, setItems] = useState(part.itemsToSort);
    const [bucketContents, setBucketContents] = useState<{ [key: string]: { id: string; text: string }[] }>(
        part.buckets.reduce((acc, bucket) => ({ ...acc, [bucket.id]: [] }), {})
    );
    const [selectedItem, setSelectedItem] = useState<{ id: string; text: string } | null>(null);
    const [showCorrectSolution, setShowCorrectSolution] = useState(false);

    useEffect(() => {
        // Reset state for new module part
        setItems(part.itemsToSort);
        setBucketContents(part.buckets.reduce((acc, bucket) => ({ ...acc, [bucket.id]: [] }), {}));
        setSelectedItem(null);
        setShowCorrectSolution(false);
    }, [part]);

    const handleItemClick = (item: { id: string; text: string }) => {
        if (attempted || showCorrectSolution) return;
        setSelectedItem(item);
    };

    const handleBucketClick = (bucketId: string) => {
        if (!selectedItem || attempted || showCorrectSolution) return;

        // Remove from previous location (items list or another bucket)
        setItems(prev => prev.filter(item => item.id !== selectedItem.id));
        setBucketContents(prev => {
            const newContents = { ...prev };
            for (const key in newContents) {
                newContents[key] = newContents[key].filter(item => item.id !== selectedItem.id);
            }
            newContents[bucketId] = [...newContents[bucketId], selectedItem];
            return newContents;
        });
        setSelectedItem(null);
    };

    const handleSubmit = () => {
        let allCorrect = true;
        for (const bucketId in part.correctSorting) {
            const correctItems = (part.correctSorting[bucketId] || []).sort();
            const currentItems = (bucketContents[bucketId] || []).map(item => item.id).sort();
            if (correctItems.length !== currentItems.length || !correctItems.every((val, index) => val === currentItems[index])) {
                allCorrect = false;
                break;
            }
        }
        onAttempt(allCorrect);
    };

    const handleShowCorrectAnswer = () => {
        setShowCorrectSolution(true);
        // Populate bucketContents with the correct answers
        const newBucketContents: { [key: string]: { id: string; text: string }[] } = {};
        const allOriginalItems = [...part.itemsToSort];

        part.buckets.forEach(bucket => {
            newBucketContents[bucket.id] = [];
        });

        for (const bucketId in part.correctSorting) {
            part.correctSorting[bucketId].forEach(itemId => {
                const itemFound = allOriginalItems.find(item => item.id === itemId);
                if (itemFound) {
                    newBucketContents[bucketId].push(itemFound);
                }
            });
        }
        setBucketContents(newBucketContents);
        setItems([]);
    };

    const getItemClasses = (item: { id: string; text: string }, bucketId: string | null = null) => {
        let classes = 'px-4 py-2 border rounded-md w-full min-h-[50px] flex items-center justify-center ';
        if (bucketId === null) { // If it's in the initial items list (unsorted pool)
            classes += 'bg-blue-100 border-blue-300 ' + (attempted || showCorrectSolution ? 'cursor-not-allowed opacity-50' : 'cursor-pointer');
            if (selectedItem?.id === item.id) {
                classes += ' ring-2 ring-blue-500 ring-offset-2'; // Highlight selected item
            }
        } else { // If it's in a bucket
            if (showCorrectSolution) {
                const isCorrectlyPlacedInSolution = part.correctSorting[bucketId]?.includes(item.id);
                if (isCorrectlyPlacedInSolution) {
                    classes += 'bg-teal-200 border-teal-600'; // Distinct color for actual correct answer
                } else {
                    classes += 'bg-gray-100 border-gray-400 opacity-50'; // Dim incorrect placements
                }
            } else if (attempted && showFeedback) { // User submitted an answer and got feedback
                const isCorrectlyPlaced = part.correctSorting[bucketId]?.includes(item.id);
                // Apply reversed colors as per user request: Red for correct, Green for incorrect
                if (isCorrectlyPlaced) {
                    classes += 'bg-red-100 border-red-500'; // RED for correct
                } else {
                    classes += 'bg-green-100 border-green-500'; // GREEN for incorrect
                }
            } else {
                classes += 'bg-white border-gray-300';
            }
        }
        return classes;
    }

    const feedbackMessage = isCorrectProp ? part.rightFeedback : `${part.wrongFeedback} (Attempt ${currentAttempt}/${part.maxAttempts || 1})`;

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">{part.question}</p>

            <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-2">Activities to Sort:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-white border border-gray-200 rounded-lg min-h-[60px]">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={getItemClasses(item)}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {part.buckets.map((bucket) => (
                    <div
                        key={bucket.id}
                        onClick={() => handleBucketClick(bucket.id)}
                        className={`p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white min-h-[150px] ${!attempted && !showCorrectSolution && selectedItem ? 'hover:border-blue-500 cursor-pointer' : ''}`}
                    >
                        <h3 className="font-bold text-gray-700 mb-3">{bucket.name}:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {bucketContents[bucket.id].map((item) => (
                                <div key={item.id} className={getItemClasses(item, bucket.id)}>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {!attempted && (
                <button
                    onClick={handleSubmit}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Answer
                </button>
            )}
            {attempted && showFeedback && <FeedbackBox isCorrect={isCorrectProp} message={feedbackMessage || ''} />}

            {/* Show Correct Answer Button: Appears if attempted, incorrect, and solution not yet shown */}
            {attempted && !isCorrectProp && !showCorrectSolution && (
                <button
                    onClick={handleShowCorrectAnswer}
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
                >
                    Show Correct Answer
                </button>
            )}
        </div>
    );
};


// Matching Pairs Component
const MatchingPairs = ({
                           part,
                           onAttempt,
                           showFeedback,
                           attempted,
                           currentAttempt,
                       }: {
    part: MatchingPairsModule;
    onAttempt: (isCorrect: boolean) => void;
    showFeedback: boolean;
    attempted: boolean;
    currentAttempt: number;
}) => {
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<{ left: string; right: string }[]>([]);
    const [isCorrectAttempt, setIsCorrectAttempt] = useState<boolean | null>(null);
    const [attemptedMatches, setAttemptedMatches] = useState<string[]>([]);
    const [shuffledRightItems, setShuffledRightItems] = useState(part.rightItems);

    useEffect(() => {
        // Shuffle right items when the component mounts or part changes
        setShuffledRightItems([...part.rightItems].sort(() => Math.random() - 0.5));
        // Reset state for new module part
        setSelectedLeft(null);
        setSelectedRight(null);
        setMatchedPairs([]);
        setIsCorrectAttempt(null);
        setAttemptedMatches([]);
    }, [part]);

    const handleLeftClick = (id: string) => {
        if (attempted) return;
        setSelectedLeft(id);
        // If a right item was already selected, try to match
        if (selectedRight) {
            tryMatch(id, selectedRight);
        }
    };

    const handleRightClick = (id: string) => {
        if (attempted) return;
        setSelectedRight(id);
        // If a left item was already selected, try to match
        if (selectedLeft) {
            tryMatch(selectedLeft, id);
        }
    };

    const tryMatch = (leftId: string, rightId: string) => {
        if (matchedPairs.some(p => p.left === leftId || p.right === rightId)) {
            // Already matched, or one of the items is already matched
            setSelectedLeft(null);
            setSelectedRight(null);
            return;
        }

        if (part.correctMatches[leftId] === rightId) {
            setMatchedPairs(prev => [...prev, { left: leftId, right: rightId }]);
        } else {
            setAttemptedMatches(prev => [...prev, leftId, rightId]);
            setTimeout(() => {
                setAttemptedMatches(prev => prev.filter(item => item !== leftId && item !== rightId));
            }, 1000); // Briefly show wrong match
        }
        setSelectedLeft(null);
        setSelectedRight(null);
    };

    const handleSubmit = () => {
        const allCorrect = matchedPairs.length === Object.keys(part.correctMatches).length &&
            matchedPairs.every(pair => part.correctMatches[pair.left] === pair.right);
        setIsCorrectAttempt(allCorrect);
        onAttempt(allCorrect);
    };

    const getItemClasses = (id: string, side: 'left' | 'right') => {
        let classes = 'p-3 border rounded-lg cursor-pointer transition-all duration-200 w-full min-h-[60px] flex items-center justify-center ';
        const isMatched = matchedPairs.some(p => (side === 'left' ? p.left === id : p.right === id));
        const isSelected = (side === 'left' && selectedLeft === id) || (side === 'right' && selectedRight === id);
        const isAttemptedWrong = attemptedMatches.includes(id);

        if (isMatched) {
            classes += 'bg-green-200 border-green-500 opacity-70 cursor-not-allowed ';
        } else if (isAttemptedWrong && showFeedback) {
            classes += 'bg-red-200 border-red-500 animate-pulse ';
        } else if (isSelected) {
            classes += 'bg-blue-200 border-blue-500 ';
        } else {
            classes += 'bg-white border-gray-300 hover:bg-gray-100 ';
        }
        return classes;
    };

    const feedbackMessage = isCorrectAttempt ? part.rightFeedback : `${part.wrongFeedback} (Attempt ${currentAttempt}/${part.maxAttempts || 1})`;

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">{part.question}</p>

            {/* Grid layout for mobile and desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-gray-700 mb-2">SOLUTIONS</h3>
                    {part.leftItems.map(item => (
                        <div
                            key={item.id}
                            className={getItemClasses(item.id, 'left')}
                            onClick={() => handleLeftClick(item.id)}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-gray-700 mb-2">CONSEQUENCES</h3>
                    {shuffledRightItems.map(item => (
                        <div
                            key={item.id}
                            className={getItemClasses(item.id, 'right')}
                            onClick={() => handleRightClick(item.id)}
                        >
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>

            {!attempted && (
                <button
                    onClick={handleSubmit}
                    disabled={matchedPairs.length !== Object.keys(part.correctMatches).length}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit All Matches
                </button>
            )}
            {attempted && showFeedback && <FeedbackBox isCorrect={isCorrectAttempt} message={feedbackMessage || ''} />}
        </div>
    );
};


// Custom Visualization Component (for Sliders, Dropdowns, and Challenge/Process Analysis)
const CustomVisualization = ({
                                 part,
                                 onAttempt,
                                 showFeedback,
                                 attempted,
                                 currentAttempt,
                                 onResetInteraction,
                             }: {
    part: SliderModule | DropdownModule | ChallengeAnalysisModule | ProcessAnalysisModule;
    onAttempt: (isCorrect: boolean) => void;
    showFeedback: boolean;
    attempted: boolean;
    currentAttempt: number;
    onResetInteraction: () => void;
}) => {
    const [isCorrectAttempt, setIsCorrectAttempt] = useState<boolean | null>(null);
    const [showCorrectSolution, setShowCorrectSolution] = useState(false);

    // State for sliders
    const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>(
        part.subType === 'sliders' ? part.componentsToRate.reduce((acc, comp) => ({ ...acc, [comp.name]: comp.initialValue }), {}) : {}
    );

    // State for dropdowns
    const [dropdownSelections, setDropdownSelections] = useState<{ [key: string]: string | null }>(
        part.subType === 'dropdowns' ? part.textSegments.filter(s => typeof s !== 'string' && 'id' in s).reduce((acc, s) => ({ ...acc, [(s as { id: string }).id]: null }), {}) : {}
    );

    // State for Challenge Analysis (Page 5)
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
    const [assumptionsList, setAssumptionsList] = useState<Array<{ id: string; text: string }>>(
        (part.subType === 'challenge_analysis' && part.assumptionsToSort) ? part.assumptionsToSort : []
    );
    const [selectedAssumption, setSelectedAssumption] = useState<{ id: string; text: string } | null>(null);
    const [challengeAnalysisFeedback, setChallengeAnalysisFeedback] = useState<{ problem: string; need: string } | null>(null);
    // Removed challengeAssumptionsPool as it wasn't directly used for state management in the current logic.

    // State for Process Analysis (Page 10)
    const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
    const [wasteItems, setWasteItems] = useState<Array<{ id: string; text: string }>>(
        (part.subType === 'process_analysis' && part.potentialWastes) ? part.potentialWastes : []
    );
    const [selectedWasteItem, setSelectedWasteItem] = useState<{ id: string; text: string } | null>(null);
    const [wasteBucket, setWasteBucket] = useState<{ id: string; text: string }[]>([]);
    const [optimizationSuggestion, setOptimizationSuggestion] = useState<string | null>(null);
    // Removed processWastesPool as it wasn't directly used for state management in the current logic.


    useEffect(() => {
        // Reset state based on part.subType change
        if (part.subType === 'sliders') {
            setSliderValues(part.componentsToRate.reduce((acc, comp) => ({ ...acc, [comp.name]: comp.initialValue }), {}));
        } else if (part.subType === 'dropdowns') {
            setDropdownSelections(part.textSegments.filter(s => typeof s !== 'string' && 'id' in s).reduce((acc, s) => ({ ...acc, [(s as { id: string }).id]: null }), {}));
            setShowCorrectSolution(false);
        } else if (part.subType === 'challenge_analysis') {
            setSelectedChallenge(null);
            setAssumptionsList(part.assumptionsToSort);
            setSelectedAssumption(null);
            setChallengeAnalysisFeedback(null);
        } else if (part.subType === 'process_analysis') {
            setSelectedProcess(null);
            setWasteItems(part.potentialWastes);
            setSelectedWasteItem(null);
            setWasteBucket([]);
            setOptimizationSuggestion(null);
        }
        setIsCorrectAttempt(null);
    }, [part]);

    const handleSliderChange = (name: string, value: number) => {
        if (attempted) return;
        setSliderValues(prev => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (id: string, value: string) => {
        if (attempted || showCorrectSolution) return;
        setDropdownSelections(prev => ({ ...prev, [id]: value }));
    };

    const handleShowCorrectDropdownAnswer = () => {
        if (part.subType !== 'dropdowns') return;
        const correctAnswers: { [key: string]: string } = {};
        part.textSegments.forEach(segment => {
            if (typeof segment !== 'string' && 'id' in segment) {
                correctAnswers[segment.id] = segment.correctAnswer;
            }
        });
        setDropdownSelections(correctAnswers);
        setShowCorrectSolution(true);
    };

    const handleRetryDropdown = () => {
        if (part.subType !== 'dropdowns') return;
        // Reset internal state for dropdowns
        setDropdownSelections(part.textSegments.filter(s => typeof s !== 'string' && 'id' in s).reduce((acc, s) => ({ ...acc, [(s as { id: string }).id]: null }), {}));
        setIsCorrectAttempt(null);
        setShowCorrectSolution(false);
        // Call the parent's reset function
        onResetInteraction();
    };


    // Challenge Analysis handlers (Click and Drop)
    const handleChallengeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const challenge = e.target.value;
        setSelectedChallenge(challenge);
        if (part.subType === 'challenge_analysis') {
            const data = part.challengeDropdown.analysisData[challenge];
            setChallengeAnalysisFeedback(data);
            setAssumptionsList(data.assumptions);
            setSelectedAssumption(null);
        }
    };

    const handleClickAssumption = (item: { id: string; text: string }) => {
        if (attempted || showCorrectSolution) return;
        setSelectedAssumption(item);
    };

    const handleClickQuestionBox = () => {
        if (!selectedAssumption || attempted || showCorrectSolution) return;
        setAssumptionsList(prev => prev.filter(a => a.id !== selectedAssumption.id));
        setSelectedAssumption(selectedAssumption);
    };

    // Process Analysis handlers (Click and Drop)
    const handleProcessSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProcess(e.target.value);
    };

    const handleClickWasteItem = (item: { id: string; text: string }) => {
        if (attempted || showCorrectSolution) return;
        setSelectedWasteItem(item);
    };

    const handleClickWasteBucket = () => {
        if (!selectedWasteItem || attempted || showCorrectSolution) return;
        if (!wasteBucket.some(wb => wb.id === selectedWasteItem.id)) {
            setWasteBucket(prev => [...prev, selectedWasteItem]);
            setWasteItems(prev => prev.filter(w => w.id !== selectedWasteItem.id));
        }
        setSelectedWasteItem(null);
    };

    const handleRevealOptimization = () => {
        if (part.subType !== 'process_analysis') return;
        let suggestions = '';
        wasteBucket.forEach(waste => {
            suggestions += part.optimizationSuggestions[waste.id] + ' ';
        });
        setOptimizationSuggestion(suggestions.trim() || "No specific suggestions for selected wastes.");
        onAttempt(true);
    };

    const handleSubmit = () => {
        let allCorrect = true;
        if (part.subType === 'sliders') {
            for (const comp of part.componentsToRate) {
                if (sliderValues[comp.name] !== comp.correctValue) {
                    allCorrect = false;
                    break;
                }
            }
        } else if (part.subType === 'dropdowns') {
            for (const segment of part.textSegments) {
                if (typeof segment !== 'string' && 'id' in segment) {
                    if (dropdownSelections[segment.id] !== segment.correctAnswer) {
                        allCorrect = false;
                        break;
                    }
                }
            }
        } else if (part.subType === 'challenge_analysis') {
            if (selectedChallenge && selectedAssumption) {
                const correctAssumptionId = part.challengeDropdown.analysisData[selectedChallenge].correctAssumptionId;
                allCorrect = selectedAssumption.id === correctAssumptionId;
            } else {
                allCorrect = false;
            }
        }

        setIsCorrectAttempt(allCorrect);
        onAttempt(allCorrect);
    };

    const feedbackMessage = isCorrectAttempt ? part.rightFeedback : `${part.wrongFeedback} (Attempt ${currentAttempt}/${part.maxAttempts || 1})`;

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">{part.question}</p>

            {/* Sliders Sub-type */}
            {part.subType === 'sliders' && (
                <div className="space-y-6">
                    {part.componentsToRate.map(comp => (
                        <div key={comp.name} className="flex flex-col gap-2">
                            <label className="font-medium text-gray-700">{comp.name}: <span className="font-bold">{sliderValues[comp.name]}/10</span></label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={sliderValues[comp.name] || comp.initialValue}
                                onChange={(e) => handleSliderChange(comp.name, parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-lg"
                                disabled={attempted}
                            />
                            {attempted && showFeedback && (
                                <div className="text-sm">
                                    Correct: <span className="font-bold text-green-600">{comp.correctValue}/10</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {!attempted && (
                        <button
                            onClick={handleSubmit}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </button>
                    )}
                </div>
            )}

            {/* Dropdowns Sub-type */}
            {part.subType === 'dropdowns' && (
                <>
                    <div className="text-lg leading-relaxed">
                        {part.textSegments.map((segment, index) => (
                            typeof segment === 'string' ? (
                                <span key={index} dangerouslySetInnerHTML={{ __html: segment }} />
                            ) : (
                                <select
                                    key={segment.id}
                                    onChange={(e) => handleDropdownChange(segment.id, e.target.value)}
                                    value={dropdownSelections[segment.id] || ''}
                                    className={`mx-2 p-2 border rounded-md bg-white ${attempted || showCorrectSolution ? 'disabled:opacity-75 disabled:cursor-not-allowed' : ''}
                  ${showCorrectSolution && dropdownSelections[segment.id] === segment.correctAnswer ? 'border-green-500 bg-green-100' : ''}
                  ${showCorrectSolution && dropdownSelections[segment.id] !== segment.correctAnswer ? 'border-red-500 bg-red-100' : ''}
                  `}
                                    disabled={attempted || showCorrectSolution}
                                >
                                    <option value="" disabled>Select...</option>
                                    {segment.options.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            )
                        ))}
                    </div>
                    {!attempted && (
                        <button
                            onClick={handleSubmit}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </button>
                    )}
                    {attempted && showFeedback && <FeedbackBox isCorrect={isCorrectAttempt} message={feedbackMessage || ''} />}

                    {/* Show Answer and Retry buttons for dropdowns */}
                    {attempted && !isCorrectAttempt && !showCorrectSolution && (
                        <button
                            onClick={handleShowCorrectDropdownAnswer}
                            className="mt-4 mr-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Show Answer
                        </button>
                    )}
                    {(attempted && !isCorrectAttempt && (showCorrectSolution || currentAttempt < (part.maxAttempts || 100))) && (
                        <button
                            onClick={handleRetryDropdown}
                            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
                        >
                            Retry
                        </button>
                    )}
                </>
            )}

            {/* Challenge Analysis Sub-type (Page 5) */}
            {part.subType === 'challenge_analysis' && (
                <div className="space-y-4">
                    <label className="block text-gray-700 font-bold mb-2">Select Challenge:</label>
                    <select
                        className="w-full p-2 border rounded-md"
                        value={selectedChallenge || ''}
                        onChange={handleChallengeSelect}
                        disabled={attempted}
                    >
                        <option value="" disabled>Choose a business challenge...</option>
                        {part.challengeDropdown.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>

                    {selectedChallenge && challengeAnalysisFeedback && (
                        <div className="bg-blue-50 p-4 rounded-md space-y-3">
                            <div>
                                <p className="font-semibold">Step 1: What does everyone obviously see as the problem?</p>
                                <div className="p-3 bg-white border rounded-md">{challengeAnalysisFeedback.problem}</div>
                            </div>
                            <div>
                                <p className="font-semibold">Step 2: What's the underlying customer need?</p>
                                <div className="p-3 bg-white border rounded-md">{challengeAnalysisFeedback.need}</div>
                            </div>
                            <div>
                                <p className="font-semibold mb-2">Step 3: What assumption can be challenged?</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {assumptionsList.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleClickAssumption(item)}
                                            className={`px-4 py-2 bg-blue-100 border border-blue-300 rounded-md cursor-pointer
                        ${selectedAssumption?.id === item.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                        ${attempted || showCorrectSolution ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                                        >
                                            {item.text}
                                        </div>
                                    ))}
                                </div>
                                <div
                                    onClick={handleClickQuestionBox}
                                    className={`p-4 border-2 rounded-md min-h-[100px] flex items-center justify-center
                    ${attempted && showFeedback && selectedAssumption?.id !== part.challengeDropdown.analysisData[selectedChallenge].correctAssumptionId ? 'border-red-500 bg-red-50' : 'border-dashed border-gray-300'}
                    ${!attempted && !showCorrectSolution && selectedAssumption ? 'hover:border-blue-500 cursor-pointer' : ''}
                  `}
                                >
                                    {selectedAssumption ? (
                                        <div className={`px-4 py-2 border rounded-md ${attempted && showFeedback && selectedAssumption.id === part.challengeDropdown.analysisData[selectedChallenge].correctAssumptionId ? 'bg-green-100 border-green-500' : 'bg-orange-100 border-orange-300'}`}>
                                            {selectedAssumption.text}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">Click on an assumption, then click here to question it.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {!attempted && (
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedChallenge || !selectedAssumption}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Analysis
                        </button>
                    )}
                </div>
            )}

            {/* Process Analysis Sub-type (Page 10) */}
            {part.subType === 'process_analysis' && (
                <div className="space-y-4">
                    <label className="block text-gray-700 font-bold mb-2">Step 1: Choose a process type from the dropdown:</label>
                    <select
                        className="w-full p-2 border rounded-md"
                        value={selectedProcess || ''}
                        onChange={handleProcessSelect}
                        disabled={attempted}
                    >
                        <option value="" disabled>Select Process...</option>
                        {part.processDropdown.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>

                    {selectedProcess && (
                        <div className="space-y-3">
                            <p className="font-semibold">Step 2: Identify waste in your chosen process:</p>
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-700 mb-2">POTENTIAL WASTES:</h3>
                                <div className="flex flex-wrap gap-2 p-3 bg-white border border-gray-200 rounded-lg min-h-[60px]">
                                    {wasteItems.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleClickWasteItem(item)}
                                            className={`px-4 py-2 bg-blue-100 border border-blue-300 rounded-md cursor-pointer
                        ${selectedWasteItem?.id === item.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                        ${attempted || showCorrectSolution ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                                        >
                                            {item.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div
                                onClick={handleClickWasteBucket}
                                className={`p-4 border-2 border-dashed border-gray-300 rounded-md min-h-[100px] flex flex-wrap gap-2 items-center justify-center bg-white
                  ${!attempted && !showCorrectSolution && selectedWasteItem ? 'hover:border-blue-500 cursor-pointer' : ''}
                `}
                            >
                                {wasteBucket.length === 0 ? (
                                    <span className="text-gray-500">Click on a waste type, then click here to add it.</span>
                                ) : (
                                    wasteBucket.map(item => (
                                        <div key={item.id} className="px-4 py-2 bg-orange-100 border border-orange-300 rounded-md">
                                            {item.text}
                                        </div>
                                    ))
                                )}
                            </div>
                            {!attempted && (
                                <button
                                    onClick={handleRevealOptimization}
                                    disabled={wasteBucket.length === 0}
                                    className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Step 3: Click to reveal optimization suggestions
                                </button>
                            )}
                            {optimizationSuggestion && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md mt-4">
                                    <p className="font-semibold">Optimization Suggestions:</p>
                                    <p>{optimizationSuggestion}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* FeedbackBox for other subTypes handled at parent level */}
            {attempted && showFeedback && part.subType !== 'process_analysis' && part.subType !== 'dropdowns' && <FeedbackBox isCorrect={isCorrectAttempt} message={feedbackMessage || ''} />}
        </div>
    );
};

// Content Only Component
const ContentOnly = ({ part }: { part: ContentOnlyModule }) => {
    return (
        <div className="p-1 bg-transparent rounded-lg shadow-none">
            <div dangerouslySetInnerHTML={{ __html: part.content }} className="prose mb-4 text-gray-700 leading-relaxed" />
        </div>
    );
};


// Main Interactive Renderer
const ModuleRenderer = ({
                            part,
                            onComplete,
                            currentAttempt,
                            showFeedback,
                            attempted,
                            isCorrectProp,
                            onResetInteraction,
                        }: {
    part: ModulePart;
    onComplete: (isCorrect: boolean) => void;
    currentAttempt: number;
    showFeedback: boolean;
    attempted: boolean;
    isCorrectProp: boolean | null;
    onResetInteraction: () => void;
}) => {

    const renderComponent = () => {
        // Type guards to narrow down the 'part' type based on 'interactionType' and 'subType'
        if (part.interactionType === 'multiple_choice_single') {
            return (
                <MultipleChoiceSingle
                    part={part} // Type is now correctly narrowed to MultipleChoiceModule
                    onAttempt={onComplete}
                    showFeedback={showFeedback}
                    attempted={attempted}
                    currentAttempt={currentAttempt}
                />
            );
        } else if (part.interactionType === 'drag_and_drop_ordering') {
            return (
                <DragAndDropOrdering
                    part={part} // Type is now correctly narrowed to DragAndDropModule
                    onAttempt={onComplete}
                    showFeedback={showFeedback}
                    attempted={attempted}
                    currentAttempt={currentAttempt}
                    isCorrectProp={isCorrectProp}
                />
            );
        } else if (part.interactionType === 'matching_pairs') {
            return (
                <MatchingPairs
                    part={part} // Type is now correctly narrowed to MatchingPairsModule
                    onAttempt={onComplete}
                    showFeedback={showFeedback}
                    attempted={attempted}
                    currentAttempt={currentAttempt}
                />
            );
        } else if (part.interactionType === 'custom_visualization') {
            // Further narrow down based on subType
            if (part.subType === 'sliders') {
                return (
                    <CustomVisualization
                        part={part} // Type is now correctly narrowed to SliderModule
                        onAttempt={onComplete}
                        showFeedback={showFeedback}
                        attempted={attempted}
                        currentAttempt={currentAttempt}
                        onResetInteraction={onResetInteraction}
                    />
                );
            } else if (part.subType === 'dropdowns') {
                return (
                    <CustomVisualization
                        part={part} // Type is now correctly narrowed to DropdownModule
                        onAttempt={onComplete}
                        showFeedback={showFeedback}
                        attempted={attempted}
                        currentAttempt={currentAttempt}
                        onResetInteraction={onResetInteraction}
                    />
                );
            } else if (part.subType === 'challenge_analysis') {
                return (
                    <CustomVisualization
                        part={part} // Type is now correctly narrowed to ChallengeAnalysisModule
                        onAttempt={onComplete}
                        showFeedback={showFeedback}
                        attempted={attempted}
                        currentAttempt={currentAttempt}
                        onResetInteraction={onResetInteraction}
                    />
                );
            } else if (part.subType === 'process_analysis') {
                return (
                    <CustomVisualization
                        part={part} // Type is now correctly narrowed to ProcessAnalysisModule
                        onAttempt={onComplete}
                        showFeedback={showFeedback}
                        attempted={attempted}
                        currentAttempt={currentAttempt}
                        onResetInteraction={onResetInteraction}
                    />
                );
            }
        } else if (part.interactionType === 'content_only') {
            return (
                <ContentOnly part={part} /> // Type is now correctly narrowed to ContentOnlyModule
            );
        }
        return <div className="p-4 bg-red-100 text-red-800 rounded">Unsupported interaction type.</div>;
    };

    return (
        <div className="my-6 bg-transparent p-0 rounded-lg shadow-none">
            <h2 className="text-2xl font-extrabold mb-4 text-gray-800">{part.title}</h2>
            {/* Render content only if it's not the final conclusion with custom reinforcement message */}
            {(part.interactionType !== 'content_only' || part.title !== "Final Takeaway") && (
                <div dangerouslySetInnerHTML={{ __html: part.content }} className="prose mb-6 text-gray-700 leading-relaxed" />
            )}
            {renderComponent()}
        </div>
    );
};

// App Wrapper
const UniversalCourseApp = ({ scrollToHeader }: { scrollToHeader?: () => void }) => {
    const moduleContent: ModulePart[] = [
        {
            title: "Netflix's Challenge: Setting the Scene",
            content: "It's 2005. You're working at Netflix. The company built its success on DVD-by-mail, but problems are mounting. Shipping costs keep rising, customers wait days for popular movies, and inventory management is becoming a nightmare.<br/><br/>Think of this like running a library where every book must be physically mailed to readers and back. The fundamental question is: what business are we really in?<br/><br/><b>Your Task:</b> You're in a strategy meeting. The CEO asks: 'What problem are we actually solving for customers?'",
            interactionType: 'multiple_choice_single',
            question: "Click on the option that best represents what Netflix customers fundamentally want:",
            options: ["Physical DVD ownership", "Fast shipping service", "Instant entertainment access", "Movie rental experience", "Latest technology formats"],
            correctAnswer: "Instant entertainment access",
            rightFeedback: "✅ Excellent! You identified the core need. Netflix customers want instant entertainment access, not DVDs. This first principles insight led to streaming.",
            wrongFeedback: "❌ Think deeper. What's the underlying need that renting satisfies? What would customers want even if DVDs didn't exist?",
            maxAttempts: 3,
            canSkip: false,
        },
        {
            title: "Netflix's First Attempts: The Obvious Solutions",
            content: "Like most companies, Netflix's first instinct was to optimize the existing system:<br/>&bull; Build more distribution centers to reduce shipping time<br/>&bull; Negotiate better rates with postal services<br/>&bull; Create partnerships with video stores for pickup locations<br/><br/>Think of this like trying to make a horse-drawn carriage faster by breeding stronger horses, rather than asking if there's a better way to travel.<br/><br/><b>Your Task:</b> You're evaluating these solutions. Each fixes symptoms but doesn't address the core issue.",
            interactionType: 'drag_and_drop_ordering',
            question: "Click on an item, then click on the bucket where it belongs:",
            buckets: [{ name: "SYMPTOM FIXES", id: "symptom" }, { name: "ROOT CAUSE SOLUTIONS", id: "rootCause" }],
            itemsToSort: [
                { id: "more_dist_centers", text: "More distribution centers" },
                { id: "better_postal_rates", text: "Better postal rates" },
                { id: "video_store_partnerships", text: "Video store partnerships" },
                { id: "long_wait_times", text: "Long wait times for movies" },
                { id: "eliminating_physical_delivery", text: "Eliminating physical delivery" },
            ],
            correctSorting: {
                symptom: ["more_dist_centers", "better_postal_rates", "video_store_partnerships", "long_wait_times"],
                rootCause: ["eliminating_physical_delivery"],
            },
            rightFeedback: "✅ Exactly! Most solutions addressed shipping symptoms, not the fundamental delivery problem. Only eliminating physical delivery tackles the root cause.",
            wrongFeedback: "❌ Not quite. Re-evaluate which of these truly addresses the underlying problem versus just optimizing existing methods.",
            maxAttempts: 2,
            canSkip: true,
            skipMessage: "",
        },
        {
            title: "Netflix's Breakthrough: Breaking It Down",
            content: "Instead of asking 'How do we ship DVDs faster?' the right question was 'What are the fundamental components of movie watching?'<br/><br/>Like breaking down a sandwich to bread, filling, and seasoning - then realizing you could make a wrap instead.<br/><br/><b>The Components:</b><br/>1. Content (the actual movie)<br/>2. Access (getting it to the customer)<br/>3. Convenience (when and where they want it)<br/>4. Selection (having what they want available)<br/><br/><b>Your Task:</b> Looking at these components, which one is the real bottleneck in the DVD model?",
            interactionType: 'custom_visualization',
            subType: 'sliders',
            question: "Rate each component's performance in the DVD model using the slider:",
            componentsToRate: [
                { name: "Content Quality", initialValue: 8, correctValue: 8 },
                { name: "Access Speed", initialValue: 5, correctValue: 2 },
                { name: "Convenience", initialValue: 5, correctValue: 3 },
                { name: "Selection Availability", initialValue: 5, correctValue: 6 },
            ],
            rightFeedback: "✅ Access Speed is the key bottleneck! While Netflix had good content and decent selection, the physical delivery created massive delays. This bottleneck identification led to streaming innovation.",
            wrongFeedback: "❌ Not quite. Re-evaluate which component truly limited Netflix's DVD model. Consider where the biggest friction points were.",
            maxAttempts: 2,
            canSkip: true,
            skipMessage: "",
        },
        {
            title: "Netflix's Solution: Building from Scratch",
            content: "The Realization: Access was the bottleneck. DVDs were just one way to deliver content - but not the best way. Like realizing you don't need to own a car to get transportation; you need mobility.<br/><br/>The New Approach: Netflix started building streaming technology. Instead of moving physical objects, they could move data. Same content, instant access.<br/><br/><b>Your Task:</b> You're presenting this idea to skeptical executives in 2007. Internet speeds are still slow, and streaming quality is poor.",
            interactionType: 'custom_visualization',
            subType: 'dropdowns',
            question: "Complete this presentation by selecting from the dropdown menus:",
            textSegments: [
                "\"We're not in the ",
                { id: "dd1", options: ["DVD", "Shipping", "Entertainment", "Technology"], correctAnswer: "DVD" },
                " business, we're in the ",
                { id: "dd2", options: ["DVD", "Shipping", "Entertainment", "Technology"], correctAnswer: "Entertainment" },
                " business.",
                "<br/><br/>Instead of optimizing ",
                { id: "dd3", options: ["Physical delivery", "Pricing", "Content", "Stores"], correctAnswer: "Physical delivery" },
                ", we're eliminating ",
                { id: "dd4", options: ["Wait times", "Costs", "Shipping", "Selection limits"], correctAnswer: "Wait times" },
                ".",
                "<br/><br/>This lets us offer ",
                { id: "dd5", options: ["Unlimited", "Better", "Premium", "Targeted"], correctAnswer: "Unlimited" },
                " selection with ",
                { id: "dd6", options: ["Zero", "Minimal", "Scheduled", "Instant"], correctAnswer: "Zero" },
                " wait time.\"",
            ],
            rightFeedback: "✅ Perfect! By redefining the business from DVD distribution to entertainment access, Netflix could eliminate wait times entirely through streaming technology.",
            wrongFeedback: "❌ Keep refining your message. Each choice should reflect a fundamental shift in thinking from the old model to the new first principles approach.",
            maxAttempts: 1,
            canSkip: true,
            skipMessage: "",
        },
        {
            title: "Netflix's Lesson: Your Application",
            content: "What Netflix Learned: By thinking from first principles, they discovered they weren't a DVD company - they were an entertainment access company. This insight led to streaming, original content, and global expansion.<br/><br/>The key was asking 'What job are customers hiring us to do?' instead of 'How do we do our current job better?'<br/><br/><b>Your Turn:</b> Think about a business challenge you're familiar with (from work, news, or personal experience).",
            interactionType: 'custom_visualization',
            subType: 'challenge_analysis',
            question: "Choose a business challenge from this dropdown, then work through the analysis:",
            challengeDropdown: {
                options: ["E-commerce delivery delays", "Restaurant wait times", "Software bugs", "Customer service calls", "Meeting inefficiency", "Social media engagement"],
                analysisData: {
                    "E-commerce delivery delays": {
                        problem: "Packages arriving late",
                        need: "Customers want certainty and convenience in receiving purchases",
                        assumptions: [{ id: "ass_1", text: "Products must be shipped from central warehouses" }, { id: "ass_2", text: "Delivery trucks operate only during business hours" }, { id: "ass_3", text: "Customer lives far from fulfillment center" }],
                        correctAssumptionId: "ass_1"
                    },
                    "Restaurant wait times": {
                        problem: "Long queues to get a table",
                        need: "Customers want to enjoy a meal without excessive waiting",
                        assumptions: [{ id: "ass_4", text: "Customers must be physically present to check-in" }, { id: "ass_5", text: "All food must be prepared-to-order" }, { id: "ass_6", text: "The restaurant has limited seating capacity" }],
                        correctAssumptionId: "ass_4"
                    },
                    "Software bugs": {
                        problem: "Software crashing or not performing as expected",
                        need: "Users want reliable and functional software to achieve their tasks",
                        assumptions: [{ id: "ass_7", text: "Developers always write perfect code" }, { id: "ass_8", text: "Testing catches all bugs before release" }, { id: "ass_9", text: "Users provide clear bug reports" }],
                        correctAssumptionId: "ass_8"
                    },
                    "Customer service calls": {
                        problem: "Long hold times and frustrating interactions",
                        need: "Customers want quick and effective resolution to their issues",
                        assumptions: [{ id: "ass_10", text: "All customer issues require speaking to a human" }, { id: "ass_11", text: "Call centers must operate 24/7" }, { id: "ass_12", text: "Agents have access to all necessary information" }],
                        correctAssumptionId: "ass_10"
                    },
                    "Meeting inefficiency": {
                        problem: "Meetings are too long and unproductive",
                        need: "Team members want to collaborate effectively and make decisions efficiently",
                        assumptions: [{ id: "ass_13", text: "All team members must attend every meeting" }, { id: "ass_14", text: "Meetings are the only way to share information" }, { id: "ass_15", text: "Agendas are always followed strictly" }],
                        correctAssumptionId: "ass_13"
                    },
                    "Social media engagement": {
                        problem: "Low likes, shares, and comments on posts",
                        need: "Businesses/individuals want to connect with their audience and build community",
                        assumptions: [{ id: "ass_16", text: "More posts lead to more engagement" }, { id: "ass_17", text: "Viral content is purely accidental" }, { id: "ass_18", text: "Audience is always online" }],
                        correctAssumptionId: "ass_16"
                    }
                }
            },
            assumptionsToSort: [],
            correctAssumptionBucketId: "ass_1",
            rightFeedback: "✅ Great analysis! By questioning the warehouse assumption, companies like Amazon developed local fulfillment centers and same-day delivery solutions.",
            wrongFeedback: "❌ Keep refining your analysis. Ensure you've identified the true underlying need and the most challengeable assumption.",
            maxAttempts: 1,
            canSkip: true,
            skipMessage: "",
        },
        {
            title: "Toyota's Challenge: The Resource Problem",
            content: "It's post-war Japan, 1950s. You're at Toyota facing a seemingly impossible challenge. American car manufacturers like Ford dominate through mass production - making thousands of identical cars efficiently.<br/><br/>But Toyota has a problem: you don't have the capital, resources, or market size to copy their approach. It's like trying to compete with a large restaurant chain when you only have a small kitchen and limited ingredients.<br/><br/>The Conventional Wisdom:<br/>&bull; Large production runs for efficiency<br/>&bull; Big inventories to ensure availability<br/>&bull; Specialized workers doing single tasks<br/><br/><b>Your Task:</b> You're in a planning meeting. The question is: 'How do we compete when we can't match their scale?'",
            interactionType: 'multiple_choice_single',
            question: "Select what you believe is the fundamental purpose of manufacturing:",
            options: [
                "To make products as fast as possible",
                "To maximize profit margins",
                "To transform materials into customer value",
                "To achieve operational efficiency",
                "To optimize production processes"
            ],
            correctAnswer: "To transform materials into customer value",
            rightFeedback: "✅ Perfect! Manufacturing transforms materials into customer value. Everything else - speed, efficiency - are means to this end.",
            wrongFeedback: "❌ Speed and profit are outcomes, not purposes. What fundamental transformation does manufacturing provide?",
            maxAttempts: 3,
            canSkip: false,
        },
        {
            title: "Toyota's Attempts: Following the Playbook",
            content: "Like most companies, Toyota initially tried to copy successful models:<br/>&bull; Attempted smaller-scale mass production<br/>&bull; Built up inventory when possible<br/>&bull; Hired more specialized workers<br/>&bull; Tried to increase production speed<br/><br/>Think of this like a small restaurant trying to compete with McDonald's by making burgers faster, rather than asking what makes a great dining experience.<br/><br/>The Results: Higher costs, quality problems, and inflexibility. The approach that worked for Ford didn't work for Toyota's situation.<br/><br/><b>Your Task:</b> You're seeing these problems firsthand. Each copied solution creates new issues.",
            interactionType: 'matching_pairs',
            question: "Connect each attempted solution with its unintended consequence by clicking the matching pairs:",
            leftItems: [
                { id: "large_production_runs", text: "Large production runs" },
                { id: "building_inventory", text: "Building inventory" },
                { id: "specialized_workers", text: "Specialized workers" },
            ],
            rightItems: [
                { id: "higher_waste", text: "Higher waste from defective batches" },
                { id: "storage_costs", text: "Storage costs and cash flow issues" },
                { id: "bottlenecks", text: "Bottlenecks when one person is absent" },
            ],
            correctMatches: {
                "large_production_runs": "higher_waste",
                "building_inventory": "storage_costs",
                "specialized_workers": "bottlenecks",
            },
            rightFeedback: "✅ Perfect matches! Each 'solution' created new problems because they optimized for scale rather than value creation. This taught Toyota to think differently.",
            wrongFeedback: "❌ Not quite. Re-evaluate which solution led to which unintended consequence. Try again!",
            maxAttempts: 2,
            canSkip: true,
            skipMessage: "",
        },
        {
            title: "Toyota's Breakthrough: Rethinking Manufacturing",
            content: "Instead of 'How do we make cars faster?' Toyota asked 'What creates value in manufacturing?'<br/><br/>Like a chef realizing that a great meal isn't about speed but about fresh ingredients, proper technique, and customer satisfaction.<br/><br/>The Insight: Manufacturing creates value through transformation - turning raw materials into something customers want. Everything else is waste.<br/><br/>The Seven Wastes Identified:<br/>1. Overproduction<br/>2. Waiting<br/>3. Transportation<br/>4. Over-processing<br/>5. Inventory<br/>6. Motion<br/>7. Defects<br/><br/><b>Your Task:</b> Looking at a typical factory, most activities fall into 'value-adding' or 'waste.'",
            interactionType: 'drag_and_drop_ordering',
            question: "Click on an item, then click on the bucket where it belongs:",
            buckets: [{ name: "VALUE-ADDING ACTIVITIES", id: "valueAdding" }, { name: "WASTEFUL ACTIVITIES", id: "wasteful" }],
            itemsToSort: [
                { id: "welding", text: "Welding car parts together" },
                { id: "moving", text: "Moving parts across the factory" },
                { id: "storing", text: "Storing finished cars in lots" },
                { id: "fixing_defects", text: "Fixing manufacturing defects" },
                { id: "painting", text: "Painting the car exterior" },
                { id: "waiting", text: "Waiting for the next batch" },
            ],
            correctSorting: {
                valueAdding: ["welding", "painting"],
                wasteful: ["moving", "storing", "fixing_defects", "waiting"],
            },
            rightFeedback: "✅ Excellent! Only activities that directly transform the product create value. Everything else is waste to be eliminated, not optimized.",
            wrongFeedback: "❌ Which activities directly transform the car into something customers pay for? The rest is overhead.",
            maxAttempts: 2,
            canSkip: true,
            skipMessage: "",
        },
        {
            title: "Toyota's Solution: The New System",
            content: "Toyota built the Toyota Production System(TPS) around eliminating waste:<br/>&bull; Make only what's ordered (pull system)<br/>&bull; Deliver parts exactly when needed (just-in-time)<br/>&bull; Let workers stop production to fix problems immediately<br/>&bull; Continuously improve everything (kaizen)<br/><br/>Like a kitchen that only cooks what customers order, gets ingredients fresh daily, and empowers chefs to maintain quality standards.<br/><br/><b>Your Task:</b> You're implementing this system. Traditional manufacturers think you're crazy - stopping production seems wasteful.",
            interactionType: 'matching_pairs',
            question: "Match each TPS principle to its primary benefit by drawing connections:",
            leftItems: [
                { id: "pull_system", text: "Pull system" },
                { id: "just_in_time", text: "Just-in-time delivery" },
                { id: "worker_empowerment", text: "Worker empowerment" },
                { id: "continuous_improvement", text: "Continuous improvement" },
            ],
            rightItems: [
                { id: "eliminates_overproduction", text: "Eliminates overproduction waste" },
                { id: "reduces_inventory", text: "Reduces inventory costs" },
                { id: "reduces_defects", text: "Reduces defects at source" },
                { id: "drives_optimization", text: "Drives ongoing optimization" },
            ],
            correctMatches: {
                "pull_system": "eliminates_overproduction",
                "just_in_time": "reduces_inventory",
                "worker_empowerment": "reduces_defects",
                "continuous_improvement": "drives_optimization",
            },
            rightFeedback: "✅ Perfect! Each TPS principle directly addresses a specific type of waste, creating a comprehensive system focused on value creation.",
            wrongFeedback: "❌ Review the core impact of each TPS principle. What specific waste or benefit does it address?",
            maxAttempts: 1,
            canSkip: true,
            skipMessage: "",
        },
        {
            title: "Final Takeaway",
            content: "<p><b>Remember:</b> First principles thinking isn't about working harder - it's about questioning whether you're working on the right problem.</p>" +
                "<p>By thinking from first principles about value creation, Toyota discovered that efficiency isn't about speed - it's about eliminating waste. This insight led to becoming the world's largest automaker.</p>" +
                "<p>The key was asking 'What actually creates value?' instead of 'How do we produce more?'</p>" +
                "<p>First principles thinking isn't about having the right answers - it's about asking the right questions. Break down problems to fundamental truths, challenge assumptions, and build solutions from the ground up.</p>",
            interactionType: 'content_only',
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
    const [skippedModules, setSkippedModules] = useState<Set<number>>(new Set()); // Track skipped modules
    const [currentModuleAttempts, setCurrentModuleAttempts] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [attemptedCurrentModule, setAttemptedCurrentModule] = useState(false);
    const [isCorrectAttempt, setIsCorrectAttempt] = useState<boolean | null>(null);


    const currentModule = moduleContent[currentIndex];

    // Effect to handle automatic completion for the final content page
    useEffect(() => {
        if (currentModule && currentIndex === moduleContent.length - 1 && currentModule.interactionType === 'content_only') {
            setCompletedModules(prev => new Set(prev).add(currentIndex));
        }
    }, [currentIndex, moduleContent.length, currentModule]);

    // Defensive check to prevent TypeError if currentModule is undefined
    if (!currentModule) {
        return (
            <div className="p-6 max-w-4xl mx-auto font-sans bg-gray-100 min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading course module...</p>
            </div>
        );
    }


    const handleAttempt = (isCorrect: boolean) => {
        setAttemptedCurrentModule(true);
        setIsCorrectAttempt(isCorrect);
        setShowFeedback(true);

        if (isCorrect) {
            setCompletedModules(prev => new Set(prev).add(currentIndex));
        } else {
            setCurrentModuleAttempts((prev) => prev + 1);
        }
    };

    // New function to reset interaction state for the current module
    const handleResetCurrentInteraction = () => {
        setCurrentModuleAttempts(0);
        setShowFeedback(false);
        setAttemptedCurrentModule(false);
        setIsCorrectAttempt(null);
    };


    const handleSkip = () => {
        setCompletedModules(prev => new Set(prev).add(currentIndex));
        setSkippedModules(prev => new Set(prev).add(currentIndex)); // Track the skipped module
        setCurrentIndex((prev) => Math.min(prev + 1, moduleContent.length - 1));
        setCurrentModuleAttempts(0);
        setShowFeedback(false);
        setAttemptedCurrentModule(false);
        setIsCorrectAttempt(null);
    };

    // Calculate progress based on the number of completed modules, excluding skipped ones
    const completedCount = [...completedModules].filter(moduleIndex => !skippedModules.has(moduleIndex)).length;
    const totalModules = moduleContent.length;
    const currentDisplayProgress = totalModules > 0
        ? Math.round((completedCount / totalModules) * 100)
        : 0;


    const canShowSkipButton = currentModule.canSkip &&
        (currentModuleAttempts >= (currentModule.maxAttempts || 0) || currentModule.maxAttempts === 1);

    // Check if current module is the final content-only page
    const isFinalContentPage = currentModule.interactionType === 'content_only' && currentIndex === moduleContent.length - 1;

    // Determine if the Next Module button should be enabled
    const isNextButtonEnabled =
        (completedModules.has(currentIndex) && currentIndex < moduleContent.length - 1) ||
        (isCorrectAttempt && currentIndex < moduleContent.length - 1) ||
        isFinalContentPage ||
        (canShowSkipButton && !isCorrectAttempt && attemptedCurrentModule);

    return (
        <div className="p-0 max-w-4xl mx-auto font-sans bg-transparent min-h-screen">
            {/* Remove fixed progress bar from here */}
            {/* <div className="fixed top-0 left-0 right-0 bg-white z-10 px-6 pt-4 pb-2 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <motion.div className="bg-gray-300 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-2 bg-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${currentDisplayProgress}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </motion.div>
                </div>
            </div> */}

            {/* Add sticky progress bar here that will be contained within the game container */}
            <div className="sticky top-0 bg-[#f6f6f6] z-10 pt-4 pb-2">
                <motion.div className="bg-gray-300 h-2 rounded-full overflow-hidden">
                    <motion.div
                        className="h-2 bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentDisplayProgress}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </motion.div>
            </div>

            {/* Remove extra top margin that was accounting for fixed header */}
            <div className="mt-2">
                <ModuleRenderer
                    part={currentModule}
                    onComplete={handleAttempt}
                    currentAttempt={currentModuleAttempts}
                    showFeedback={showFeedback}
                    attempted={attemptedCurrentModule}
                    isCorrectProp={isCorrectAttempt}
                    onResetInteraction={handleResetCurrentInteraction}
                />
            </div>

            {/* Non-fixed footer that appears after content */}
            <div className="mt-0 mb-4 p-0 bg-transparent rounded-lg shadow-none">
                <div className="flex justify-between items-center gap-2 overflow-x-auto py-2">
                    {/* Previous Button */}
                    <div>
                        {currentIndex > 0 && (
                            <button
                                onClick={() => {
                                    setCurrentIndex((prev) => Math.max(prev - 1, 0));
                                    handleResetCurrentInteraction();
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base sm:px-6 sm:py-3"
                            >
                                Previous
                            </button>
                        )}
                    </div>

                    {/* Center Buttons (Try Again, Skip) */}
                    <div className="flex gap-2">
                        {!isCorrectAttempt && currentModuleAttempts > 0 && currentModuleAttempts < (currentModule.maxAttempts || 100) && (
                            <button
                                onClick={() => {
                                    setShowFeedback(false);
                                    setAttemptedCurrentModule(false);
                                }}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base sm:px-6 sm:py-3"
                            >
                                Try Again
                            </button>
                        )}

                        {/*{canShowSkipButton && !isCorrectAttempt && (*/}
                        {/*  <button*/}
                        {/*    onClick={handleSkip}*/}
                        {/*    className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base sm:px-6 sm:py-3"*/}
                        {/*  >*/}
                        {/*    Skip Module*/}
                        {/*  </button>*/}
                        {/*)}*/}
                    </div>

                    {/* Next Module / Course Completed Button */}
                    <div>
                        {isNextButtonEnabled ? (
                            <button
                                onClick={() => {
                                    setCompletedModules(prev => {
                                        const newSet = new Set(prev);
                                        newSet.add(currentIndex);
                                        return newSet;
                                    });

                                    if (currentIndex < moduleContent.length - 1) {
                                        setCurrentIndex((prev) => Math.min(prev + 1, moduleContent.length - 1));
                                        handleResetCurrentInteraction();

                                        // Scroll to the header after clicking Next
                                        if (scrollToHeader) {
                                            // Small delay to ensure state updates before scrolling
                                            setTimeout(() => scrollToHeader(), 100);
                                        }
                                    }
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base sm:px-6 sm:py-3"
                                disabled={isFinalContentPage && currentIndex === moduleContent.length - 1}
                            >
                                {currentIndex < moduleContent.length - 1 ? "Next Module" : "Course Completed!"}
                            </button>
                        ) : <div className="w-[60px] sm:w-[120px]"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversalCourseApp;
