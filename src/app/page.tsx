import React from "react";
import List from "./_components/List";
import data from "@/config/data.json";
import Navbar from "./_components/Navbar";
import PageContainer from "./_components/PageContainer";

const Index = () => {
  return (
    <PageContainer>
      <Navbar />
      <List data={data} />
    </PageContainer>
  );
};

export default Index;
