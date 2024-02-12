"use client";
import React, { useState } from "react";
import styles from "./navbar.module.scss";

const Navbar = () => {
  const [language, setLanguage] = useState("en");

  return (
    <div className={styles.navbar}>
      <div className={styles.navLeft}>
        <p className={styles.logo}>KYRB</p>
      </div>
    </div>
  );
};

export default Navbar;
