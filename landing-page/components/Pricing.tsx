import styles from './Pricing.module.css'

export default function Pricing() {
  return (
    <section className={styles.pricing} id="pricing">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>料金プラン</h2>
          <p className={styles.subtitle}>
            まずは無料で始めて、必要なら後からアップグレード
          </p>
        </div>

        <div className={styles.plans}>
          <div className={styles.plan}>
            <div className={styles.planHeader}>
              <h3 className={styles.planName}>フリー</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>¥0</span>
                <span className={styles.pricePeriod}>/ 永久無料</span>
              </div>
            </div>
            <ul className={styles.features}>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                問題集登録 3冊まで
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                周回記録機能
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                正誤履歴表示
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                進捗管理
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                メモ機能
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                広告表示あり
              </li>
            </ul>
            <div className={styles.recommended}>
              <p>短期集中型の資格受験者におすすめ</p>
            </div>
            <button className={styles.planButton}>無料で始める</button>
          </div>

          <div className={`${styles.plan} ${styles.planPremium}`}>
            <div className={styles.badge}>人気</div>
            <div className={styles.planHeader}>
              <h3 className={styles.planName}>プレミアム</h3>
              <div className={styles.price}>
                <span className={styles.priceAmount}>¥480</span>
                <span className={styles.pricePeriod}>/ 月</span>
              </div>
            </div>
            <ul className={styles.features}>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                問題集登録 無制限
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                周回記録機能
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                正誤履歴表示
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                進捗管理
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                メモ機能
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                広告なし
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                データバックアップ
              </li>
              <li className={styles.featureItem}>
                <span className={styles.check}>✓</span>
                優先サポート
              </li>
            </ul>
            <div className={styles.recommended}>
              <p>複数資格や長期学習者におすすめ</p>
            </div>
            <button className={`${styles.planButton} ${styles.planButtonPremium}`}>
              プレミアムを試す
            </button>
          </div>
        </div>

        <p className={styles.notice}>
          ※ プレミアムプランは初回14日間無料でお試しいただけます
        </p>
      </div>
    </section>
  )
}
