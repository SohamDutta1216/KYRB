import React from "react";
import styles from "./kyrb.module.scss";
import { BeatLoader } from "react-spinners";
interface ResultProps {
  messages: { text: string | { text: string }; type: string }[];
  isLoading: boolean;
}

const Result: React.FC<ResultProps> = ({ messages, isLoading }) => {
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

  if (!isLoading && messages.length < 1) {
    return (
      <div className={styles.resultContainerStart}>
        <h1>What can I help you with today?</h1>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className={styles.resultContainer}>
        <p>KYRB:</p>

        <BeatLoader color="#ffff" />
      </div>
    );
  }

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
