import React from "react";
interface IProps {
  active: number;
  prev?: () => void;
  next?: () => void;
  total: number;
}

export const Paging = (props: IProps) => {
  return (
    <>
      <div className="xs:hidden mt-4">
        <ArrowPaging {...props} />
      </div>
      <div className="hidden xs:block mt-4">
        <DotPaging {...props} />
      </div>
    </>
  );
};

// PC
export const ArrowPaging = ({ active, prev, next, total }: IProps) => {
  return (
    <div className="flex gap-4 justify-center items-center">
      <button
        className="flex justify-center items-center w-10 h-10 border border-black/60 rounded-[50%] text-black/80"
        onClick={prev}
      >
        {"<"}
      </button>
      <span className="text-black text-lg">
        {active + 1} / {total}
      </span>
      <button
        className="flex justify-center items-center w-10 h-10 border border-black/60 rounded-[50%] text-black/80"
        onClick={next}
      >
        {">"}
      </button>
    </div>
  );
};

export const DotPaging = ({ active, total }: IProps) => {
  return (
    <div className="flex justify-center items-center">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className="h-2 rounded-full border border-black/60 mx-1 transition-all duration-300"
          style={{
            backgroundColor: active === i ? "#000" : "transparent",
            width: active === i ? "20px" : "8px",
          }}
        ></button>
      ))}
    </div>
  );
};
