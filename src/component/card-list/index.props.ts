import { AnimationDefinition } from "framer-motion";

export enum Title {
  intro = "个人简介",
  blog = "个人博客",
  component = "个人组件库",
  webSite = "网站简介",
}
export interface CardItemProp {
  title: Title;
  content: string;
  isStart: boolean;
  onComplete: (definition: AnimationDefinition) => void;
  path: string
}