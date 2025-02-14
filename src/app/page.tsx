import React from "react";
import List from "./_components/List";
import data from "@/config/data.json";

const Index = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto p-6 border">
        <div className="text-base mb-4 text-center font-en text-black/80 tracking-widest">
          MARK LIAO
        </div>
        <List data={data} />
      </div>
    </div>
  );
};

export default Index;
