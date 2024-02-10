"use client";
import React, { useState, useEffect } from "react";
import styles from "./kyrb.module.scss";
import Prompt from "./prompt";
import Result from "./result";

const Kyrb = () => {
  const [messages, setMessages] = useState([
    { text: "Hi, I'm KYRB. How can I assist you?", type: "bot" },
  ]);
  const [error, setError] = useState("");

  const fetchBotResponse = async (userInput: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userInput }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Directly await the JSON response
      console.log(data);
      if (!data.success) {
        throw new Error("Failed to get a valid response from the server");
      }

      // Update the state with the bot response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: data.answer.text || data.answer,
          type: "bot",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch bot response:", error);
      setError("Failed to fetch response");
      return "Sorry, I couldn't fetch a response. Please try again later.";
    }
  };

  const handleSubmit = async (userInput: string) => {
    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, type: "user" },
    ]);

    await fetchBotResponse(userInput);
  };
  console.log(messages);
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h3>
          Hi my name is KYRB - short for Know Your Rights Bot, I am an AI tool
          built to help you navigate tenant and housing issues in NYC
        </h3>
        <p>
          New Yorkers are facing a housing crisis. Finding out what rights you
          have as a tenant can help you stay protected but can be an
          overwhelming task. That is why I exist; To help bring all the
          information you need to your fingertips !
        </p>
      </div>
      <div className={styles.kyrbContainer}>
        <div className={styles.kyrbChat}>
          <Result messages={messages} />
          <Prompt handleSubmit={handleSubmit} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Kyrb;
