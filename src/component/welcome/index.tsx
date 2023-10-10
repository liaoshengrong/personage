import * as React from 'react'
import { MotionStyle, motion } from "framer-motion";
// import { useTranslation } from 'react-i18next'

function Welcome() {
  // const { t } = useTranslation()
  const animatedOption = {
    animate: { width: '100%', opacity: 1 },
    transition: { duration: 2 }
  }
  return (
    <motion.div style={aimatedStyle} {...animatedOption}  >
      <span>欢迎来到我的个人网站！</span>
    </motion.div>

  )
}

export default Welcome


const aimatedStyle: MotionStyle = {
  width: 0,
  opacity: 0,
  overflow: 'hidden',
  fontSize: '80px',
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  paddingTop: '300px',
  height: '400px'
}