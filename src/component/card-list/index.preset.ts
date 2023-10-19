import { AnimationDefinition } from "framer-motion";

export enum Title {
  intro = "个人简介",
  // blog = "个人博客",
  blog = "Card",
  component = "ISR渲染",
  webSite = "网站简介",
}
export interface CardItemProp {
  title: Title;
  content: string;
  isStart: boolean;
  onComplete: (definition: AnimationDefinition) => void;
  path: string;
  isNeedAnimated: boolean;
}

export const cardData = [
  {
    title: Title.intro,
    content: "分享作者这些年走的弯路，附带简历",
    animate: true,
    path: "/intro",
  },
  {
    title: Title.blog,
    content: "关于前端的一些知识分享和踩坑的地方",
    animate: false,
    path: "/blog",
  },
  {
    title: Title.component,
    content: "一些简单的UI组件库，附带github地址",
    animate: false,
    path: "/isrList",
  },
  {
    title: Title.webSite,
    content: "关于这个网站的制作历程和自己理解的Nextjs",
    animate: false,
    path: "/web-site",
  },
];
