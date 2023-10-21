import { getImageList, testApi } from "@/server";
import React from "react";
import list from "@/../data.json";
import Item from "./item";
import styles from "./page.module.scss";
async function IsrList() {
  // const data = await getImageList();
  // const list = data.images;
  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {list.map((item) => {
          return <Item key={item.image_id} data={item} />;
        })}
      </div>
    </div>
  );
}

export default IsrList;
