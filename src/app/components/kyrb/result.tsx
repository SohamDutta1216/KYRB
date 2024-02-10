import React from "react";
import styles from "./kyrb.module.scss";

interface ResultProps {
  messages: { text: string | { text: string }; type: string }[];
}

const Result: React.FC<ResultProps> = ({ messages }) => {
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
          <p>
            {typeof message.text === "object" && message.text !== null
              ? message.text.text
              : message.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Result;
