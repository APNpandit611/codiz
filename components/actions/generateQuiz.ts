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
    const prompt = `You are an expert computer science educator and software engineer. Your task is to generate a high-quality, multiple-choice coding challenge.

The challenge MUST adhere to the following instructions:

1. Topic: The challenge should be a common algorithm, data structure, or a practical programming problem. Avoid overly obscure or niche topics.

2. Difficulty: The challenge's difficulty level is "${difficulty}". Adjust the complexity of the problem, the concepts involved, and the distractors (incorrect answers) accordingly.
- Easy: Focus on basic logic, loops, strings, or simple array manipulation.
- Medium: Involves a common algorithm (e.g., sorting, searching, recursion) or a combination of concepts.
- Hard: Requires a more advanced algorithm, data structure (e.g., graphs, trees, heaps), or has significant edge cases and performance considerations.

3. Output Format: Your entire response must be a single, valid JSON object. Do not include any text before or after the JSON.

4. JSON Structure: The JSON object must have the following keys and structure:
- question: A string containing the coding question prompt for the user.
- code_snippet: A string containing a relevant code stub or starting point in JavaScript. This should be clean and well-formatted.
- choices: An array of 4 strings. Each string is a potential answer. The choices should be plausible but clearly distinguished.
- correct_answer_index: An integer (0, 1, 2, or 3) representing the index of the correct answer in the choices array.
- explanation: A string explaining why the correct answer is correct. It should also briefly explain why the other common incorrect answers are wrong. This explanation should be educational.

Example for "easy" difficulty (do not use this content, only for structure reference):
{
  "question": "Which array method would you use to create a new array with all elements that pass a test implemented by a provided function?",
  "code_snippet": "const numbers = [1, 2, 3, 4, 5];",
  "choices": [
    "numbers.reduce(...)",
    "numbers.filter(...)",
    "numbers.map(...)",
    "numbers.forEach(...)"
  ],
  "correct_answer_index": 1,
  "explanation": "The filter() method creates a new array with all elements that pass the test. map() transforms every element, reduce() condenses the array to a single value, and forEach() executes a function for each element but doesn't return a new array."
}

Now, please generate a new coding challenge based on the instructions above. Make sure to just generate quiz as an output. Without any intro text or similar text. Try to be unique everytime. Do not use similar question or repetetive question`;
    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": prompt,
            },
            {
              "type": "image_url",
              "image_url": {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
              }
            }
          ]
        }
      ],
        });

        const content = completion.choices[0].message?.content;
        if (!content) throw new Error("AI returned no content.");

        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : content;

        const trimmedJson = jsonString.trim();

        // Parsing the generated data and return the object
        const quizData = JSON.parse(trimmedJson) as QuizData;
        return quizData;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to generate challenge. Please try again.");
    }
};

export default generateQuiz;
