"use client";
import React, { useState } from "react";
import styles from "./navbar.module.scss";

const Navbar = () => {
  const [language, setLanguage] = useState("en");

  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language: selectedLanguage }),
      });
      if (!response.ok) {
        throw new Error("Failed to send language to server");
      }
      console.log("Language set successfully");
    } catch (error) {
      console.error("Error setting language:", error);
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navLeft}>
        <p className={styles.logo}>KYRB</p>
      </div>
      <div className={styles.navRight}>
        <select
          className={styles.languageSelector}
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="zh">中文</option>
          <option value="ru">Русский</option>
          <option value="bn">বাংলা</option>
          <option value="ko">한국어</option>
          <option value="ar">العربية</option>
          <option value="ht">Kreyòl Ayisyen</option>
          <option value="pl">Polski</option>
          <option value="ur">اردو</option>
          <option value="fr">Français</option>
          <option value="it">Italiano</option>
        </select>
      </div>
    </div>
  );
};

export default Navbar;
