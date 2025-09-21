import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buildUserSummaries } from '../data';
import type { ClientOutletContext } from '../layout';

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function UsersPage() {
  const { reservations } = useOutletContext<ClientOutletContext>();
  const users = useMemo(() => buildUserSummaries(reservations), [reservations]);

  return (
    <section aria-labelledby="client-users" className="grid gap-8">
      <Card className="border-none bg-card/95 shadow-soft">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle id="client-users" className="text-2xl md:text-3xl">
              利用者一覧
            </CardTitle>
            <CardDescription className="text-base">
              派遣を利用した従業員と最新の訪問予定を確認できます。
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit">
            対象利用者 {users.length.toLocaleString()} 名
          </Badge>
        </CardHeader>
        <CardContent>
          <Table aria-label="利用者一覧">
            <TableHeader>
              <TableRow>
                <TableHead>氏名</TableHead>
                <TableHead>総予約数</TableHead>
                <TableHead>直近訪問予定</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                    まだ派遣予約はありません。
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.totalReservations.toLocaleString()} 件</TableCell>
                    <TableCell>
                      {user.latestReservationAt
                        ? dateFormatter.format(user.latestReservationAt)
                        : '予定なし'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
