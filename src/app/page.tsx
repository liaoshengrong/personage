import React from "react";
import List from "./_components/List";
import data from "@/config/data.json";
import Navbar from "./_components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen p-8 h-full">
      <Navbar />
      <List data={data} />
    </div>
  );
};

export default Index;
