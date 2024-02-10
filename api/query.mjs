import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { SerpAPI } from "langchain/tools";
import express from "express";
import cors from "cors";

// Base Scrape Template
const template =
  "You are an assistant helping New York City tenants know about their rights. Please answer this user's question - {question}";

const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["question"],
});

const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.4 });
const chain = new LLMChain({ prompt: prompt, llm: model });

const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Brooklyn, New York, United States",
    hl: "en",
    gl: "us",
  }),
];

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors()); // Enable CORS

app.post("/api/query", async (req, res) => {
  const { question } = req.body;
  try {
    const responseChain = await chain.call({ question });
    console.log(responseChain); // Check the structure of responseChain
    res.json({ success: true, answer: responseChain });
  } catch (error) {
    console.error("Error processing the query:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process the query" });
  }
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
