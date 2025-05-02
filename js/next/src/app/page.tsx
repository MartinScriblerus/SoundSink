import React from 'react'
export const config = {
  presets: ['next/babel'],
  plugins: ['styled-components'],
};
import styles from './page.module.css'
import InitializationStyle from './components/InitializationStyle'


export default function Home() {

  return (
      <main  
        style={{
          boxSizing: 'border-box',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
        }}
      >
        <InitializationStyle />
      </main>
  )
}

