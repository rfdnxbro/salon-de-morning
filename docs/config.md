# config.md

本プロジェクトで導入した設定フラグ・環境変数・ビルド時オプションの一覧を管理します。

## 環境変数（フロント：Vite）
- 注意: `VITE_` プレフィックスのみクライアントに露出（秘密は置かない）

- `VITE_SITE_NAME` 例: `Salon de Morning`
  - サイト共通のブランド名（ロゴ/`document.title`の接頭に使用）

- `VITE_TITLE_USER` 例: `サロン検索`
- `VITE_TITLE_STORE` 例: `店舗ダッシュボード`
- `VITE_TITLE_CLIENT` 例: `派遣クライアント`
- `VITE_TITLE_ADMIN` 例: `管理ダッシュボード`
  - 各アプリの画面タイトル（`document.title` の接尾）

- `VITE_BRAND_SUBLABEL_USER` 例: `一般ユーザー`
- `VITE_BRAND_SUBLABEL_STORE` 例: `店舗スタッフ`
- `VITE_BRAND_SUBLABEL_CLIENT` 例: `クライアント`
- `VITE_BRAND_SUBLABEL_ADMIN` 例: `管理（社内）`
  - ロゴ右側に小さく表示するサブラベル

- `VITE_BASE` 例: `/salon-de-morning/user/`
  - GitHub Pages 等のサブパス配信時に使用（ローカル開発では未使用）

## データ形式
- `packages/mocks/src/data.json`: 人間可読な日時（JST）を `'YYYY-MM-DD HH:mm:ss'` で保持
- `packages/mocks/src/data.ts`: JSONを読み込み、日時を epoch(ms) に変換してエクスポート
  - UI 側は数値(ms)を受け取り、`toLocaleString` で時分表示（秒なし）

## フィーチャーフラグ
- 現時点なし（必要に応じて追記）

## ビルド/ランタイム設定
- 各アプリの `vite.config.ts` は `envDir: '../../'` を指定し、ルートの `.env.*` を参照
