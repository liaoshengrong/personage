"use client";
import { getDatalist } from "@/utils";
import React, { useEffect, useState } from "react";
type DataType = {
  tag: string;
  desc: string;
  date: string;
  title: string;
};
const List = () => {
  const [data, setData] = useState<DataType[]>([]);
  console.log(data, "datadatadata");

  useEffect(() => {
    getDatalist().then((res) => {
      setData(getData(res));
    });
  }, []);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item.title}</div>
      ))}
    </div>
  );
};

export default List;

const getData = (res: any) => {
  const d = res.map((item: any) => {
    return {
      tag: item["分类"],
      desc: item["描述"],
      date: item["日期"],
      title: item["标题"],
    };
  });

  return d;
};
