'use client'

import styles from './Features.module.css'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Features() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className={styles.features} id="features" ref={ref as React.RefObject<HTMLElement>}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>RepeatMasterの特徴</h2>
          <p className={styles.subtitle}>
            資格試験の合格に必要な機能だけを、シンプルに。
          </p>
        </div>

        <div className={styles.featureList}>
          <div className={`${styles.feature} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.featureIcon}>✓</div>
            <div className={styles.featureContent}>
              <h3>タップだけで周回記録</h3>
              <p>
                問題を解いたら○×をタップするだけ。面倒な入力は一切なし。
                章・節・問題番号で細かく管理できるから、どこまで進んだか一目瞭然。
              </p>
            </div>
          </div>

          <div className={`${styles.feature} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.featureIcon}>📊</div>
            <div className={styles.featureContent}>
              <h3>過去の正誤が見える</h3>
              <p>
                解答時に、前回・前々回の正誤履歴を吹き出しで表示。
                「この問題、また間違えた」が分かるから、苦手問題を効率的に潰せます。
              </p>
            </div>
          </div>

          <div className={`${styles.feature} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.featureIcon}>🎯</div>
            <div className={styles.featureContent}>
              <h3>3冊制限が逆に良い</h3>
              <p>
                フリー版は問題集3冊まで。でも資格試験って同時に複数やらないですよね？
                制限があるから「今の資格」に集中できる。合格したら削除して次へ。
              </p>
            </div>
          </div>

          <div className={`${styles.feature} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.featureIcon}>💪</div>
            <div className={styles.featureContent}>
              <h3>続けられる仕組み</h3>
              <p>
                正答率や周回数を自動集計。進捗が見えるからモチベーションが続く。
                メモ機能で間違えた理由も記録できるから、次は確実に正解できる。
              </p>
            </div>
          </div>

          <div className={`${styles.feature} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.featureIcon}>🚀</div>
            <div className={styles.featureContent}>
              <h3>資格試験に特化</h3>
              <p>
                市販の問題集を登録して使う前提の設計。大学受験じゃなく資格試験。
                社会人が短期集中で合格を目指すための、実用性重視のアプリです。
              </p>
            </div>
          </div>

          <div className={`${styles.feature} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.featureIcon}>📱</div>
            <div className={styles.featureContent}>
              <h3>スマホで完結</h3>
              <p>
                通勤中でもカフェでも、スマホ一つで学習管理。
                シンプルなUIだから操作に迷わない。勉強に集中できます。
              </p>
            </div>
        </div>
        </div>
      </div>
    </section>
  )
}
