# salon-de-morning

本リポジトリは初期セットアップ中です。技術要件の確定前に実装は開始しません。

- 仕様/要件: Notion を参照（アクセス可能なメンバーのみ）
  - https://www.notion.so/2557e05887d680619916c4496bdafc54

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

## セットアップとコマンド
- 依存インストール: `pnpm install`
- 開発:
  - 一般ユーザー: `make dev-user`（http://localhost:5173）
  - 店舗スタッフ: `make dev-store`（http://localhost:5174）
  - クライアント: `make dev-client`（http://localhost:5175）
- ビルド: `make build`（3アプリ一括）
- プレビュー: `make preview-user` など
- Lint/Format: `make lint` / `make fmt`

## デプロイ（GitHub Pages, サブパス配信）
- `main` への push で GitHub Actions が 3 アプリをビルドし、`/<repo>/{user,store,client}` に配置します。
- Vite の `base` はワークフローから `VITE_BASE=/&lt;repo&gt;/&lt;app&gt;` を注入。
- リポジトリ設定 → Pages → Build and deployment: "GitHub Actions" を選択してください。

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
