"use client";
import { getGirlImageList } from "@/server";
import React, { useEffect, useRef, useState } from "react";

import Item from "./item";
import styles from "./page.module.scss";
import { unique } from "@/utils/function";
function IsrList() {
  const [page, setPage] = useState(2);
  const [list, setList] = useState([]);
  const ref = useRef(null);
  // console.log(data, "datadata");
  const getData = async (page?: number) => {
    const data = await getGirlImageList({ page });
    ref.current.flag = true;
    if (!data) return;
    const newData = unique(list.concat(data), "imageUrl");

    setList(newData);
  };

  const onScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 30 && ref.current.flag) {
      ref.current.flag = false;
      const newPage = page + 1;
      setPage(newPage);
      getData(newPage);
    }
  };

  useEffect(() => {
    getData(1);
    getData(2);
  }, []);

  return (
    <div className={styles.container} ref={ref} onScroll={onScroll}>
      <div className={styles.listContainer}>
        {list?.map((item) => {
          return (
            <Item
              key={item.imageUrl}
              data={{
                url: item.imageUrl,
                width: +item.imageSize.split("x")[0],
                height: +item.imageSize.split("x")[1],
              }}
              // data={item}
            />
          );
        })}
      </div>
    </div>
  );
}

export default IsrList;
