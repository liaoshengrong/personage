import React from "react";
import PageContainer from "../_components/PageContainer";
import Navbar from "../_components/Navbar";
import ChatCom from "./ChatCom";
export const metadata = {
  title: "Mark的个人AI大模型",
};
const Index = () => {
  return (
    <PageContainer className="xs:!p-0 xs:pt-5 xs:bg-white">
      <div className="xs:px-5">
        <Navbar />
      </div>
      <ChatCom />
    </PageContainer>
  );
};

export default Index;
