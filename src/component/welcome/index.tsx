import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import HighlightText from "../highlight";
import styles from "./index.module.scss";
// import { useTranslation } from 'react-i18next'
enum Status {
  welcome = "欢迎来到我的个人网站！",
  // welcome = "welcome",
  content = "该网站是由Nextjs搭建而成",
  finally = "请在下方卡片中选择查看的信息内容",
  highlightText = "Nextjs",
}
const animate = { width: "100%", opacity: 1 };

const transition = {
  duration: 1,
};

const Welcome = ({ containerComplete }) => {
  const controls = useAnimation();
  const controlsWelcome = useAnimation();
  const controlsContent = useAnimation();
  const controlsFinaly = useAnimation();

  // const { t } = useTranslation()
  const welcomeComplete = async () => {
    controlsContent.start(animate);
  };
  const contentComplete = () => {
    controlsFinaly.start(animate);
  };

  const finallyComplete = async () => {
    controls.start({ scale: 1, flex: 0 });
  };

  useEffect(() => {
    controlsWelcome.start(animate);
  }, []);

  return (
    <motion.div
      className={styles.container}
      initial={{ scale: 2, flex: 0.5 }}
      animate={controls}
      transition={transition}
      onAnimationComplete={containerComplete}
    >
      <motion.div
        className={styles.aimatedStyle}
        animate={controlsWelcome}
        transition={transition}
        onAnimationComplete={welcomeComplete}
      >
        <span>{Status.welcome}</span>
      </motion.div>
      <motion.div
        className={styles.aimatedStyle}
        animate={controlsContent}
        transition={transition}
        onAnimationComplete={contentComplete}
      >
        <HighlightText
          text={Status.highlightText}
          highlightStyle={{ color: "skyblue" }}
        >
          {Status.content}
        </HighlightText>
      </motion.div>
      <motion.div
        className={styles.aimatedStyle}
        animate={controlsFinaly}
        transition={transition}
        onAnimationComplete={finallyComplete}
      >
        <span>{Status.finally}</span>
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
