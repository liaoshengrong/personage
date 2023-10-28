"use client";
import { getGirlImageList } from "@/server";
import React, { useEffect, useMemo, useRef, useState } from "react";

import Item from "./item";
import styles from "./page.module.scss";
import { preloadFetch, unique } from "@/utils/function";
import { apiRequest, fetcher } from "@/server/fetch";
import { ImageListProp } from "@/server/type";
import useSWR from "swr";

//在渲染下面的User组件之前预加载资源，
//这可以防止应用程序中出现潜在的瀑布。
//你也可以在鼠标悬停按钮或链接时开始预加载。
preloadFetch("/list", { method: "GET", data: { page: 1 } });

function IsrList() {
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const ref = useRef(null);

  // const { data, isLoading } = apiRequest<ImageListProp>("/list", "GET", {
  //   page: page,
  // });
  const { data, error, isLoading } = useSWR(`list?page=${page}`, (url) =>
    fetcher<ImageListProp>(url, { method: "GET", data: { page: 1 } })
  );

  useEffect(() => {
    if (data?.list) {
      setList(list.concat(data?.list));
    }
  }, [data]);

  console.log(list, isLoading, "list");

  const onScroll = (e) => {
    return null;
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    console.log(123123);
    if (scrollTop + clientHeight >= scrollHeight - 30 && ref.current.flag) {
      ref.current.flag = false;
      const newPage = page + 1;
      setPage(newPage);
    }
  };

  // useEffect(() => {
  //   getData(1);
  //   getData(2);
  // }, []);

  if (isLoading) {
    return <div className={styles.container}>loading...</div>;
  }

  return (
    <div className={styles.container} ref={ref} onScroll={onScroll}>
      <div className={styles.listContainer}>
        {list.map((item, index) => {
          return <Item key={item.url + index} data={item} />;
        })}
      </div>
      <button onClick={() => setPage(page + 1)}>查看更多</button>
    </div>
  );
}

export default IsrList;
