 # プロジェクト指示書まとめ

ご提示いただいた指示書を目的別に整理したものです。

---

### 1. プロジェクト構成の変更

以下のディレクトリとファイルを作成・修正します。

- **`/deliverables` ディレクトリ作成**
  - `/screenshots/`: スクリーンショット保存用
  - `/videos/`: 動画保存用（任意）
  - `/json/`: メッセージ送信用JSONサンプル
    - `liff_text.json`
    - `liff_flex_simple.json`
    - `messagingapi_text.json`
    - `messagingapi_flex_simple.json`
  - `/docs/`: ドキュメント類
    - `1_flow_steps.md`: ユーザー導線の検証手順
    - `2_message_compare.md`: メッセージの見え方比較表
    - `3_constraints.md`: 既知の制約や注意点

- **`/src/vanilla/` フロントエンド修正**
  - `index.html`: カレンダー機能と「ミニアプリで送信」ボタンを設置
  - `index.js`: `liff.sendMessages` を実行する送信処理を実装

- **`/backend/` バックエンド雛形作成**
  - `server.js`: 通知APIの雛形 (Express)
  - `database.js`: データベース接続の雛形 (SQLite)
  - `.env.example`: `LINE_CHANNEL_ACCESS_TOKEN` の設定例

---

### 2. ビルドとデプロイ設定 (Netlify)

- **`netlify.toml` の設定**
  - `base`: `"src/vanilla"`
  - `command`: `"yarn install --frozen-lockfile && yarn build"`
  - `publish`: `"dist"`
  - `NODE_VERSION`: `"20"`
  - `LIFF_ID` を `[template.environment]` に設定

- **Netlify 環境変数**
  - `LIFF_ID`: `2007934501-Q15J9pAG` などをNetlifyの管理画面で設定

---

### 3. テストと検証フロー

- **ローカルでの起動**
  - `cd src/vanilla`
  - `LIFF_ID='YOUR_LIFF_ID' npx cross-env NODE_ENV=development webpack-dev-server` で開発サーバーを起動

- **Messaging API でのPush通知テスト**
  - `curl` コマンドと `/deliverables/json/` のJSONファイルを使い、Pushメッセージを送信して見え方を確認
  - `LINE_CHANNEL_ACCESS_TOKEN` が必要

- **導線検証**
  1. LPにLINEの「友だち追加」ボタンを設置
  2. 友だち追加後の初回メッセージを確認
  3. リッチメニューからLIFF IDを指定してミニアプリへ遷移
  4. ミニアプリの動作確認

- **成果物**
  - 各手順のスクリーンショットを `/deliverables/screenshots/` に保存
  - `/deliverables/docs/` の各ドキュメントを完成させる

---

### 4. その他

- **デイリー共有**: 用意されたテンプレートで日次進捗を報告
- **制約事項**: LIFFの動作前提や、NetlifyのNodeバージョン（20以上）などの注意点を `3_constraints.md` で確認
