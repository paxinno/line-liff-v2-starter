# 導線手順（LP → 友だち追加 → 公式LINE → リッチメニュー → ミニアプリ）

## 0. 前提
- 公式LINE（検証用OA）を用意、友だち追加URLを取得
- LIFFを作成済み（Size: Full, Scope: openid, profile）
- Netlify の Site URL を LIFF endpoint に設定済み

## 1. LP
- LPに「友だち追加」ボタンを設置（例：`https://lin.ee/xxxx`）
- スクショ: `screenshots/lp_addfriend.png`

## 2. 友だち追加 → トーク画面遷移
- 初回メッセージ表示を確認（Lステップ無料枠で自動応答）
- スクショ: `screenshots/oa_welcome.png`

## 3. リッチメニュー
- アクションURL を `https://liff.line.me/<LIFF_ID>` に設定
- スクショ: `screenshots/richmenu_tap.png`

## 4. ミニアプリ起動
- 画面表示・各ボタン／カレンダーの動作を確認
- スクショ: `screenshots/liff_top.png`, `screenshots/liff_calendar.png`

## 備考
- 外部ブラウザ遷移が出る端末設定時は起動前提が変わる（詳細は 3_constraints.md）