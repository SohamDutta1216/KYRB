// src/app/components/kyrb/prompt.tsx
import React, { useState } from "react";
import styles from "./kyrb.module.scss";

interface PromptProps {
  handleSubmit: (userInput: string) => Promise<void>; // Updated the type to a function that accepts a string and returns a Promise
  error: string;
}

const Prompt: React.FC<PromptProps> = ({ handleSubmit, error }) => {
  const [input, setInput] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== "") {
      // Ensure that the input is not just whitespace
      await handleSubmit(input); // Await the handleSubmit function to ensure it completes before clearing the input
      setInput(""); // Clear input after submission
    }
  };

  return (
    <div className={styles.queryContainer}>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Ask a question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button type="submit">⬆</button>{" "}
      </form>
    </div>
  );
};

export default Prompt;
