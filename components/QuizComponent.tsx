"use client";

import { useEffect, useState } from "react";
import type { QuizData } from "./actions/generateQuiz";
import Loader from "./Loader";
import { saveQuiz } from "./actions/saveQuiz";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Bookmark,
    CheckCircle2,
    Code2,
    Loader2,
    RotateCcw,
    Send,
    XCircle,
} from "lucide-react";
import { Quiz } from "@/app/generated/prisma/client";
export type NewQuiz = Omit<Quiz, "id" | "createdAt" | "updatedAt">;

// The component now manages its own state for interactivity
const QuizComponent = ({
    quizData,
    isLoading,
    error,
    generateNextQuiz,
    difficulty,
    language,
    userId,
}: {
    quizData: QuizData | null;
    isLoading: boolean;
    error: string | null;
    generateNextQuiz: () => void;
    difficulty: string;
    language: string;
    userId: string;
}) => {
    // const user = currentUser();
    // State to track the user's selected choice index
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<
        number | null
    >(null);
    // State to show whether the user has submitted their answer
    const [showResult, setShowResult] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const router = useRouter();

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

    const handleQuizSave = async () => {
        try {
            setSaving(true);
            const quizDataNew: NewQuiz = {
                question: quizData?.question || "",
                codeSnippet: quizData?.code_snippet || "",
                difficulty: difficulty,
                language: language,
                choices: quizData?.choices || [],
                correctAnswerIndex: quizData?.correct_answer_index || 0,
                explanation: quizData?.explanation || "",
                userId: userId,
            };
            const result = await saveQuiz(quizDataNew);
            router.refresh();
            if (result.success) {
                toast("Quiz saved successfully!");
            } else if (!result.success && !result.error) {
                toast("Quiz already exists!");
            } else {
                toast("Quiz saving failed!");
            }
        
        } catch (error) {
            toast("Quiz saving Failed!");
            console.log(error);
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center text-slate-500 mt-8 flex flex-col items-center justify-center gap-1">
                <Loader size={56} 
                color="#6366f1" 
                text="Generating your challenge..."
                className="text-slate-600" /> 
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
        
        <section className="mt-8 p-6 rounded-2xl shadow-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100">
            <div className="space-y-6">
                {/* Question Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                            Question
                        </h3>
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-gray-800 leading-relaxed text-base">
                            {quizData.question}
                        </p>
                    </div>

                    {/* Code Snippet */}
                    <div className="relative">
                        <div className="absolute -top-2.5 left-4 z-10 px-3 py-1 bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-md shadow-sm">
                            <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                                <Code2 className="w-3 h-3" />
                                Code
                            </span>
                        </div>
                        <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 mt-3">
                            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                                    <span className="opacity-60">
                                        example.
                                        {language.toLowerCase() || "code"}
                                    </span>
                                </div>
                            </div>
                            <pre className="p-5 text-slate-200 text-sm overflow-x-auto font-mono leading-relaxed">
                                <code>{quizData.code_snippet}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Choices Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                        <h3 className="font-bold text-gray-800 text-base">
                            Answer Options
                        </h3>
                    </div>

                    <ul className="space-y-3">
                        {quizData.choices.map((choice, index) => {
                            const isCorrect =
                                index === quizData.correct_answer_index;
                            const isSelected = index === selectedChoiceIndex;
                            const isWrongSelected =
                                showResult && isSelected && !isCorrect;

                            // Determine button styling based on state
                            let buttonClasses =
                                "group relative overflow-hidden rounded-xl transition-all duration-300 w-full ";

                            if (showResult) {
                                if (isWrongSelected) {
                                    buttonClasses +=
                                        "border-2 border-red-500 bg-gradient-to-r from-red-50 to-rose-50 shadow-lg";
                                } else if (isSelected && isCorrect) {
                                    buttonClasses +=
                                        "border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg";
                                } else {
                                    buttonClasses +=
                                        "border-2 border-gray-200 bg-white opacity-75";
                                }
                            } else {
                                if (isSelected) {
                                    buttonClasses +=
                                        "border-2 border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-md";
                                } else {
                                    buttonClasses +=
                                        "border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5";
                                }
                            }

                            return (
                                <li key={index}>
                                    <button
                                        onClick={() =>
                                            handleSelectChoice(index)
                                        }
                                        disabled={showResult}
                                        className={buttonClasses}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        <div className="flex items-start gap-4 p-4 relative z-10">
                                            <div
                                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                                    showResult && isCorrect && isSelected
                                                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
                                                        : isWrongSelected
                                                        ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md"
                                                        : isSelected
                                                        ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md"
                                                        : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-blue-100 group-hover:to-blue-200 group-hover:text-blue-700"
                                                }`}
                                            >
                                                {String.fromCharCode(
                                                    65 + index
                                                )}
                                            </div>
                                            <p
                                                className={`flex-1 mt-1.5 text-base leading-relaxed text-left ${
                                                    showResult && isCorrect && isSelected
                                                        ? "text-gray-800 font-medium"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {choice}
                                            </p>
                                            {showResult && isCorrect && isSelected &&(
                                                <div className="flex-shrink-0 p-1.5 rounded-full bg-green-500 text-white shadow-md animate-pulse">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                            )}
                                            {isWrongSelected && (
                                                <div className="flex-shrink-0 p-1.5 rounded-full bg-red-500 text-white shadow-md">
                                                    <XCircle className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                    {!showResult ? (
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={saving || !userId}
                            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Submit Answer
                        </button>
                    ) : (
                        <>
                            {isCorrect ? (
                                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-200">
                                    <button
                                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        onClick={generateNextQuiz}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        Generate Next
                                    </button>

                                    <button
                                        className=" w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        onClick={handleQuizSave}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving Quiz...
                                            </>
                                        ) : (
                                            <>
                                                <Bookmark className="w-4 h-4" />
                                                Save Quiz
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-gray-700 text-white rounded-xl font-semibold hover:from-slate-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    onClick={handleTryAgain}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Try Again
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Explanation Section - Only show if answer is correct */}
                {showResult && isCorrect && (
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                        <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/60 rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        ✅ Correct!
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                                    </h4>
                                    <p className="text-gray-700 mb-2">
                                        Well done! You got it right.
                                    </p>
                                    <div className="pt-3 border-t border-green-200/50">
                                        <p className="text-gray-700 leading-relaxed">
                                            {quizData.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Simple feedback for wrong answer - no explanation */}
                {showResult && !isCorrect && (
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-rose-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                        <div className="relative bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60 rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md">
                                    <XCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        ❌ Incorrect
                                        <div className="w-8 h-0.5 bg-gradient-to-r from-red-400 to-rose-400 rounded-full"></div>
                                    </h4>
                                    <p className="text-gray-700">
                                        That is not quite right. Try again to
                                        find the correct answer!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default QuizComponent;
