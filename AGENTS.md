# リポジトリガイドライン

本リポジトリは初期セットアップ中です。実装前に必ず仕様（Notion）を確認してください：
https://www.notion.so/2557e05887d680619916c4496bdafc54
コミュニケーション、コメント、ドキュメント、コミットメッセージは日本語で行います。

## プロジェクト構成
- ソースコード: `src/`（機能単位のフォルダ）。共有ユーティリティは `src/shared/`。
- テスト: `tests/` に配置し、`src/` の構造をミラー。
- ドキュメント: `docs/`、静的アセット: `assets/`。
- ルートに各種設定（リンター・フォーマッタ・ツール）の設定ファイルを置く。

## ビルド・テスト・開発コマンド
- ビルド: `make build`（技術スタック確定後に整備）。
- テスト: `make test` / `npm test` / `pytest` などスタックに応じて。
- Lint/Format: `make lint` / `make fmt`。
- 開発サーバ: `make dev`（例: `npm run dev`）。
Makefile やパッケージスクリプトは自己説明的なターゲット名にし、READMEに簡潔に記載してください。

## コーディング規約
- インデントは2スペース、行幅は概ね100桁。
- 命名: Webフロントのファイルは kebab-case、Python は snake_case、型/クラスは PascalCase。
- 小さな純粋関数・疎結合モジュールを優先し、「巨大ファイル」を避ける。
- フォーマッタ/リンタ（例: Prettier/ESLint, Black/Ruff）が有効な場合は従う（手で崩さない）。

## テスト指針
- 単体テストは `tests/` に配置。`foo.test.ts` / `test_foo.py` のような命名。
- 高速で決定的なテストを重視。重要経路と境界値をカバー。
- PR 前に全テストをローカル実行し、必要に応じてカバレッジを確認。

## コミット・PR ガイドライン
- コミット: 短い命令形の日本語サマリ。`#123` のようにIssueを参照。
- 変更は小さく論理的に分割し、無関係な修正の抱き合わせを避ける。
- PR: 背景・目的を記述し、UI 変更はスクリーンショットを添付。該当する Notion 節へのリンクを含める。
- チェックリスト: CI 通過、テスト更新、挙動変更時はドキュメント更新。

## ブランチ戦略（新機能開発）
- 基本の流れ: 「ブランチ作成 → 開発 → PR → Merge → `main` へ戻って最新化 → ブランチ削除（ローカル/リモート）」
- 作業開始前に `main` を最新化する。
  - `git checkout main && git pull origin main`
- 新機能ごとにブランチを切る（例: `feature/123-短い説明`）。
  - `git switch -c feature/<issue-number>-<slug>`
- 実装し、適切にコミットしてリモートへ初回プッシュ。
  - `git push -u origin feature/<issue-number>-<slug>`
- GitHub 上で PR を作成し、レビュワーをアサイン。該当 Notion 節へのリンクを含める。
- PR が merge されたら、ローカルで `main` に戻り最新を取得。
  - `git checkout main && git pull origin main`
- 使い終わったブランチを削除。
  - ローカル: `git branch -d feature/<issue-number>-<slug>`
  - リモート: `git push origin --delete feature/<issue-number>-<slug>`
  - 参照整理（任意）: `git fetch -p`

## セキュリティ・設定
- 秘密情報はコミットしない。`.env.local` を使用し、必要キーは `.env.example` で共有。
- 追加した設定フラグは `docs/config.md` に記録。

## エージェント向けメモ
- 変更は最小・可逆に保ち、理由をPRで簡潔に説明。
- 仕様に曖昧さがある場合は Notion を参照し、早めに相談してください。
