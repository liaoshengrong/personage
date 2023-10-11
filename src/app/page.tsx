'use client'
import react, { createContext } from 'react'
import Welcome from '@/component/welcome'
import Logo from '../component/logo'
import styles from './page.module.css'
import '../../public/locales/index'
export default function Home() {
  return (
    <main className={styles.main} >
      <Logo />
      <Welcome />
    </main>
  )
}
