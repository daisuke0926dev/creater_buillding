# Creator Building

クリエイターが自分の作品をシェアするためのプラットフォーム

## 概要

Creator Buildingは、クリエイターが自身の作品を簡単にシェアし、ファンとつながることができるプラットフォームです。SNSリンクや作品URLを一元管理し、フォロワーは簡単にクリエイターの作品にアクセスすることができます。

## 主な機能

### クリエイター（管理者）モード
- SNSリンクの登録（Twitter, Instagram, TikTok, ニコニコ動画）
- 作品URLの登録（YouTube, TikTok, ニコニコ動画）
- 作品のサムネイル画像登録
- お問い合わせ用メールアドレスの登録

### 閲覧者モード
- クリエイターのフォロー機能
- グリッド形式でのクリエイター一覧表示
- クリエイター詳細ページでの作品閲覧
- サムネイル付きの作品リンク表示

## 技術スタック

- フロントエンド: React.js
- バックエンド: Node.js + Express
- データベース: PostgreSQL
- 認証: Firebase Authentication
- 画像ストレージ: Firebase Storage

## セットアップ手順

1. リポジトリのクローン
```bash
git clone [repository-url]
cd creator-building
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
`.env`ファイルを作成し、必要な環境変数を設定してください。

4. 開発サーバーの起動
```bash
npm run dev
```

## ライセンス

MIT License