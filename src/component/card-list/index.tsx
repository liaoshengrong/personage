import React, { useState } from "react";
import CardItem from "./card-item";
import styles from "./index.module.scss";
import { cardData } from "./index.preset";
import { saveItem } from "../../utils/storage";

const CardList = ({ isNeedAnimated }) => {
  const [dataList, setDataList] = useState(cardData);

  const onComplete = (index) => {
    if (index === cardData.length - 1) return;
    const cloneCardData = JSON.parse(JSON.stringify(cardData));
    cloneCardData[index + 1].animate = true; // 下一个动画开始
    setDataList(cloneCardData);
    saveItem("isFirstComeIn", false);
  };

  return (
    <div className={styles.container}>
      {dataList.map((item, index) => (
        <CardItem
          isNeedAnimated={isNeedAnimated}
          title={item.title}
          content={item.content}
          path={item.path}
          key={index}
          isStart={item.animate}
          onComplete={() => onComplete(index)}
        />
      ))}
    </div>
  );
};

export default CardList;
