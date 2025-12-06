# RepeatMaster Landing Page

問題集周回記録アプリ「RepeatMaster」のランディングページです。

## 技術スタック

- Next.js 14
- TypeScript
- CSS Modules

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは http://localhost:3000 で起動します。

## ビルド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm start
```

## 静的エクスポート

```bash
npm run build
```

ビルド後、`out/` ディレクトリに静的ファイルが生成されます。

## 特徴

- レスポンシブデザイン
- アプリのテーマカラー（ブルー系）を使用
- 自然で説得力のあるコピーライティング
- SEO対応

## ページ構成

- **Hero**: キャッチコピーとCTA
- **Problem**: ユーザーの課題提示
- **Features**: アプリの特徴6つ
- **Pricing**: フリー vs プレミアムの料金比較
- **FAQ**: よくある質問（アコーディオン形式）
- **CTA**: 最終的な行動喚起
- **Footer**: ナビゲーションリンク

## デプロイ

このプロジェクトは静的サイトとしてエクスポートできるため、以下のプラットフォームにデプロイ可能です：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
