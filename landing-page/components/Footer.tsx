import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>RepeatMaster</h3>
            <p className={styles.tagline}>
              問題集周回記録アプリ
            </p>
          </div>
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4>プロダクト</h4>
              <ul>
                <li><a href="#features">機能</a></li>
                <li><a href="#pricing">料金</a></li>
                <li><a href="#">ダウンロード</a></li>
              </ul>
            </div>
            <div className={styles.linkGroup}>
              <h4>サポート</h4>
              <ul>
                <li><a href="#">ヘルプセンター</a></li>
                <li><a href="#">お問い合わせ</a></li>
                <li><a href="#">利用規約</a></li>
                <li><a href="#">プライバシーポリシー</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; 2025 RepeatMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
