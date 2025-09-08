# salon-de-morning

本リポジトリは初期セットアップ中です。技術要件の確定前に実装は開始しません。

- 仕様/要件: Notion を参照（アクセス可能なメンバーのみ）
  - https://www.notion.so/2557e05887d680619916c4496bdafc54

## 技術スタック（MVP）
- フロント: React + Vite（CSR）+ TypeScript `strict` + Tailwind CSS
- データ: `packages/mocks` のTypeScriptモック（外部APIなし）
- モノレポ: pnpm workspaces
- デプロイ: GitHub Pages（Actions）/ サブパス `/<repo>/{user,store,client}`

詳細は `docs/adr/0001-tech-stack.md` と `docs/schema.md` を参照してください。

## ディレクトリ構成（暫定）
- `src/` アプリ本体（機能単位で配置）。共有は `src/shared/`。
- `tests/` 単体テスト（`src/` をミラー）。
- `docs/` ドキュメント（決定記録や設定含む）。
- `assets/` 画像や静的アセット。

## モノレポ構成（pnpm）
- `apps/user` 一般ユーザー（CSR, React+Vite+TS+Tailwind）
- `apps/store` 店舗スタッフ（予約一覧）
- `apps/client` 派遣クライアントスタッフ（予約一覧）
- `packages/mocks` モックデータと型

## ローカル実行手順（最短）
前提: Node 20系、pnpm 9系（Corepack推奨）。

1) Node/pnpm 準備
- `node -v`（v20.x を想定）
- `corepack enable`
- `corepack prepare pnpm@9.0.0 --activate`

2) 依存インストール
- リポジトリ直下で `pnpm install`

3) 開発サーバ起動（ターミナル3つだと楽）
- 一般ユーザー: `make dev-user` → http://localhost:5173
- 店舗スタッフ: `make dev-store` → http://localhost:5174
- 派遣クライアント: `make dev-client` → http://localhost:5175

4) ビルド/プレビュー
- ビルド（全アプリ）: `make build`
- プレビュー例: `make preview-user`

補足:
- ポート変更は `pnpm --filter @app/user dev -- --port 5176` のように末尾で指定。
- 整形: `make fmt`（Prettier）。Lintは必要に応じて導入予定。

## デプロイ（GitHub Pages, サブパス配信）
- `main` への push で GitHub Actions が 3 アプリをビルドし、`/<repo>/{user,store,client}` に配置します。
- Vite の `base` はワークフローから `VITE_BASE=/&lt;repo&gt;/&lt;app&gt;` を注入。
- リポジトリ設定 → Pages → Build and deployment: "GitHub Actions" を選択してください。

ローカル開発時は `VITE_BASE` の設定は不要です（ルート `/` で動作）。

## モックデータ
- 型とデータ: `packages/mocks`
  - 型定義: `packages/mocks/src/types.ts`
  - 初期データ: `packages/mocks/src/data.ts`
- 予約情報は「予約枠」に紐づき、枠の `capacity` で人数を管理します。

## トラブルシューティング
- pnpm が見つからない: `corepack enable` を実行、または `npm i -g pnpm@9`。
- ポート衝突: `--port` オプションで変更（例: `pnpm --filter @app/user dev -- --port 5176`）。
- GitHub Pages で白画面:
  - Pages 設定が "GitHub Actions" になっているか確認。
  - ビルドログで `VITE_BASE=/<repo>/<app>` が入っているか確認。

## コントリビューション
- コミット/PR は日本語。小さく論理的に分割し、関連Issue/Notionを記載。
- 機密情報はコミットしない。`.env.example` を更新して共有。

## コーディング規約（要約）
- インデント2スペース、行幅おおよそ100桁。
- 命名: Webフロントは kebab-case、Python は snake_case、型/クラスは PascalCase。
- 小さな純粋関数・疎結合モジュールを優先し、「巨大ファイル」を避ける。
- フォーマッタ/リンタ（例: Prettier/ESLint, Black/Ruff）が有効な場合は従う。

## 進め方
1. `docs/tech-questions.md` の質問に回答し、技術要件を確定。
2. `docs/adr/0001-tech-stack.md` に意思決定を記録（PRでレビュー）。
3. スタックに応じてビルド/テスト/開発コマンドを整備。

## セキュリティ
- 機密情報はコミットしない。`.env.local` を使用し、必要キーは `.env.example` で共有。
- 追加した設定フラグは `docs/config.md` に記録。
