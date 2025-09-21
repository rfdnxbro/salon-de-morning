import { useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildSalonSummaries, buildUserSummaries } from '../data';
import type { ClientOutletContext } from '../layout';

export function DashboardPage() {
  const { reservations, stats } = useOutletContext<ClientOutletContext>();

  const salonCount = useMemo(
    () => buildSalonSummaries(reservations).length,
    [reservations],
  );
  const userCount = useMemo(
    () => buildUserSummaries(reservations).length,
    [reservations],
  );

  return (
    <div className="grid gap-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold md:text-3xl">ダッシュボード</h2>
          <p className="text-base text-muted-foreground md:text-lg">
            主要な指標とリソースをまとめました。詳細は各一覧ページから確認できます。
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-base md:text-lg">
          提携クライアント {stats.uniqueClients.toLocaleString()} 社
        </Badge>
      </div>

      <section aria-label="主要指標" className="grid gap-6 md:grid-cols-3">
        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-2">
            <CardDescription className="text-sm font-semibold text-muted-foreground">予約総数</CardDescription>
            <CardTitle className="text-3xl text-primary md:text-4xl">{stats.total.toLocaleString()} 件</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground md:text-base">
            期間内に登録された全ての予約件数です。
          </CardContent>
        </Card>

        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-2">
            <CardDescription className="text-sm font-semibold text-muted-foreground">
              確定（訪問予定）
            </CardDescription>
            <CardTitle className="text-3xl text-primary md:text-4xl">{stats.confirmed.toLocaleString()} 件</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground md:text-base">
            今後の訪問予定は {stats.upcoming.toLocaleString()} 件です。
          </CardContent>
        </Card>

        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-2">
            <CardDescription className="text-sm font-semibold text-muted-foreground">利用者</CardDescription>
            <CardTitle className="text-3xl text-primary md:text-4xl">{userCount.toLocaleString()} 名</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground md:text-base">
            派遣を利用した従業員の人数です。
          </CardContent>
        </Card>
      </section>

      <section aria-label="主要リンク" className="grid gap-4 md:grid-cols-3">
        <Card className="border border-dashed bg-muted/40">
          <CardHeader className="gap-3">
            <CardTitle className="text-xl">提携サロン</CardTitle>
            <CardDescription className="text-sm md:text-base">
              提携拠点 {salonCount.toLocaleString()} 箇所の稼働状況と直近訪問予定を確認できます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-center gap-2 text-base">
              <Link to="../salons" aria-label="提携サロン一覧ページを開く">
                一覧を見る
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-dashed bg-muted/40">
          <CardHeader className="gap-3">
            <CardTitle className="text-xl">派遣予約</CardTitle>
            <CardDescription className="text-sm md:text-base">
              状態や訪問日時で絞り込み、準備タスクを管理できます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-center gap-2 text-base">
              <Link to="../reservations" aria-label="派遣予約一覧ページを開く">
                一覧を見る
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-dashed bg-muted/40">
          <CardHeader className="gap-3">
            <CardTitle className="text-xl">利用者</CardTitle>
            <CardDescription className="text-sm md:text-base">
              従業員の利用回数や最新訪問予定を把握できます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-center gap-2 text-base">
              <Link to="../users" aria-label="利用者一覧ページを開く">
                一覧を見る
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
