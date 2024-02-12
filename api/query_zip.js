// /api/query_zip.js
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  const zipTemplate =
    "Please list housing and tenant rights non-profits along with any their url's and or phone numbers closest to this zip code {zip}";

  const zipPrompt = new PromptTemplate({
    template: zipTemplate,
    inputVariables: ["zip"],
  });

  const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.4 });
  const zipChain = new LLMChain({ prompt: zipPrompt, llm: model });
  if (req.method === "POST") {
    const { zip } = req.body;
    try {
      const responseChain = await zipChain.call({ zip });
      console.log(responseChain);
      res.json({ success: true, answer: responseChain });
    } catch (error) {
      console.error("Error processing the zip query:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to process the zip query" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
