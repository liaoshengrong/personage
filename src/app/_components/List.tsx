import React from "react";
import Perview from "./Perview";

const List = ({ data }: { data: DataType[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <Perview key={index} data={item} />
      ))}
    </div>
  );
};

export default List;
