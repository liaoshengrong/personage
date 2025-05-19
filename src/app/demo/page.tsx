import React, { use } from "react";
import Navbar from "../_components/Navbar";
import PageContainer from "../_components/PageContainer";
import Drag from "./_components/Drag";
import Tabs from "./_components/Tabs";
import ShortVideo from "./_components/ShortVideo";
import { getVideoData, getWallpaper } from "./api";
import Wallpaper from "./_components/Wallpaper";
import ReactSpring from "./_components/ReactSpring";

const Index = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const video = use(getVideoData());
  const wallpapers = use(getWallpaper());
  const { tab } = searchParams ? use(searchParams) : {};

  return (
    <PageContainer className={tab === "3" ? "xs:px-0" : ""}>
      <Navbar />
      <Tabs titles={tabs} defalultTab={tab}>
        <ShortVideo data={[video]} />
        <Drag />
        <Wallpaper data={wallpapers} />
        <ReactSpring carousel={wallpapers} />
      </Tabs>
    </PageContainer>
  );
};

export default Index;

const tabs = ["刷短视频", "文件解析", "精选壁纸", "React-spring"];
