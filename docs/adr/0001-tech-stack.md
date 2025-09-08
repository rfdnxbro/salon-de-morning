# ADR 0001: 技術スタック選定

ステータス: Proposed  
日付: 2025-09-07

## 背景
本プロジェクトの実装着手に先立ち、フロントエンド/バックエンド/データベース/インフラ/CI の技術選定が必要です。

## 決定（ドラフト）
- UI: React + Vite（CSR）+ TypeScript `strict`、Tailwind CSS。
- モノレポ: pnpm workspaces（Turbo/Nxなし）。
- データ: すべてモック（JSON/TS）でフロント内完結。外部APIなし。
- 認証: なし。
- アプリ構成: 3 SPA をサブパス配信
  - `/user`（検索モックのみ）
  - `/store`（予約一覧）
  - `/client`（予約一覧・クライアント付与分）
- デプロイ: GitHub Pages（Actions）。`/<repo>/{user,store,client}` で公開。

## 根拠
- Notion 仕様および関係者からの要件を反映。
- チームのスキルセット、開発速度、運用負荷、コストを考慮。

## 影響
- Makefile/パッケージスクリプト、CI 設定、ディレクトリ構成を確定。
- コーディング規約（リンタ/フォーマッタ）を具体化。

## 移行計画
- 本 ADR マージ後、必要に応じてESLint導入とE2E（Playwright）を追加。
- 将来のバックエンド（Go）実装時はAPIクライアントパッケージを追加し、`mocks` から置換。
