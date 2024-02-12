import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { SerpAPI } from "langchain/tools";
import express from "express";
import cors from "cors";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import dotenv from "dotenv";
dotenv.config(); // Removed the hardcoded path to ensure it works in different environments

////////////////////////////////////////////////////////
// Step 1: Define the base template for the scrape
const template =
  "You are an assistant helping New York City tenants know about their rights. Please answer this user's question - {question}. if you state a source or website, please provide the url at the end of the response";

const zipTemplate =
  "Please list housing and tenant rights non-profits along with any their url's and or phone numbers closest to this zip code {zip}";
// Step 2: Create a prompt template with the defined template and input variables
const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["question"],
});
const zipPrompt = new PromptTemplate({
  template: zipTemplate, // Corrected to use the zipTemplate for zip queries
  inputVariables: ["zip"],
});
// Step 3: Initialize the model with specific parameters
const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.4 });

// Step 4: Create a chain combining the prompt and the model
const chain = new LLMChain({ prompt: prompt, llm: model });
const zipChain = new LLMChain({ prompt: zipPrompt, llm: model });
// Step 5: Define external tools to be used, in this case, SerpAPI for search results
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "New York, United States",
    hl: "en",
    gl: "us",
  }),
];

// Step 6: Initialize the Express app and define the port
const app = express();
const port = process.env.PORT || 5000; // Use the PORT environment variable if available, otherwise default to 5000

// Step 7: Use middleware for JSON parsing and enabling CORS
app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://kyrb-chat.vercel.app",
      "http://localhost:3000",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Step 8: Define the POST endpoint to handle user questions
app.post("/api/query", async (req, res) => {
  const { question } = req.body;
  try {
    const responseChain = await chain.call({ question });
    console.log(responseChain); // Log the response for debugging
    res.json({ success: true, answer: responseChain });
  } catch (error) {
    console.error("Error processing the query:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process the query" });
  }
});

// Corrected the endpoint to match the client-side fetch request
app.post("/api/query/zip", async (req, res) => {
  const { zip } = req.body; // Retrieve the zip code from the request body
  try {
    const responseChain = await zipChain.call({ zip }); // Call the zipChain with the provided zip code
    console.log(responseChain); // Log the response for debugging
    res.json({ success: true, answer: responseChain });
  } catch (error) {
    console.error("Error processing the zip query:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process the zip query" });
  }
});

// Step 12: Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
