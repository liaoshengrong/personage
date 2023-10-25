"use client";
import react, { createContext, useEffect, useMemo, useState } from "react";
import Welcome from "@/component/welcome";
import Logo from "../component/logo";
// import styles from "./page.module.css";
import styles from "./page.module.scss";
import "../../public/locales/index";
import CardList from "../component/card-list";
import { loadItem, saveItem } from "../utils/storage";
import { getGirlImageList } from "@/server";
import { preloadMount } from "@/utils/function";
import { apiRequest } from "@/server/fetch";
import { ImageListProp } from "@/server/type";

export default function Home() {
  const [startCard, setStartCard] = useState(false);
  const [isFirstComeIn, setIsFirstComeIn] = useState(false);

  const { data, isLoading } = apiRequest<ImageListProp>("/list", "GET", {
    page: 1,
  });

  const datalist = useMemo(() => data?.list, [data]);
  console.log(data, isLoading, "data");

  const containerComplete = () => {
    setStartCard(true);
  };

  const preloadList = (datalist: ImageListProp["list"]) => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => preloadMount(datalist));
    } else {
      setTimeout(() => preloadMount(datalist), 0);
    }
  };

  useEffect(() => {
    // 做预挂载
    if (datalist) {
      preloadList(datalist);
    }
  }, [datalist]);

  useEffect(() => {
    if (!isFirstComeIn) {
      setStartCard(true);
    }
    if (typeof window !== undefined) {
      const isFirstComeIns = loadItem("isFirst");
      console.log(isFirstComeIns, "isFirstComeIns");
    }
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
