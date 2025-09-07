# salon-de-morning

本リポジトリは初期セットアップ中です。技術要件の確定前に実装は開始しません。

- 仕様/要件: Notion を参照（アクセス可能なメンバーのみ）
  - https://www.notion.so/2557e05887d680619916c4496bdafc54

## ディレクトリ構成（暫定）
- `src/` アプリ本体（機能単位で配置）。共有は `src/shared/`。
- `tests/` 単体テスト（`src/` をミラー）。
- `docs/` ドキュメント（決定記録や設定含む）。
- `assets/` 画像や静的アセット。

## コマンド（暫定）
Makefile は雛形のみ。技術スタック確定後に実装します。

- ビルド: `make build`
- テスト: `make test`
- Lint: `make lint`
- Format: `make fmt`
- 開発サーバ: `make dev`

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

