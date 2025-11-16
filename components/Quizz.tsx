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
