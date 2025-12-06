'use client'

import { useState } from 'react'
import styles from './FAQ.module.css'

interface FAQItemProps {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.faqItem}>
      <button
        className={styles.question}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className={styles.answer}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const faqs = [
    {
      question: 'どんな問題集に対応していますか？',
      answer: '市販の問題集全般に対応しています。章・節・問題数を自分で設定できるので、どんな構造の問題集でも登録可能です。資格試験、公務員試験、検定試験など幅広くお使いいただけます。',
    },
    {
      question: 'フリー版で十分ですか？',
      answer: '短期集中で1つの資格を目指す方なら、フリー版で十分です。問題集3冊登録できるので、テキスト＋問題集＋過去問の組み合わせにも対応できます。複数資格を同時進行する場合はプレミアム版をおすすめします。',
    },
    {
      question: '途中でプレミアムにアップグレードできますか？',
      answer: 'はい、いつでもアップグレード可能です。フリー版で記録したデータはそのまま引き継がれます。プレミアムは14日間無料でお試しいただけるので、まずは使ってみてください。',
    },
    {
      question: '広告はどれくらい表示されますか？',
      answer: 'フリー版では学習の妨げにならない程度に広告を表示します。問題を解いている最中には表示されません。集中して勉強したい方はプレミアム版（広告なし）をご検討ください。',
    },
    {
      question: 'データのバックアップはできますか？',
      answer: 'プレミアム版ではクラウドバックアップに対応しています。機種変更時もデータを引き継げるので安心です。フリー版は端末内にデータを保存します。',
    },
    {
      question: '解約後のデータはどうなりますか？',
      answer: 'プレミアムを解約してもフリー版として引き続き利用できます。ただし問題集は3冊までの制限がかかります。データは削除されませんのでご安心ください。',
    },
    {
      question: '大学受験にも使えますか？',
      answer: '使えますが、資格試験に特化して設計しています。大学受験の場合、長期間の学習管理や模試の記録には対応していません。短期集中型の問題集周回には十分お使いいただけます。',
    },
    {
      question: 'パソコンでも使えますか？',
      answer: '現在はスマートフォン専用アプリです。外出先でもサッと記録できることを重視しています。Web版の提供は今後検討していきます。',
    },
  ]

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>よくある質問</h2>
        </div>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
