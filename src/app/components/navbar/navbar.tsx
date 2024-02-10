import React from "react";
import styles from "./navbar.module.scss";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.navLeft}>
        <p className={styles.logo}>KYRB</p>
      </div>
      <div className={styles.navRight}></div>
    </div>
  );
};

export default Navbar;
