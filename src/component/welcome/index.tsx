import * as React from 'react'
import { AnimationDefinition, MotionProps, motion } from "framer-motion";
import styles from './index.module.scss'
import { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next'
enum Status {
  welcome = '欢迎来到我的个人网站！',
  content = '该网站是由nextjs搭建而成',
  finally = '使用ISR渲染机制'
}
const animateView: MotionProps = { animate: { width: '100%', opacity: 1 }, transition: { duration: 1.5 } }
const animateHide: MotionProps = { animate: { width: '0', opacity: 0 }, transition: { duration: 0.5 } }
function Welcome() {
  // const { t } = useTranslation()
  const [text, setText] = useState<Status>(Status.welcome)
  const [animate, setAnimate] = useState(animateView)
  const animRef = useRef(null)
  const onComplete = (definition) => {
    console.log(definition, 'definition');
    if (definition?.opacity === 0) {

      setText(Status.content)
    } else {
      setAnimate(animateHide)
    }

  }
  useEffect(() => {
    if (text === Status.content) {
      setAnimate(animateView)

    }

  }, [text])

  return (
    <motion.div ref={animRef} className={styles.aimatedStyle} {...animate} onAnimationComplete={onComplete}>
      <span>{text}</span>
    </motion.div>

  )
}

export default Welcome
