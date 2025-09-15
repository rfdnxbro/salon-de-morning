# salon-de-morning

本リポジトリは初期セットアップ中です。技術要件の最終確定までは大きな実装を行いません。

- 仕様/要件: Notion を参照（アクセス可能なメンバーのみ）
  - https://www.notion.so/2557e05887d680619916c4496bdafc54

## 必要環境
- Node.js 20.x（LTS）
- pnpm 9.x（Corepack 推奨）
- GitHub アカウント（Pages/Actions を使用）

セットアップ例:

```
node -v               # 20.x を想定
corepack enable
corepack prepare pnpm@9.0.0 --activate
pnpm -v               # 9.x を確認
```

## 技術スタック（MVP）
- フロント: React + Vite（CSR）+ TypeScript `strict` + Tailwind CSS
- データ: `packages/mocks` の TypeScript モック（外部 API なし）
- モノレポ: pnpm workspaces
- デプロイ: GitHub Pages（Actions）/ サブパス `/<repo>/{user,store,client}`

詳細は `docs/adr/0001-tech-stack.md` と `docs/schema.md` を参照してください。

## ディレクトリ構成（暫定）
- `src/` アプリ本体（機能単位）。共有は `src/shared/`。
- `tests/` 単体テスト（`src/` をミラー）。
- `docs/` ドキュメント（決定記録・設定含む）。
- `assets/` 画像や静的アセット。
- `apps/` SPA 群（`user`/`store`/`client`）。
- `packages/mocks` 型とモックデータ。

## モノレポ構成（pnpm）
- `apps/user` 一般ユーザー（CSR, React+Vite+TS+Tailwind）
- `apps/store` 店舗スタッフ（予約一覧）
- `apps/client` 派遣クライアントスタッフ（予約一覧）
- `packages/mocks` モックデータと型

## UI/デザイン
- 方針: shadcn/ui 互換（CLI は未導入）。Tailwind のデザイントークンと `cva` を採用。
- 追加済み: `cn` ユーティリティと `Button` コンポーネント（各アプリに同名配置）。
  - 使い方: `import { Button } from '@/components/ui/button'`
  - 例: `<Button variant="secondary" size="sm">ボタン</Button>`
 - 共通パッケージ: `@sdm/ui` を追加し、`Card`/`Input`/`Badge`/`Table`/`Label` を提供。
   - 使い方例:
     - `import { Card, CardHeader, CardTitle, CardContent } from '@sdm/ui'`
     - `import { Input, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@sdm/ui'`
  - トークンの編集場所: `apps/*/src/styles.css` の `@layer base`（`--primary`/`--radius` など）。
- ダークモード: `html` に `class="dark"` を付与で切替（`darkMode: ['class']`）。
  - スニペット: `document.documentElement.classList.toggle('dark')`
- アイコン: `lucide-react` を利用可能。
  - 例: `import { Calendar } from 'lucide-react'` → `<Calendar className="h-4 w-4" />`
- エイリアス: `@` は `src/` を指します（Vite/TS 設定済み）。
- 追加コンポーネント: 要望に合わせて `Input`/`Card`/`Badge`/`Dialog` などを展開します。

## クイックスタート
1) 依存インストール（ルートで実行）
- `pnpm install`

2) 開発サーバ起動（ターミナル3つあると便利）
- 一般ユーザー: `make dev-user` → http://localhost:5173
- 店舗スタッフ: `make dev-store` → http://localhost:5174
- 派遣クライアント: `make dev-client` → http://localhost:5175

3) ビルド/プレビュー
- ビルド（全アプリ）: `make build`
- プレビュー（例）: `make preview-user`

補足:
- ポート変更は `pnpm --filter @app/user dev -- --port 5176` のように末尾で指定可能。
- 整形: `make fmt`（Prettier）。Lint は未設定（MVP 後に導入検討）。
- テスト: 未設定（MVP 後に追加予定）。

## デプロイ（GitHub Pages, サブパス配信）
- `main` への push で GitHub Actions が 3 アプリをビルドし、`/<repo>/{user,store,client}` に配置します。
- Vite の `base` はワークフローから `VITE_BASE=/<repo>/<app>/`（末尾スラッシュ必須）を注入します。
- リポジトリ設定 → Pages → Build and deployment: "GitHub Actions" を選択してください。

公開 URL 例（`<user>.github.io/<repo>`）
- ランディング: `https://<user>.github.io/<repo>/`
- 一般ユーザー: `https://<user>.github.io/<repo>/user/`
- 店舗スタッフ: `https://<user>.github.io/<repo>/store/`
- 派遣クライアント: `https://<user>.github.io/<repo>/client/`

メモ: GitHub Pages では Jekyll 処理を避けるため `.nojekyll` を配置しています。404 直リンク時はルートへリダイレクトします。

### 公開リンク（本番）
- ランディング: https://rfdnxbro.github.io/salon-de-morning/
- 一般ユーザー: https://rfdnxbro.github.io/salon-de-morning/user/
- 店舗スタッフ: https://rfdnxbro.github.io/salon-de-morning/store/
- 派遣クライアント: https://rfdnxbro.github.io/salon-de-morning/client/


ローカル開発時は `VITE_BASE` の設定は不要です（ルート `/` で動作）。

## モックデータ
- 型とデータ: `packages/mocks`
  - 型定義: `packages/mocks/src/types.ts`
  - 初期データ: `packages/mocks/src/data.json`（JSTの `'YYYY-MM-DD HH:mm:ss'` で保持）
  - ローダ: `packages/mocks/src/data.ts`（日時を ms に変換してエクスポート）
- 予約情報は「予約枠」に紐づき、枠の `capacity` で人数を管理します。

## トラブルシューティング
- pnpm が見つからない: `corepack enable` を実行、または `npm i -g pnpm@9`。
- ポート衝突: `--port` オプションで変更（例: `pnpm --filter @app/user dev -- --port 5176`）。
- GitHub Pages で白画面:
  - Pages 設定が "GitHub Actions" になっているか確認。
  - ビルドログで `VITE_BASE=/<repo>/<app>/` が入っているか確認。
  - URL は末尾スラッシュ付き（例: `/user/`）でアクセスする。

## コントリビューション
- コミット/PR/ドキュメントは日本語。小さく論理的に分割し、関連 Issue/Notion を記載。
- 機密情報はコミットしない。`.env.example` を更新して共有。

## コーディング規約（要約）
- インデント 2 スペース、行幅おおよそ 100 桁。
- 命名: Web フロントは kebab-case、Python は snake_case、型/クラスは PascalCase。
- 小さな純粋関数・疎結合モジュールを優先し、「巨大ファイル」を避ける。
- フォーマッタ/リンタ（例: Prettier/ESLint, Black/Ruff）が有効な場合は従う。

## 進め方
1. `docs/tech-questions.md` の質問に回答し、技術要件を確定。
2. `docs/adr/0001-tech-stack.md` に意思決定を記録（PR でレビュー）。
3. スタックに応じてビルド/テスト/開発コマンドを整備。

## セキュリティ
- 機密情報はコミットしない。`.env.local` を使用し、必要キーは `.env.example` で共有。
- 追加した設定フラグは `docs/config.md` に記録。
