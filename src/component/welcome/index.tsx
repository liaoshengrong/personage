import { motion, useAnimation } from "framer-motion";
import { CSSProperties, useEffect } from "react";
import HighlightText from "../highlight";
import styles from "./index.module.scss";
import { transition, animate, Status } from "./index.preset";
import { colors } from "../../utils/color";

const Welcome = ({ isNeedAnimated, containerComplete }) => {
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

  const opacityStyle: CSSProperties = {
    opacity: isNeedAnimated ? 0 : 1,
    width: isNeedAnimated ? 0 : "100%",
  };

  useEffect(() => {
    isNeedAnimated && controlsWelcome.start(animate);
  }, []);

  return (
    <motion.div
      className={styles.container}
      initial={isNeedAnimated && { scale: 2, flex: 0.5 }}
      animate={controls}
      transition={transition}
      onAnimationComplete={containerComplete}
    >
      <motion.div
        className={styles.aimatedStyle}
        style={opacityStyle}
        animate={controlsWelcome}
        transition={transition}
        onAnimationComplete={welcomeComplete}
      >
        <span>{Status.welcome}</span>
      </motion.div>
      <motion.div
        className={styles.aimatedStyle}
        style={opacityStyle}
        animate={controlsContent}
        transition={transition}
        onAnimationComplete={contentComplete}
      >
        <HighlightText
          text={Status.highlightText}
          highlightStyle={{ color: colors.skyblue }}
        >
          {Status.content}
        </HighlightText>
      </motion.div>
      <motion.div
        className={styles.aimatedStyle}
        style={opacityStyle}
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
