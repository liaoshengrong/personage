import React, { use } from "react";
import List from "./_components/List";

import Navbar from "./_components/Navbar";
import PageContainer from "./_components/PageContainer";
import { headers } from "next/headers";

const Index = () => {
  const { get } = use(headers());
  const ua = get("user-agent") ?? "";
  console.log(ua);

  // 判断是否为移动端
  const isMobile = ua.includes("Mobile");

  return (
    <PageContainer>
      <Navbar />
      <List isUaMobile={isMobile} />
    </PageContainer>
  );
};

export default Index;
