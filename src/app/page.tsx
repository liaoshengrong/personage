"use client";
import react, { createContext, useEffect, useState } from "react";
import Welcome from "@/component/welcome";
import Logo from "../component/logo";
// import styles from "./page.module.css";
import styles from "./page.module.scss";
import "../../public/locales/index";
import CardList from "../component/card-list";
import { loadItem, saveItem } from "../utils/storage";
import { getGirlImageList } from "@/server";
import { preload } from "@/utils/function";
export default function Home() {
  const [startCard, setStartCard] = useState(false);
  const [isFirstComeIn, setIsFirstComeIn] = useState(false);

  const containerComplete = () => {
    setStartCard(true);
  };

  const preloadList = (page) => {
    getGirlImageList({ page }).then((res) => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => preload(res));
      } else {
        setTimeout(() => preload(res), 0);
      }
    });
  };
  useEffect(() => {
    if (!isFirstComeIn) {
      setStartCard(true);
    }
    preloadList(1);
    preloadList(2);
  }, [isFirstComeIn]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Logo />
        <Welcome
          isNeedAnimated={isFirstComeIn}
          containerComplete={containerComplete}
        />
        {startCard && <CardList isNeedAnimated={isFirstComeIn} />}
      </div>
    </main>
  );
}
