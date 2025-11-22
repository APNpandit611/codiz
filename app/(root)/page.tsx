"use client";
import React, { useEffect, useState } from "react";
import generateQuiz, { type QuizData } from "@/components/actions/generateQuiz";
import {
    getDailyLimit,
    incrementDailyLimit,
} from "@/components/actions/quizLimit";
import { useUser } from "@clerk/nextjs";
import QuizComponent from "@/components/QuizComponent";
import { createUser, getUserData } from "@/components/actions/saveQuiz";
import {
    Code2,
    Sparkles,
    Target,
    Loader2,
    TrendingUp,
    Clock,
    Zap,
    Trophy,
    BarChart3,
    AlertCircle,
    ChevronDown,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

type FormData = {
    difficulty: string;
    language: string;
};

export default function Home() {
    const { user } = useUser();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [formData, setFormData] = useState<FormData>({
        difficulty: "easy",
        language: "javascript",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [limitData, setLimitData] = useState({ count: 0 });
    const MAX: number = 30;

    useEffect(() => {
        // const getLimit = async () => {
        //     setIsClient(true);
        //     const data = await getDailyLimit(user?.id);
        //     setLimitData(data);
        //     setRemaining(MAX - data.count);
        // }
        // getLimit()
        const findUser = async () => {
            const data = await getUserData(user?.id)
            setLimitData({ count: data?.clickCount ?? 0})
            setRemaining(MAX - (data?.clickCount ?? 0));
            setIsClient(true)
        };
        findUser()

    }, [user]);

    useEffect(() => {
        const userCreate = async () => {
            if (isClient) {
                await createUser();
            }
        };
        userCreate();
    }, [isClient]);

    const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generateQuizHandler = async () => {
        if (limitData.count >= MAX) {
            setError("You reached today's limit.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const generatedQuiz = await generateQuiz(
                formData.difficulty,
                formData.language
            );
            await incrementDailyLimit(user?.id);
            const newData = await getDailyLimit(user?.id);
            setLimitData(newData);
            setRemaining(MAX - newData.count);
            setQuiz(generatedQuiz);
        } catch (err) {
            console.log(err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        generateQuizHandler();
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return "from-green-500 to-emerald-600";
            case "medium":
                return "from-yellow-500 to-orange-600";
            case "hard":
                return "from-red-500 to-rose-600";
            default:
                return "from-blue-500 to-indigo-600";
        }
    };

    const getDifficultyBadgeColor = (difficulty: string) => {
        switch (difficulty) {
            case "easy":
                return "bg-green-100 text-green-700 border-green-200";
            case "medium":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "hard":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    // Show loading state while hydrating
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <main className="max-w-6xl mx-auto px-6 py-8">
                    <div className="animate-pulse">
                        <div className="text-center mb-10">
                            <div className="h-12 w-12 bg-gray-200 rounded-2xl mx-auto mb-6"></div>
                            <div className="h-12 bg-gray-200 rounded-lg max-w-md mx-auto mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-6 h-32"
                                ></div>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl p-8 mb-8 h-96"></div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xl mb-6">
                        <Code2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Coding Challenge Generator
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Sharpen your coding skills with personalized challenges
                        tailored to your experience level
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                <Target className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                {remaining !== null ? remaining : 0}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Challenges remaining today
                        </p>
                        <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`bg-gradient-to-r ${getDifficultyColor(
                                        formData.difficulty
                                    )} h-2 rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${
                                            remaining !== null
                                                ? (remaining / MAX) * 100
                                                : 0
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                {MAX}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Daily challenge limit
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                {limitData.count}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Challenges completed today
                        </p>
                    </div>
                </div>

                {/* Generator Form */}
                <form
                    onSubmit={handleGenerate}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Generate New Challenge
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Language Selection */}
                        <div className="space-y-2">
                            <label
                                htmlFor="language"
                                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                            >
                                <Code2 className="w-4 h-4" />
                                Programming Language
                            </label>
                            <div className="relative">
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleFormChange}
                                    id="language"
                                    className="w-full bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 text-gray-900 rounded-xl p-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:border-gray-300"
                                >
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="javascript">
                                        JavaScript
                                    </option>
                                    <option value="c">C</option>
                                    <option value="c++">C++</option>
                                    <option value="ruby">Ruby</option>
                                    <option value="go">Go</option>
                                    <option value="typescript">
                                        TypeScript
                                    </option>
                                    <option value="swift">Swift</option>
                                    <option value="kotlin">Kotlin</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Selection */}
                        <div className="space-y-2">
                            <label
                                htmlFor="difficulty"
                                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Difficulty Level
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.difficulty}
                                    onChange={handleFormChange}
                                    name="difficulty"
                                    id="difficulty"
                                    className="w-full bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 text-gray-900 rounded-xl p-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all hover:border-gray-300"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {["easy", "medium", "hard"].map((level) => (
                                    <span
                                        key={level}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                                            formData.difficulty === level
                                                ? getDifficultyBadgeColor(level)
                                                : "bg-gray-100 text-gray-500 border-gray-200"
                                        }`}
                                    >
                                        {level.charAt(0).toUpperCase() +
                                            level.slice(1)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Current Selection Preview */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    Ready to generate:
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                                        {formData.language
                                            .charAt(0)
                                            .toUpperCase() +
                                            formData.language.slice(1)}
                                    </span>
                                    <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium border border-gray-200">
                                        <span
                                            className={`bg-gradient-to-r ${getDifficultyColor(
                                                formData.difficulty
                                            )} bg-clip-text text-transparent font-semibold`}
                                        >
                                            {formData.difficulty
                                                .charAt(0)
                                                .toUpperCase() +
                                                formData.difficulty.slice(1)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            {remaining !== null && remaining < 5 && (
                                <div className="flex items-center gap-2 text-orange-600 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">
                                        Low remaining!
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        type="submit"
                        disabled={
                            isLoading || (remaining !== null && remaining === 0)
                        }
                        className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold py-4 px-6 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center gap-3 text-lg"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Generating Challenge...</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                <span>Generate Challenge</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center gap-2 text-red-700">
                                <div className="p-1 rounded-full bg-red-100">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}
                </form>

                {/* Quiz Component */}
                <QuizComponent
                    quizData={quiz}
                    isLoading={isLoading}
                    error={error}
                    generateNextQuiz={generateQuizHandler}
                    difficulty={formData.difficulty}
                    language={formData.language}
                    userId={user?.id || ""}
                />
            </main>
        </div>
    );
}
