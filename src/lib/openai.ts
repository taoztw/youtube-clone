import { AzureOpenAI } from "openai";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const deployment = "gpt-4o";
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = "2024-04-01-preview";
const options = { endpoint, apiKey, deployment, apiVersion };

export const openaiClient = new AzureOpenAI(options);

// console.log("OpenAI client created");
// const response = await openaiClient.chat.completions.create({
//   messages: [
//     { role: "system", content: "You are a helpful assistant." },
//     { role: "user", content: "hello" },
//   ],
//   max_tokens: 4096,
//   temperature: 0,
//   top_p: 1,
//   model: modelName,
// });

// console.log(response.choices[0].message.content);
