import React, { useState } from "react";
import CardItem from "./card-item";
import styles from "./index.module.scss";
import { Title } from "./index.props";
const statusArr = [true, false, false, false];
const cardData = [
  {
    title: Title.intro,
    content: "分享作者这些年走的弯路，附带简历",
    animate: true,
    path: "/intro",
  },
  {
    title: Title.blog,
    content: "关于前端的一些知识分享和踩坑的地方",
    animate: false,
    path: "/blog",
  },
  {
    title: Title.component,
    content: "一些简单的UI组件库，附带github地址",
    animate: false,
    path: "/UILibray",
  },
  {
    title: Title.webSite,
    content: "关于这个网站的制作历程和自己理解的Nextjs",
    animate: false,
    path: "/web-site",
  },
];
const CardList = () => {
  const [dataList, setDataList] = useState(cardData);

  const onComplete = (index) => {
    if (index === cardData.length - 1) return;
    const cloneCardData = JSON.parse(JSON.stringify(cardData));
    cloneCardData[index + 1].animate = true;
    setDataList(cloneCardData);
  };
  return (
    <div className={styles.container}>
      {dataList.map((item, index) => (
        <CardItem
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
