import React from "react";
import styles from "./kyrb.module.scss";

interface ResultProps {
  messages: { text: string | { text: string }; type: string }[];
}

const Result: React.FC<ResultProps> = ({ messages }) => {
  // Function to format message text
  const formatMessageText = (text: string) => {
    // Regular expression to match numbered list items
    const numberedListItemRegex = /(\d+\.\s+)/g;
    // Replace occurrences with line breaks before each numbered item except the first
    return text.replace(numberedListItemRegex, (match, offset) =>
      offset > 0 ? `<br/>${match}` : match
    );
  };

  return (
    <div className={styles.resultContainer}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={
            message.type === "bot" ? styles.botMessage : styles.userMessage
          }
        >
          {message.type === "bot" ? <p>KYRB:</p> : <p>You:</p>}
          <p
            dangerouslySetInnerHTML={{
              __html:
                typeof message.text === "object" && message.text !== null
                  ? formatMessageText(message.text.text)
                  : formatMessageText(message.text),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Result;
