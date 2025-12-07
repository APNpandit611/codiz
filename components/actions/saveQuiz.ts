"use server";
import { prisma } from "@/lib/prisma";
import { NewQuiz } from "../QuizComponent";
import { currentUser } from "@clerk/nextjs/server";

export async function createUser() {
    const user = await currentUser()
    if (!user) return;
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                id: user?.id,
            },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    id: user.id,
                    email: user?.emailAddresses[0]?.emailAddress ?? "",
                    name: `${user?.firstName ?? ""} ${
                        user?.lastName ?? ""
                    }`.trim(),
                    image: user?.imageUrl,
                },
            });
        }
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

export async function saveQuiz(quizData: NewQuiz) {
    try {
        const existingQuiz = await prisma.quiz.findFirst({
            where: {
                userId: quizData.userId,
                codeSnippet: quizData.codeSnippet,
            },
        });

        if (existingQuiz) {
            return {
                success: false,
                error: false,
                message: "Quiz already exists",
            };
        }

        const data = await prisma.quiz.create({
            data: {
                question: quizData.question,
                codeSnippet: quizData.codeSnippet,
                choices: quizData.choices,
                correctAnswerIndex: quizData.correctAnswerIndex,
                explanation: quizData.explanation,
                language: quizData.language,
                difficulty: quizData.difficulty,
                userId: quizData.userId,
            },
        });
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: false, error: true };
    }
}

// export async function getUserData(userId: string | undefined) {
//     const user = await prisma.user.findUnique({ where: {id: userId}})
//     if (!userId) return null;

//     const now = new Date()
//     const lastReset = new Date(user.lastResetDate)
//     const hoursSinceReset = (now.getTime() - lastReset.getTime()) / 1000 / 3600

//     if (hoursSinceReset >= 24) {
//         await prisma.user.update({
//             where: {id: userId},
//             data: { clickCount: 0, lastResetDate: now}
//         })
//         return { clickCount: 0}
//     }

//     return prisma.user.findUnique({
//         where: {id: userId},
//         select: {
//             clickCount: true,
//             lastResetDate: true
//         }
//     })
// }

export async function deleteQuiz(quizId: number) {
    try {
        const user = await currentUser();
        if (!user) return null;
        await prisma.quiz.delete({
            where: {
                userId: user.id,
                id: quizId,
            },
        });
        return { success: true, error: false };
    } catch (error) {
        console.log(error);
        return { success: true, error: false };
    }
}
