// "use client";

// import { useState } from "react";
// import type { QuizDatas } from "./actions/genQuiz";
// import genQuiz from "./actions/genQuiz";

// const Quizz = ({
//     quizDatas,
//     isLoading,
//     error,
// }: {
//     quizDatas: QuizDatas | null;
//     isLoading: boolean;
//     error: string | null;
// }) => {
//     const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<
//         number | null
//     >(null);
//     const [showResult, setShowResult] = useState(false);
//     const handleSelection = (index: number) => {
//         if (showResult) return;
//         setSelectedChoiceIndex(index);
//     };

//     const handleSubmitAnswer = () => {
//         if (selectedChoiceIndex !== null) {
//             setShowResult(true);
//         }
//     };

//     const handleTryAgain = () => {
//         setSelectedChoiceIndex(null);
//         setShowResult(false);
//     };
//     if (isLoading) {
//         return (
//             <div className="text-center text-slate-500 mt-8 flex items-center justify-center gap-1">
//                 {" "}
//                 Generating your challenge...
//             </div>
//         );
//     }
//     if (error) {
//         return (
//             <p className="text-center text-red-500 bg-red-100 p-3 rounded mt-8">
//                 {error}
//             </p>
//         );
//     }

//     if (!quizDatas) {
//         return null;
//     }

//     const isCorrect = selectedChoiceIndex === quizDatas.correct_answer_index;

//     return (
//         <section>
//             <div className="space-y-4">
//                 <div>
//                     <h3 className="text-xl font-bold mb-2">Question:</h3>
//                     <p className="text-slate-700 bg-white p-3 rounded border">
//                         {quizDatas.question}
//                     </p>
//                     <pre className="mt-2 bg-slate-900 text-slate-300 p-4 rounded-md overflow-x-auto text-sm">
//                         {quizDatas.code_snippet}
//                     </pre>
//                 </div>
//                 <div>
//                     <h3 className="font-semibold text-lg">Choices:</h3>
//                     <ul className="space-y-2 mt-2">
//                         {quizDatas.choices.map((choice, index) => {
//                             let buttonClasses =
//                                 "w-full text-left flex items-start space-x-2 p-3 rounded border-2 transition-all ";

//                             if (showResult) {
//                                 // after submission
//                                 if (
//                                     index === selectedChoiceIndex &&
//                                     isCorrect
//                                 ) {
//                                     buttonClasses +=
//                                         "border-green-500 bg-green-100";
//                                 } else if (
//                                     index === selectedChoiceIndex &&
//                                     !isCorrect
//                                 ) {
//                                     buttonClasses +=
//                                         "border-red-500 bg-red-100";
//                                 } else {
//                                     buttonClasses +=
//                                         "border-slate-500 bg-white";
//                                 }
//                             } else {
//                                 // before submission
//                                 if (index === selectedChoiceIndex) {
//                                     buttonClasses +=
//                                         "border-indigo-500 bg-indigo-100";
//                                 } else {
//                                     buttonClasses +=
//                                         "border-slate-200 bg-white hover:border-slate-300";
//                                 }
//                             }

//                             return (
//                                 <li key={index}>
//                                     <button
//                                         onClick={() => handleSelection(index)}
//                                         className={buttonClasses}
//                                         disabled={showResult}
//                                     >
//                                         <span className="font-bold text-indigo-600 mt-0.5">
//                                             {index + 1}.
//                                         </span>
//                                         <span>{choice}</span>
//                                     </button>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>

//                 <div>
//                     {!showResult ? (
//                         <button
//                             onClick={handleSubmitAnswer}
//                             disabled={selectedChoiceIndex === null}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
//                         >
//                             Submit Answer
//                         </button>
//                     ) : (
//                         <button
//                             onClick={handleTryAgain}
//                             className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
//                         >
//                             Try Again
//                         </button>
//                     )}
//                 </div>

//                 {showResult && (
//                     <details className="bg-white p-3 rounded border mt-4">
//                         <summary className="font-semibold cursor-pointer">
//                             {isCorrect ? "✅ Correct! " : "❌ Incorrect. "} See
//                             Explanation
//                         </summary>
//                         <div className="mt-2 text-slate-700">
//                             <p className="font-medium">
//                                 The correct answer was{" "}
//                                 <strong>
//                                     Choice {quizDatas.correct_answer_index + 1}
//                                 </strong>
//                                 .
//                             </p>
//                             <p>{quizDatas.explanation}</p>
//                         </div>
//                     </details>
//                 )}
//             </div>
//         </section>
//     );
// };







// "use client";
// import React, { useEffect, useState } from "react";
// import generateQuiz, { type QuizData } from "@/components/actions/generateQuiz";
// import {
//     getDailyLimit,
//     incrementDailyLimit,
// } from "@/components/actions/quizLimit";
// import { User } from "../generated/prisma/client";
// import { useUser } from "@clerk/nextjs";
// import QuizComponent from "@/components/Quiz";
// import { createUser } from "@/components/actions/saveQuiz";

// type FormData = {
//     difficulty: string;
//     language: string;
// };

// export default function Home() {
//     const { user } = useUser();
//     const [quiz, setQuiz] = useState<QuizData | null>(null);
//     // const [difficulty, setDifficulty] = useState<string>("easy");
//     const [formData, setFormData] = useState<FormData>({
//         difficulty: "easy",
//         language: "javascript",
//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [remaining, setRemaining] = useState<number | null>(null);
//     const limitData = getDailyLimit();
//     const MAX: number = 30;

//     useEffect(() => {
//         setRemaining(MAX - limitData.count);
//     }, [limitData]);

//     useEffect(() => {
//         const userCreate = async () => {
//             await createUser();
//         };
//         userCreate();
//     }, []);

//     const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const generateQuizHandler = async () => {
//         if (limitData.count >= MAX) {
//             setError("You reached today's limit.");
//             return;
//         }

//         setIsLoading(true);
//         setError(null);
//         try {
//             const generatedQuiz = await generateQuiz(
//                 formData.difficulty,
//                 formData.language
//             );
//             incrementDailyLimit();
//             setRemaining(MAX - limitData.count);
//             setQuiz(generatedQuiz); // Set the result
//         } catch (err) {
//             console.log(err);
//             setError(
//                 err instanceof Error
//                     ? err.message
//                     : "An unknown error occurred."
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // The submit action is now just to "confirm" the selection.
//     // You could even remove the form and button if you want the quiz to generate on select change.
//     const handleGenerate = async (e: React.FormEvent) => {
//         e.preventDefault();
//         generateQuizHandler();
//     };

//     return (
//         <>
//             <main className="bg-white rounded-md max-w-6xl mx-auto mt-5 py-4 px-6 shadow-md">
//                 <form onSubmit={handleGenerate} className="flex flex-col gap-4">
//                     <h1 className="text-2xl font-extrabold">
//                         Coding Challenge Generator
//                     </h1>
//                     <div className="bg-slate-100 p-4 rounded-sm">
//                         <span className="text-sm text-gray-600">
//                             {remaining !== null
//                                 ? `Challenges remaining today: ${remaining}`
//                                 : "Challenges remaining today: Loading..."}
//                         </span>
//                     </div>
//                     <label htmlFor="language" className="text-sm font-medium">
//                         Select Language:
//                     </label>

//                     <select
//                         name="language"
//                         value={formData.language}
//                         onChange={handleFormChange} // This change triggers the re-render and the quiz's useEffect
//                         id="level"
//                         className="bg-slate-100 p-4 pr-10 rounded-sm text-sm cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     >
//                         <option value="python">Python</option>
//                         <option value="java">Java</option>
//                         <option value="javascript">JavaScript</option>
//                         <option value="c">C</option>
//                         <option value="c++">C++</option>
//                         <option value="ruby">Ruby</option>
//                         <option value="go">Go</option>
//                         <option value="typescript">TypeScript</option>
//                         <option value="swift">Swift</option>
//                         <option value="kotlin">Kotlin</option>
//                     </select>

//                     <label htmlFor="level" className="text-sm font-medium">
//                         Select Difficulty:
//                     </label>

//                     <select
//                         value={formData.difficulty}
//                         onChange={handleFormChange} // This change triggers the re-render and the quiz's useEffect
//                         name="difficulty"
//                         id="level"
//                         className="bg-slate-100 p-4 pr-10 rounded-sm text-sm cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     >
//                         <option value="easy">Easy</option>
//                         <option value="medium">Medium</option>
//                         <option value="hard">Hard</option>
//                     </select>

//                     <button className="w-fit bg-indigo-600 text-white p-2 rounded-md text-sm px-5 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
//                         {isLoading ? "Generating..." : "Generate Challenge"}
//                     </button>
//                 </form>
//                 <QuizComponent
//                     quizData={quiz}
//                     isLoading={isLoading}
//                     error={error}
//                     generateNextQuiz={generateQuizHandler}
//                     difficulty={formData.difficulty}
//                     language={formData.language}
//                     userId={user?.id}
//                 />
//             </main>
//         </>
//     );
// }








// <section className="mt-8 p-6 border rounded-lg shadow-md bg-slate-50">
        //     <div className="space-y-4">
        //         <div>
        //             <h3 className="text-xl font-bold mb-2">Question:</h3>
        //             <p className="text-slate-700 bg-white p-3 rounded border">
        //                 {quizData.question}
        //             </p>
        //             <pre className="mt-2 bg-slate-900 text-slate-300 p-4 rounded-md overflow-x-auto text-sm">
        //                 {quizData.code_snippet}
        //             </pre>
        //         </div>

        //         <div>
        //             <h3 className="font-semibold text-lg">Choices:</h3>
        //             <ul className="space-y-2 mt-2">
        //                 {quizData.choices.map((choice, index) => {
        //                     // Dynamic styling based on selection and result
        //                     let buttonClasses =
        //                         "w-full text-left flex items-start space-x-2 p-3 rounded border-2 transition-all ";

        //                     if (showResult) {
        //                         // After submission, show green for correct, red for incorrect
        //                         if (
        //                             index === selectedChoiceIndex &&
        //                             isCorrect
        //                         ) {
        //                             buttonClasses +=
        //                                 "border-green-500 bg-green-100";
        //                         } else if (
        //                             index === selectedChoiceIndex &&
        //                             !isCorrect
        //                         ) {
        //                             buttonClasses +=
        //                                 "border-red-500 bg-red-100";
        //                         } else {
        //                             buttonClasses +=
        //                                 "border-slate-200 bg-white";
        //                         }
        //                     } else {
        //                         // Before submission, highlight the selected one
        //                         if (index === selectedChoiceIndex) {
        //                             buttonClasses +=
        //                                 "border-indigo-500 bg-indigo-100";
        //                         } else {
        //                             buttonClasses +=
        //                                 "border-slate-200 bg-white hover:border-slate-300";
        //                         }
        //                     }

        //                     return (
        //                         <li key={index}>
        //                             <button
        //                                 onClick={() =>
        //                                     handleSelectChoice(index)
        //                                 } // Call the handler when clicked
        //                                 disabled={showResult} // Disable buttons after submission
        //                                 className={buttonClasses}
        //                             >
        //                                 <span className="font-bold text-indigo-600 mt-0.5">
        //                                     {index + 1}.
        //                                 </span>
        //                                 <span>{choice}</span>
        //                                 {/* Show an icon if this is the correct answer after submission */}
        //                                 {/* {showResult && index === quizData.correct_answer_index && (
        //               <span className="ml-auto text-green-600 font-bold">✓</span>
        //             )} */}
        //                             </button>
        //                         </li>
        //                     );
        //                 })}
        //             </ul>
        //         </div>

        //         {/* Action Buttons */}
        //         <div className="mt-4 flex gap-x-4">
        //             {!showResult ? (
        //                 <button
        //                     onClick={handleSubmitAnswer}
        //                     disabled={selectedChoiceIndex === null}
        //                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        //                 >
        //                     Submit Answer
        //                 </button>
        //             ) : (
        //                 <>
        //                     {isCorrect ? (
        //                         <div className="w-full flex flex-row items-center justify-between gap-4">
        //                             <button
        //                                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        //                                 onClick={generateNextQuiz}
        //                             >
        //                                 Generate Next
        //                             </button>

        //                             <button
        //                                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        //                                 onClick={handleQuizSave}
        //                             >
        //                                 {saving
        //                                     ? "Saving Quiz..."
        //                                     : "Save Quiz"}
        //                             </button>
        //                         </div>
        //                     ) : (
        //                         <button
        //                             className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
        //                             onClick={handleTryAgain}
        //                         >
        //                             Try Again
        //                         </button>
        //                     )}
        //                 </>
        //             )}
        //         </div>

        //         {/* Explanation - only show after submission */}
        //         {showResult && (
        //             <details className="bg-white p-3 rounded border mt-4">
        //                 <summary className="font-semibold cursor-pointer">
        //                     {isCorrect ? "✅ Correct! " : "❌ Incorrect. "} See
        //                     Explanation
        //                 </summary>
        //                 <div className="mt-2 text-slate-700">
        //                     <p className="font-medium">
        //                         The correct answer was{" "}
        //                         <strong>
        //                             Choice {quizData.correct_answer_index + 1}
        //                         </strong>
        //                         .
        //                     </p>
        //                     <p>{quizData.explanation}</p>
        //                 </div>
        //             </details>
        //         )}
        //     </div>
        // </section>
