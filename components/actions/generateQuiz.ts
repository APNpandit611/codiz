"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    // apiKey: process.env.NEXT_OPENAI_API_KEY,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export type QuizData = {
    question: string;
    code_snippet: string;
    choices: string[];
    correct_answer_index: number;
    explanation: string;
};

const generateQuiz = async (difficulty: string): Promise<QuizData> => {
    const prompt = `
Generate a multiple-choice JavaScript coding challenge. 
Respond with a **single valid JSON object only**. 
No markdown fences, no extra text, no comments, no trailing commas. 
All strings must be valid JSON strings (escape quotes and newlines). 
The JS code snippet must be escaped correctly.

Required JSON structure:
{
  "question": "string",
  "code_snippet": "string",
  "choices": ["string","string","string","string"],
  "correct_answer_index": 0,
  "explanation": "string"
}

Rules:
- Topic: common algorithm, data structure, or practical coding problem.
- Difficulty: "${difficulty}" (easy = basic logic; medium = algorithms; hard = advanced structures/performance).
- Choices must be plausible.
- Explanation must justify the correct answer and contrast the wrong ones.
- Must be unique and non-repetitive.
- Validate your JSON before outputting.

Return ONLY the final JSON object.
`;

    try {
        const completion = await openai.chat.completions.create({
            // model: "nvidia/nemotron-nano-12b-v2-vl:free",
            model: "kwaipilot/kat-coder-pro:free",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const content = completion.choices[0].message?.content;
        if (!content) throw new Error("AI returned no content.");

        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;

        // const trimmedJson = jsonString.trim();

        // Parsing the generated data and return the object
        const quizData = JSON.parse(jsonString) as QuizData;
        return quizData;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to generate challenge. Please try again.");
    }
};

export default generateQuiz;
