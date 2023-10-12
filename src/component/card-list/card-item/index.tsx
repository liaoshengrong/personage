import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CardItemProp } from "../index.props";
import styles from "./index.module.scss";

function CardItem({ title, content, isStart, onComplete, path }: CardItemProp) {
  const controls = useAnimation();
  const router = useRouter();
  useEffect(() => {
    if (isStart) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isStart]);

  return (
    <motion.div
      className={styles.card}
      onClick={() => router.push(path)}
      initial={{ opacity: 0, y: 100 }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
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
