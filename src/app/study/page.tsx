import React from "react";
import PageContainer from "../_components/PageContainer";
import Navbar from "../_components/Navbar";
import DragMouse from "./_sections/DragMouse";
import Easy from "./_sections/Easy";
import StopBack from "./_sections/StopBack";

const page = () => {
  return (
    <PageContainer>
      <Navbar />
      <DragMouse />
      <Easy />
      <StopBack />
    </PageContainer>
  );
};

export default page;
