"use client";

import { useEffect, useState } from "react";
import type { QuizData } from "./actions/generateQuiz";
import Loader from "./Loader";
// The component now manages its own state for interactivity
const Quiz = ({
    quizData,
    isLoading,
    error,
    generateNextQuiz,
}: {
    quizData: QuizData | null;
    isLoading: boolean;
    error: string | null;
    generateNextQuiz: () => void;
}) => {
    // State to track the user's selected choice index
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<
        number | null
    >(null);
    // State to show whether the user has submitted their answer
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        const resetSelectedChoice = () => {
            setSelectedChoiceIndex(null);
            setShowResult(false);
        };
        resetSelectedChoice();
    }, [quizData]);

    // --- Helper Functions ---

    // Handle when a user clicks a choice button
    const handleSelectChoice = (index: number) => {
        // Don't allow changing answer after submission
        if (showResult) return;
        setSelectedChoiceIndex(index);
    };

    // Handle when the user submits their answer
    const handleSubmitAnswer = () => {
        if (selectedChoiceIndex !== null) {
            setShowResult(true);
        }
    };

    // Handle resetting the quiz to try again
    const handleTryAgain = () => {
        setSelectedChoiceIndex(null);
        setShowResult(false);
    };

    // handle generating next quiz
    // const handleGenerateNext = async() => {
    //   const newGenerated = await generateQuiz(difficulty)
    //   quizData = newGenerated
    // }

    // --- Render Logic ---

    if (isLoading) {
        return (
            <div className="text-center text-slate-500 mt-8 flex flex-col items-center justify-center gap-1">
                <Loader size={28} cuts={6} gapRatio={2} /> Generating your
                challenge...
            </div>
        );
    }
    if (error) {
        return (
            <p className="text-center text-red-500 bg-red-100 p-3 rounded mt-8">
                {error}
            </p>
        );
    }
    if (!quizData) {
        return null; // Don't render if there's no data
    }

    // Determine if the user's answer is correct
    const isCorrect = selectedChoiceIndex === quizData.correct_answer_index;

    return (
        <section className="mt-8 p-6 border rounded-lg shadow-md bg-slate-50">
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-bold mb-2">Question:</h3>
                    <p className="text-slate-700 bg-white p-3 rounded border">
                        {quizData.question}
                    </p>
                    <pre className="mt-2 bg-slate-900 text-slate-300 p-4 rounded-md overflow-x-auto text-sm">
                        {quizData.code_snippet}
                    </pre>
                </div>

                <div>
                    <h3 className="font-semibold text-lg">Choices:</h3>
                    <ul className="space-y-2 mt-2">
                        {quizData.choices.map((choice, index) => {
                            // Dynamic styling based on selection and result
                            let buttonClasses =
                                "w-full text-left flex items-start space-x-2 p-3 rounded border-2 transition-all ";

                            if (showResult) {
                                // After submission, show green for correct, red for incorrect
                                if (
                                    index === selectedChoiceIndex &&
                                    isCorrect
                                ) {
                                    buttonClasses +=
                                        "border-green-500 bg-green-100";
                                } else if (
                                    index === selectedChoiceIndex &&
                                    !isCorrect
                                ) {
                                    buttonClasses +=
                                        "border-red-500 bg-red-100";
                                } else {
                                    buttonClasses +=
                                        "border-slate-200 bg-white";
                                }
                            } else {
                                // Before submission, highlight the selected one
                                if (index === selectedChoiceIndex) {
                                    buttonClasses +=
                                        "border-indigo-500 bg-indigo-100";
                                } else {
                                    buttonClasses +=
                                        "border-slate-200 bg-white hover:border-slate-300";
                                }
                            }

                            return (
                                <li key={index}>
                                    <button
                                        onClick={() =>
                                            handleSelectChoice(index)
                                        } // Call the handler when clicked
                                        disabled={showResult} // Disable buttons after submission
                                        className={buttonClasses}
                                    >
                                        <span className="font-bold text-indigo-600 mt-0.5">
                                            {index + 1}.
                                        </span>
                                        <span>{choice}</span>
                                        {/* Show an icon if this is the correct answer after submission */}
                                        {/* {showResult && index === quizData.correct_answer_index && (
                      <span className="ml-auto text-green-600 font-bold">✓</span>
                    )} */}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-x-4">
                    {!showResult ? (
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={selectedChoiceIndex === null}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <>
                            {isCorrect ? (
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                    onClick={generateNextQuiz}
                                >
                                    Generate Next
                                </button>
                            ) : (
                                <button
                                    className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
                                    onClick={handleTryAgain}
                                >
                                    Try Again
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Explanation - only show after submission */}
                {showResult && (
                    <details className="bg-white p-3 rounded border mt-4">
                        <summary className="font-semibold cursor-pointer">
                            {isCorrect ? "✅ Correct! " : "❌ Incorrect. "} See
                            Explanation
                        </summary>
                        <div className="mt-2 text-slate-700">
                            <p className="font-medium">
                                The correct answer was{" "}
                                <strong>
                                    Choice {quizData.correct_answer_index + 1}
                                </strong>
                                .
                            </p>
                            <p>{quizData.explanation}</p>
                        </div>
                    </details>
                )}
            </div>
        </section>
    );
};

export default Quiz;
