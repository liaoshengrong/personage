import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import Router from "next/router";
import { useEffect } from "react";
import { CardItemProp } from "../index.preset";
import styles from "./index.module.scss";
import { colors } from "../../../utils/color";
import Link from "next/link";

function CardItem(props: CardItemProp) {
  const { title, content, isStart, onComplete, path, isNeedAnimated } = props;
  const controls = useAnimation();
  const router = useRouter();
  useEffect(() => {
    if (isStart) {
      isNeedAnimated && controls.start({ opacity: 1, y: 0 });
    }
  }, [isStart, isNeedAnimated]);

  return (
    <motion.div
      className={styles.card}
      initial={isNeedAnimated && { opacity: 0, y: 100 }}
      animate={controls}
      whileHover={{
        color: colors.skyblue,
        borderColor: colors.yellowgreen,
        boxShadow: "0 0 8px 3px white",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      <Link rel="stylesheet" href={path} passHref={false}>
        <p>{title}</p>
        <span>{content}</span>
      </Link>
    </motion.div>
  );
}

export default CardItem;
