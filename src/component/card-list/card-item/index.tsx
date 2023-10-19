import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CardItemProp } from "../index.preset";
import styles from "./index.module.scss";
import { colors } from "../../../utils/color";

function CardItem(props: CardItemProp) {
  const { title, content, isStart, onComplete, path, isNeedAnimated } = props;
  const controls = useAnimation();
  const hoverControls = useAnimation();
  const router = useRouter();
  useEffect(() => {
    if (isStart) {
      isNeedAnimated && controls.start({ opacity: 1, y: 0 });
    }
  }, [isStart, isNeedAnimated]);

  return (
    <motion.div
      className={styles.card}
      onClick={() => router.push(path)}
      initial={isNeedAnimated && { opacity: 0, y: 100 }}
      animate={controls}
      whileHover={{
        color: colors.skyblue,
        borderColor: "yellowgreen",
        boxShadow: "0 0 8px 3px white",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      <p>{title}</p>
      <span>{content}</span>
    </motion.div>
  );
}

export default CardItem;
