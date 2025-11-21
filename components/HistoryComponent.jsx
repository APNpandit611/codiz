import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import {
    CalendarIcon,
    CheckCircle2,
    Code2,
    LightbulbIcon,
    TrendingUp,
} from "lucide-react";

const HistoryComponent = async () => {
    const quizByUser = await prisma.quiz.findMany({
        where: { userId: (await currentUser())?.id },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-4">
            <div className="rounded-md max-w-6xl mx-auto py-4 mb-2 px-6 shadow-md min-h-screen">
                {quizByUser.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No quiz history found.
                    </p>
                ) : (
                    quizByUser.map((item) => (
                        <section key={item.id}>
                            <Accordion
                                type="single"
                                collapsible
                                className="mb-6 group overflow-hidden shadow-lg rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl"
                            >
                                <AccordionItem
                                    value={`${item.id}`}
                                    className="border-0 bg-white"
                                >
                                    <AccordionTrigger className="hover:no-underline py-6 px-4 bg-gradient-to-r from-white via-gray-50/50 to-white transition-all duration-300 relative border-b border-gray-100 group/trigger">
                                        <div className="flex items-start justify-between w-full gap-4">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="flex-1 text-left px-4">
                                                    <h3 className="font-bold text-gray-900 text-md leading-relaxed mb-3">
                                                        {item.question}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="pt-0 px-6 pb-6 bg-gradient-to-b from-white to-gray-50/30">
                                        <div className="space-y-6 mt-4">
                                            {/* Code Snippet */}
                                            {item.codeSnippet && (
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
                                                                    {item.language.toLowerCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <pre className="p-5 text-slate-200 text-sm overflow-x-auto font-mono leading-relaxed">
                                                            <code>
                                                                {
                                                                    item.codeSnippet
                                                                }
                                                            </code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Choices */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                                                    <h3 className="font-bold text-gray-800 text-base">
                                                        Answer Options
                                                    </h3>
                                                </div>
                                                {item.choices.map(
                                                    (choice, index) => {
                                                        const isCorrect =
                                                            index ===
                                                            item.correctAnswerIndex;
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`group relative overflow-hidden rounded-xl transition-all duration-300  ${
                                                                    isCorrect
                                                                        ? "border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg"
                                                                        : "border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                                                                }`}
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                                <div className="flex items-start gap-4 p-4 relative z-10">
                                                                    <div
                                                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                                                            isCorrect
                                                                                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md"
                                                                                : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-blue-100 group-hover:to-blue-200 group-hover:text-blue-700"
                                                                        }`}
                                                                    >
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                                index
                                                                        )}
                                                                    </div>
                                                                    <p
                                                                        className={`flex-1 mt-1.5 text-base leading-relaxed ${
                                                                            isCorrect
                                                                                ? "text-gray-800 font-medium"
                                                                                : "text-gray-700"
                                                                        }`}
                                                                    >
                                                                        {choice}
                                                                    </p>
                                                                    {isCorrect && (
                                                                        <div className="flex-shrink-0 p-1.5 rounded-full bg-green-500 text-white shadow-md">
                                                                            <CheckCircle2 className="w-5 h-5" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            {/* Explanation */}
                                            {item.explanation && (
                                                <div className="relative group">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                                                    <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/60 rounded-xl p-5">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md">
                                                                <LightbulbIcon className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                                                    Explanation
                                                                    <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                                                                </h4>
                                                                <p className="text-gray-700 leading-relaxed">
                                                                    {
                                                                        item.explanation
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="flex items-center justify-between pt-5 border-t border-gray-200">
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        <span className="font-medium">
                                                            {new Date(
                                                                item.createdAt
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        {item.difficulty}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200/50">
                                                        <Code2 className="w-3.5 h-3.5" />
                                                        {item.language}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </section>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryComponent;
