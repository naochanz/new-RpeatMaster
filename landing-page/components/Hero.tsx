'use client'

import styles from './Hero.module.css'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.gradient1}></div>
        <div className={styles.gradient2}></div>
        <div className={styles.grid}></div>
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles.particle} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>
      <div className={styles.container}>
        <div className={`${styles.content} ${mounted ? styles.visible : ''}`}>
          <h1 className={styles.title}>
            問題集、何周したか<br />
            覚えてますか？
          </h1>
          <p className={styles.subtitle}>
            資格試験の勉強で一番大事なのは、問題集を繰り返すこと。<br />
            でも記録するのって面倒ですよね。<br />
            RepeatMasterなら、タップするだけで周回記録が完了します。
          </p>
          <div className={styles.ctaButtons}>
            <a href="#pricing" className={styles.primaryButton}>
              <span>無料で始める</span>
              <span className={styles.arrow}>→</span>
            </a>
            <a href="#features" className={styles.secondaryButton}>
              機能を見る
            </a>
          </div>
          <p className={styles.notice}>
            3冊まで完全無料 ・ クレジットカード不要
          </p>
        </div>
      </div>
    </section>
  )
}
