# 技術要件ヒアリング（ドラフト）

以下は Notion 記載内容を前提に、実装前に確定したい質問リストです。回答いただければ ADR 化して PR に含めます。

## 1. プロダクト概要/スコープ
- 目的/主要ユーザは？（例: 社内向け/一般公開）
- MVP の範囲は？初回リリースに含める機能の最小集合。
- 非機能要件の優先度（パフォーマンス/コスト/可用性/拡張性）。

## 2. フロントエンド
- Web UI は必要ですか？必要な場合、SSR/SSG/CSR の方針は？
- 推奨スタックの有無（例: Next.js + TypeScript、Vite + React、SvelteKit、Nuxt）。
- UI ライブラリ（例: MUI/Chakra/AntD/Tailwind/独自デザインシステム）。
- i18n/アクセシビリティ要件の有無。

## 3. サーバー/バックエンド
- バックエンドは必要ですか？種類（REST/GraphQL/Serverless/Edge/Functions）。
- 推奨ランタイム（Node.js/TypeScript、Python/FastAPI、Go、その他）。
- 認証/認可の要件（SSO、OAuth、メールリンク、RBAC/ABAC）。
- 外部 API 連携の有無とレイテンシ要件。

## 4. データ/ストレージ
- DB 種別（PostgreSQL/MySQL/SQLite/NoSQL/SaaS型: Supabase/Firebase/Planetscale 等）。
- スキーマ管理（マイグレーションツール: Prisma/Drizzle/SQLAlchemy/Alembic など）。
- バイナリ/画像の保存先（S3 互換/SaaS/CDN）。

## 5. インフラ/デプロイ
- デプロイ先（Vercel/Netlify/Cloudflare/Render/Fly.io/AWS/GCP/Azure/オンプレ）。
- 地域/レイテンシ要件、CDN 利用方針。
- 環境分離（dev/stg/prd）とリリース戦略（トランクベース/リリースブランチ）。

## 6. 品質保証/開発体験
- 静的解析/リンタ（ESLint/Prettier、Ruff/Black 等）の指定は？
- テスト方針（単体/結合/E2E、使用ツール: Vitest/Jest/Playwright/Pytest など）。
- CI/CD 要件（GitHub Actionsの使用可否、必要なジョブ: lint/test/build/deploy）。
- 観測性（ログ、メトリクス、トレーシング、エラートラッキング: Sentryなど）。

## 7. セキュリティ/コンプライアンス
- PII/個人情報の扱いと保存/マスキング方針。
- 秘密情報の管理（.env 管理、Vault/SOPS の利用有無）。
- 依存監査（Dependabot/OSS Review ルール）。

## 8. ライセンス/公開範囲
- リポジトリ公開範囲（Private/Public）。
- OSS ライセンスの指定や外部配布の可能性。

## 9. パフォーマンス/費用
- 負荷目標（QPS/同時接続/中央値・P95 レイテンシ）。
- コスト上限や無料枠活用の方針。

## 10. ロードマップ/マイルストーン
- 最初のリリース目標日と必須要件。
- 優先実装機能/後回し機能。

