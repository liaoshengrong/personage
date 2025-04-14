import React from "react";
import PageContainer from "../_components/PageContainer";
import Navbar from "../_components/Navbar";
import ChatCom from "./ChatCom";

const Index = () => {
  return (
    <PageContainer className="xs:!p-0 xs:!pt-5 xs:bg-white">
      <Navbar />
      <ChatCom />
    </PageContainer>
  );
};

export default Index;
