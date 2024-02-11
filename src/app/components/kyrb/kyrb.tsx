"use client";
import React, { useState, useEffect } from "react";
import styles from "./kyrb.module.scss";
import Prompt from "./prompt";
import Result from "./result";
import { GridLoader } from "react-spinners";
const Kyrb = () => {
  const [messages, setMessages] = useState<{ text: string; type: string }[]>(
    []
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added state to track loading status
  const [isZipLoading, setIsZipLoading] = useState(false); // Added state to track loading status
  const [zipResults, setZipResults] = useState(""); // State to store zip query results

  const fetchBotResponse = async (userInput: string) => {
    setIsLoading(true); // Set loading to true when fetching response
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
    } finally {
      setIsLoading(false); // Set loading to false after fetching response
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

  const fetchZipResults = async (zipCode: string) => {
    setIsZipLoading(true); // Set loading to true when fetching zip results
    try {
      const response = await fetch("http://localhost:5000/api/query/zip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ zip: zipCode }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      if (!data.success) {
        throw new Error(
          "Failed to get a valid response from the server for zip query"
        );
      }

      // Update the state with the zip query results
      setZipResults(data.answer.text || data.answer);
    } catch (error) {
      console.error("Failed to fetch zip results:", error);
      setError("Failed to fetch zip results");
    } finally {
      setIsZipLoading(false); // Set loading to false after fetching zip results
    }
  };

  const handleZipSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const zipCode = formData.get("zip") as string;
    await fetchZipResults(zipCode);
  };
  const formatMessageText = (text: string) => {
    // Regular expression to match numbered list items
    const numberedListItemRegex = /(\d+\.\s+)/g;
    // Regular expression to match URLs
    const urlRegex = /(\bhttps?:\/\/\S+\b)/g;
    // Replace occurrences with line breaks and add spacing before each numbered item except the first
    let formattedText = text.replace(numberedListItemRegex, (match, offset) =>
      offset > 0 ? `<br/><br/>${match}` : match
    );
    // Replace URLs with anchor tags, color them blue and underline
    formattedText = formattedText.replace(
      urlRegex,
      "<a href='$1' target='_blank' style='color: #9d9dff; text-decoration: underline;'>$1</a>"
    );
    return formattedText;
  }; // Function to format message text
  console.log(zipResults);
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        {isZipLoading ? (
          <div className={styles.loader}>
            <GridLoader color="#ffff" />
          </div>
        ) : (
          <div className={styles.descriptionContainer}>
            <h3>Enter your zip code to find resources near you</h3>
            <div className={styles.zipContainer}>
              <form onSubmit={handleZipSubmit}>
                <input name="zip" type="text" placeholder="Zip" required />
                <button type="submit">{">"}</button>
              </form>
            </div>
          </div>
        )}
        {zipResults && (
          <div className={styles.zipResults}>
            {" "}
            <p
              dangerouslySetInnerHTML={{
                __html: formatMessageText(zipResults),
              }}
            />
          </div>
        )}
      </div>
      <div className={styles.kyrbContainer}>
        <div className={styles.kyrbChat}>
          <Result messages={messages} isLoading={isLoading} />
          <Prompt handleSubmit={handleSubmit} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Kyrb;
