import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buildSalonSummaries } from '../data';
import type { ClientOutletContext } from '../layout';

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function SalonsPage() {
  const { reservations } = useOutletContext<ClientOutletContext>();
  const salons = useMemo(() => buildSalonSummaries(reservations), [reservations]);

  return (
    <section aria-labelledby="client-salons" className="grid gap-8">
      <Card className="border-none bg-card/95 shadow-soft">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle id="client-salons" className="text-2xl md:text-3xl">
              提携サロン一覧
            </CardTitle>
            <CardDescription className="text-base">
              提携カフェや会場の利用状況を把握し、社内向け案内にご利用ください。
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit">
            提携拠点 {salons.length.toLocaleString()} 箇所
          </Badge>
        </CardHeader>
        <CardContent>
          <Table aria-label="提携サロン一覧">
            <TableHeader>
              <TableRow>
                <TableHead>拠点名</TableHead>
                <TableHead>所在地</TableHead>
                <TableHead>提供回数</TableHead>
                <TableHead>直近訪問予定</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    まだ提携拠点での訪問がありません。
                  </TableCell>
                </TableRow>
              ) : (
                salons.map((salon) => (
                  <TableRow key={salon.id}>
                    <TableCell className="font-medium">{salon.name}</TableCell>
                    <TableCell>{salon.address}</TableCell>
                    <TableCell>{salon.reservationCount.toLocaleString()} 回</TableCell>
                    <TableCell>
                      {salon.nextReservationAt
                        ? dateFormatter.format(salon.nextReservationAt)
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
