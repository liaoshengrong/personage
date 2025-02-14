import React from "react";
type DataType = {
  tag: string;
  desc: string;
  date: string;
  title: string;
};
const List = ({ data }: { data: DataType[] }) => {
  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item.title}</div>
      ))}
    </div>
  );
};

export default List;
