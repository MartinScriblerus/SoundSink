import React from 'react'
export const config = {
  presets: ['next/babel'],
  plugins: ['styled-components'],
};
// import Image from 'next/image'
import styles from './page.module.css'
import InitializationStyle from './components/InitializationStyle'


export default function Home() {

  return (
    <main className={styles.main}>
      <div 
        id={'centerRoot'} 
        style={{
          // width: 'inherit',
          display: 'flex',
          alignSelf: 'flex-start'
        }} 
        className={styles.center}
      >
      </div>
      <div  
        style={{
          boxSizing: 'border-box',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
        }}
      >
        <InitializationStyle />
      </div>
    </main>
  )
}

