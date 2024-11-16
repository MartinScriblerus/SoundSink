import Image from 'next/image'
import styles from './page.module.css'
import InitializationStyle from './components/InitializationStyle'
import { CssBaseline } from '@mui/material'
import axios from 'axios';
import { Inter } from 'next/font/google'
import PianoIcon from '@mui/icons-material/Piano';
import { useState } from 'react';
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <main className={styles.main}>
      <div 
        id={'centerRoot'} 
        style={{
          background: 'conic-gradient(from 0deg, #ff7b7b, #ffdb4d, #76ff7a, #4d91ff, #ff7b7b)',
          transition: 'background 0.2s ease;', /* Smooth transition */
          willChange: 'background'
      }} className={styles.center}>
        {/* <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        /> */}
      </div>

      <div  style={{boxSizing: 'border-box'}}>

        <InitializationStyle />

      </div>
    </main>
  )
}

