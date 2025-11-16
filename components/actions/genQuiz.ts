// "use server"

// import OpenAI from "openai";

// const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     // apiKey: process.env.NEXT_OPENAI_API_KEY,
//     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//     dangerouslyAllowBrowser: true,
// })

// export type QuizDatas = {
//     question: string;
//     code_snippet: string;
//     choices: string[];
//     correct_answer_index: number;
//     explanation: string;
// }

// const genQuiz = async (difficulty: string):Promise<QuizDatas> => {
//     const prompt = `here is the promt ${difficulty}`
//     try {
        
//         const completion = await openai.chat.completions.create({
//             model: "nvidia/nemotron-nano-12b-v2-vl:free",
//             messages: [{ role: "user", content: prompt }],
//         })

//         const content = completion.choices[0].message?.content;
//         if (!content) throw new Error("AI returned no content.");

//         const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
//         const jsonString = jsonMatch ? jsonMatch[1] : content;

//         const quizData = JSON.parse(jsonString) as QuizDatas
//     } catch (error) {
//         console.log(error)
//         throw new Error("failed to generate challenge.");
//     }
// }

// export default genQuiz