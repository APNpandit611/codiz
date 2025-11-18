"use client";
import Quiz from "@/components/Quiz";
import React, { useEffect, useState } from "react";
import generateQuiz, { type QuizData } from "@/components/actions/generateQuiz";
import {
    getDailyLimit,
    incrementDailyLimit,
} from "@/components/actions/quizLimit";

type FormData = {
    difficulty: string;
    language: string;
};

export default function Home() {
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    // const [difficulty, setDifficulty] = useState<string>("easy");
    const [formData, setFormData] = useState<FormData>({
        difficulty: "easy",
        language: "javascript",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const limitData = getDailyLimit();
    const MAX: number = 30;

    useEffect(() => {
        setRemaining(MAX - limitData.count);
    }, [limitData]);

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
            incrementDailyLimit();
            setRemaining(MAX - limitData.count);
            setQuiz(generatedQuiz); // Set the result
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

    // The submit action is now just to "confirm" the selection.
    // You could even remove the form and button if you want the quiz to generate on select change.
    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        generateQuizHandler();
    };

    return (
        <>
            <main className="bg-white rounded-md max-w-6xl mx-auto mt-5 py-4 px-6 shadow-md">
                <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                    <h1 className="text-2xl font-extrabold">
                        Coding Challenge Generator
                    </h1>
                    <div className="bg-slate-100 p-4 rounded-sm">
                        <span className="text-sm text-gray-600">
                            {remaining !== null
                                ? `Challenges remaining today: ${remaining}`
                                : "Challenges remaining today: Loading..."}
                        </span>
                    </div>
                    <label htmlFor="level" className="text-sm font-medium">
                        Select Language:
                    </label>

                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleFormChange} // This change triggers the re-render and the quiz's useEffect
                        id="level"
                        className="bg-slate-100 p-4 pr-10 rounded-sm text-sm cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                        <option value="c">C</option>
                        <option value="c++">C++</option>
                        <option value="ruby">Ruby</option>
                        <option value="go">Go</option>
                        <option value="typescript">TypeScript</option>
                        <option value="swift">Swift</option>
                        <option value="kotlin">Kotlin</option>
                    </select>

                    <label htmlFor="level" className="text-sm font-medium">
                        Select Difficulty:
                    </label>

                    <select
                        value={formData.difficulty}
                        onChange={handleFormChange} // This change triggers the re-render and the quiz's useEffect
                        name="level"
                        id="level"
                        className="bg-slate-100 p-4 pr-10 rounded-sm text-sm cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <button className="w-fit bg-indigo-600 text-white p-2 rounded-md text-sm px-5 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                        {isLoading ? "Generating..." : "Generate Challenge"}
                    </button>
                </form>
                <Quiz
                    quizData={quiz}
                    isLoading={isLoading}
                    error={error}
                    generateNextQuiz={generateQuizHandler}
                />
            </main>
        </>
    );
}
