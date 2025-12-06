import styles from './CTA.module.css'

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          さあ、合格への第一歩を
        </h2>
        <p className={styles.subtitle}>
          問題集の周回記録を自動化して、学習に集中しましょう。<br />
          3冊まで完全無料。クレジットカード不要で今すぐ始められます。
        </p>
        <div className={styles.buttons}>
          <a href="#" className={styles.button}>
            無料で始める
          </a>
        </div>
        <p className={styles.notice}>
          iOS・Android対応 | ダウンロード無料
        </p>
      </div>
    </section>
  )
}
