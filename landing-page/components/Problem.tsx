'use client'

import styles from './Problem.module.css'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Problem() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className={styles.problem} ref={ref as React.RefObject<HTMLElement>}>
      <div className={styles.container}>
        <h2 className={`${styles.title} ${isVisible ? styles.visible : ''}`}>
          こんな悩み、ありませんか？
        </h2>
        <div className={styles.problems}>
          <div className={`${styles.problemCard} ${styles.card1} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.emoji}>📚</div>
            <h3>何周したか忘れる</h3>
            <p>ノートに記録するのは面倒。気づいたらどこまでやったか分からなくなる。</p>
          </div>
          <div className={`${styles.problemCard} ${styles.card2} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.emoji}>😓</div>
            <h3>前回の正誤が分からない</h3>
            <p>この問題、前回も間違えたっけ？履歴が見えないから苦手分野が把握できない。</p>
          </div>
          <div className={`${styles.problemCard} ${styles.card3} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.emoji}>📱</div>
            <h3>学習が続かない</h3>
            <p>記録が面倒で三日坊主に。進捗が見えないからモチベーションが上がらない。</p>
          </div>
        </div>
      </div>
    </section>
  )
}
