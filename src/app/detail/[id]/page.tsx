import React, { use } from "react";
import PageContainer from "../../_components/PageContainer";
import Navbar from "../../_components/Navbar";
import data from "@/config/data.json";
import { getDetail } from "../../common/api";
import MDRender from "@/app/_components/MDRender";

interface Props {
  params: Promise<{ id: string }>;
}
const Index = ({ params }: Props) => {
  const { id } = use(params) ?? {};
  const { tag, title } = data[+id];
  const content = use(getDetail(tag, title));

  console.log(content);

  return (
    <PageContainer>
      <Navbar />
      <div className="max-w-screen-xl w-full mx-auto animate__animated animate__fadeInUp">
        <h2 className="text-2xl font-600 py-5  text-[#6c32fe]">{title}</h2>
        <MDRender content={content} />
      </div>
    </PageContainer>
  );
};

export default Index;
