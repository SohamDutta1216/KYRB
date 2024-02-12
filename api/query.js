// /api/query.js
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import dotenv from "dotenv";
dotenv.config();

const template =
  "You are an assistant helping New York City tenants know about their rights. Please answer this user's question - {question}. if you state a source or website, please provide the url at the end of the response";

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["question"],
});

const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.4 });
const chain = new LLMChain({ prompt: prompt, llm: model });

export default async (req, res) => {
  if (req.method === "POST") {
    const { question } = req.body;
    try {
      const responseChain = await chain.call({ question });
      console.log(responseChain);
      res.json({ success: true, answer: responseChain });
    } catch (error) {
      console.error("Error processing the query:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to process the query" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
