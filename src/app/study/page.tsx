import React from "react";
import PageContainer from "../_components/PageContainer";
import Navbar from "../_components/Navbar";
import DragMouse from "./_sections/DragMouse";

const page = () => {
  return (
    <PageContainer>
      <Navbar />
      <DragMouse />
    </PageContainer>
  );
};

export default page;
