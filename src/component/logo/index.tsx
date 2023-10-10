'use client'
import React from 'react'
import styles from '../../app/page.module.css'
import Image from 'next/image'
import './index.scss'
const Logo = () => {
  return (
    <div className='logo'>
      By{' '}
      <Image
        src="/vercel.svg"
        alt="Logo"
        className={styles.vercelLogo}
        width={100}
        height={24}
      />
    </div>
  )
}

export default Logo