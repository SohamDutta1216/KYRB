import styles from "./page.module.scss";
import Navbar from "./components/navbar/navbar";
import Kyrb from "./components/kyrb/kyrb";
export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Kyrb />
    </main>
  );
}
