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
dotenv.config({ path: "/Users/user/Desktop/code/kyrb/.env" });
// Load the directory from the data folder
// Assuming no specific loaders are needed for this example
// const loader = new DirectoryLoader("/Users/user/Desktop/code/kyrb/data", {
//   ".pdf": (path) => new PDFLoader(path, "/pdf"),
// });
// const docs = await loader.load();
// console.log(docs);

// const splitter = new CharacterTextSplitter({
//   separator: " ",
//   chunkSize: 200,
//   chunkOverlap: 20,
// });

// const splitDocs = await splitter.splitDocuments(docs);

// // console.log(reducedDocs[4]);
// let summaries = [];
// const summarizeModel = new OpenAI({ temperature: 0 });
// const summarizeAllChain = loadSummarizationChain(model, {
//   type: "map_reduce",
// });

// // raw documents
// const summarizeRes = await summarizeAllChain.call({
//   input_documents: docs,
// });
// summaries.push({ summary: summarizeRes.text });

// /** Summarize each candidate */
// for (let doc of docs) {
//   const summarizeOneChain = loadSummarizationChain(summarizeModel, {
//     type: "map_reduce",
//   });
//   const summarizeOneRes = await summarizeOneChain.call({
//     input_documents: [doc],
//   });

//   console.log({ summarizeOneRes });
//   summaries.push({ summary: summarizeOneRes.text });
// }

// /** Upload the reducedDocs */
// const client = new PineconeClient();
// await client.init({
//   apiKey: process.env.PINECONE_API_KEY,
//   environment: process.env.PINECONE_ENVIRONMENT,
// });

// const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

// await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
//   pineconeIndex,
// });

// console.log("Uploaded to Pinecone");

// console.log({ summaries });
////////////////////////////////////////////////////////
// Step 1: Define the base template for the scrape
const template =
  "You are an assistant helping New York City tenants know about their rights. Please answer this user's question - {question}. if you state a source or website, please provide the url at the end of the response";

// Step 2: Create a prompt template with the defined template and input variables
const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["question"],
});

// Step 3: Initialize the model with specific parameters
const model = new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0.4 });

// Step 4: Create a chain combining the prompt and the model
const chain = new LLMChain({ prompt: prompt, llm: model });

// Step 5: Define external tools to be used, in this case, SerpAPI for search results
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Brooklyn, New York, United States",
    hl: "en",
    gl: "us",
  }),
];

// Step 6: Initialize the Express app and define the port
const app = express();
const port = 5000;

// Step 7: Use middleware for JSON parsing and enabling CORS
app.use(express.json());
app.use(cors());

// Step 8: Define the POST endpoint to handle user queries
app.post("/api/query", async (req, res) => {
  const { question } = req.body;
  try {
    // Step 9: Call the chain with the user's question and await the response
    const responseChain = await chain.call({ question });
    console.log(responseChain); // Log the response for debugging
    // Step 10: Send the response back to the client
    res.json({ success: true, answer: responseChain });
  } catch (error) {
    // Step 11: Handle any errors during the process
    console.error("Error processing the query:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process the query" });
  }
});

// Step 12: Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
