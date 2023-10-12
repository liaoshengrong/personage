import React from "react";
import CardItem from "./card-item";
import styles from "./index.module.scss";
const CardList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerItem}>
        <CardItem />
        <CardItem />
      </div>
      <div className={styles.containerItem}>
        <CardItem />
        <CardItem />
      </div>
    </div>
  );
};

export default CardList;
