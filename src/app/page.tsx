"use client";
import react, { createContext, useEffect, useState } from "react";
import Welcome from "@/component/welcome";
import Logo from "../component/logo";
// import styles from "./page.module.css";
import styles from "./page.module.scss";
import "../../public/locales/index";
import CardList from "../component/card-list";
import { loadItem, saveItem } from "../utils/storage";
export default function Home() {
  const isFirstComeIn = loadItem("isFirstComeIn");
  const [startCard, setStartCard] = useState(false);

  console.log(isFirstComeIn, "isFirstComeIn");

  const containerComplete = () => {
    setStartCard(true);
  };

  useEffect(() => {
    if (!isFirstComeIn) {
      setStartCard(true);
    }
    // const handleLoad = () => {
    //   false && saveItem("isFirstComeIn", true);
    // };
  }, []);

  return (
    <main className={styles.main}>
      <Logo />
      <Welcome
        isNeedAnimated={isFirstComeIn}
        containerComplete={containerComplete}
      />
      {startCard && <CardList isNeedAnimated={isFirstComeIn} />}
    </main>
  );
}
