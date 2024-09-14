import { OpenAI } from "openai"; // Correct import
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from a .env file if available
dotenv.config();

// Initialize the OpenAI API with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key
});

async function callOpenAI(prompt: string): Promise<string | undefined> {
  try {
    // Call the OpenAI API to get a response
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Use the chat model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000, // You can modify this value based on your requirements
    });

    // Extract the generated text from the response
    const generatedText = response.choices[0]?.message?.content?.trim() || "";
    return generatedText;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return undefined;
  }
}

const writeResponseToFile = (filePath: string, generatedText: string) => {
  try {
    // Ensure the directory exists before writing the file
    const fullFilePath = path.resolve(filePath);
    const dir = path.dirname(fullFilePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save the generated response to a file
    fs.writeFileSync(fullFilePath, generatedText, "utf-8");
    console.log(`Response saved to ${fullFilePath}`);
  } catch (error) {
    console.error("Error saving the response:", error);
  }
};

const callOpenAIAndSaveToFile = async (prompt: string, filePath: string) => {
  let generatedText = await callOpenAI(prompt);
  console.log("1:", generatedText);

  if (!generatedText) {
    // Retry if the first attempt fails
    console.log("1 A");
    generatedText = await callOpenAI(prompt);
  }

  if (!generatedText) {
    console.log("1 C");
    throw new Error("Failed to generate text after 2 tries");
  } else {
    console.log("2");

    // Step 1: Use a regex to extract the code inside the "file" key
    const fileKeyMatch = generatedText.match(/"file":\s*"([^"]*)"/s); // Match the "file" key content
    if (fileKeyMatch && fileKeyMatch[1]) {
      const extractedCode = fileKeyMatch[1]
        .replace(/\\n/g, "\n") // Convert escaped newlines
        .replace(/\\"/g, '"') // Convert escaped double quotes
        .replace(/\\'/g, "'"); // Convert escaped single quotes

      // Step 2: Write the extracted code to a file
      writeResponseToFile(filePath, extractedCode);
      console.log("Text written to file:", filePath);
    } else {
      console.error("Could not extract the 'file' content from the response.");
    }
  }
};

// function removeJsonBlock(input: string): string {
//   const trimmed = input.replace(/^\s*```json\s*([\s\S]*?)\s*```\s*$/, "$1");
//   return trimmed;
// }

// Define a more complex prompt for generating the component
const promptParamList = [
  "You are an assistant that responds with structured JSON format. For the following task, please return the output in a JSON object.",
  "Task: Write a react component that can call the OpenAPI endpoint, and render the following story.  Use tailwindcss.  Make sure to actually call the API. Return only the component code.  If it is a client side component, make sure to start the code with use client.   Use fetch instead of axios.",
  'expected reponse structure: {"file": <jsx>, "explanation" : ["any other text not part of the code here"]}',
];

const prompt = promptParamList.join(" ");
console.log("Generated prompt:", prompt);

const filePath = "./test.tsx"; // Saving to your project SRC

// Call the function and save the result to

callOpenAIAndSaveToFile(prompt, filePath);
