"use server";
import {prisma} from "@/lib/prisma";
import { NewQuiz } from "../QuizComponent";
import { currentUser } from "@clerk/nextjs/server";


export async function createUser() {
    try {
        const user = await currentUser();
        if (!user) return null;

        const existingUser = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.emailAddresses[0].emailAddress,
                    name: `${user.firstName ?? ""} ${
                        user.lastName ?? ""
                    }`.trim(),
                    image: user.imageUrl,
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
