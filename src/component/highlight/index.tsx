import React from "react";

const HighlightText = ({ text, children, highlightStyle }) => {
  const textArr = children.split(new RegExp(`(${text})`));
  console.log(text, textArr, children, "textArr");

  return (
    <div>
      {textArr.map((item, index) => {
        if (item === text) {
          return (
            <span style={highlightStyle} key={index}>
              {item}
            </span>
          );
        }
        return item;
      })}
    </div>
  );
};

export default React.memo(HighlightText);
