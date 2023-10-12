"use client";
import react, { createContext, useState } from "react";
import Welcome from "@/component/welcome";
import Logo from "../component/logo";
import styles from "./page.module.css";
import "../../public/locales/index";
import CardList from "../component/card-list";
export default function Home() {
  const [startCard, setStartCard] = useState(false);
  return (
    <main className={styles.main}>
      <Logo />
      <Welcome containerComplete={() => setStartCard(true)} />
      {startCard && <CardList />}
    </main>
  );
}
