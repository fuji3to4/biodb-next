import Link from "next/link";

import { getPdbDetail } from "@/app/example/_lib/biodb";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const runtime = "nodejs"; // Node.js環境で実行
export const dynamic = "force-dynamic"; // キャッシュせず、毎回新しくレンダリング

export default async function PdbDetailPage({
  params,
}: {
  params: Promise<{ pdbID: string }>;
}) {
  const { pdbID } = await params;
  const detail = await getPdbDetail(pdbID);

  if (!detail) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Not Found</CardTitle>
            <CardDescription>PDBID: {pdbID}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary">
              <Link href="/example">検索フォームへ</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <Link href="/example">検索フォームへ</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/example/search">検索結果へ</Link>
        </Button>

      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{detail.pdbID}
            {detail.url ? (
              <Button asChild variant="link">
                <a href={detail.url} target="_blank" rel="noreferrer">
                  PDB link
                </a>
              </Button>
            ) : null}
          </CardTitle>
          <CardDescription>{detail.name ?? ""}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <dt className="text-muted-foreground">Organism</dt>
              <dd className="col-span-2 wrap-break-word">{detail.organism ?? ""}</dd>

              <dt className="text-muted-foreground">Protein length</dt>
              <dd className="col-span-2">{detail.len ?? ""} AA</dd>

              <dt className="text-muted-foreground">Chain</dt>
              <dd className="col-span-2">{detail.chain ?? ""}</dd>

              <dt className="text-muted-foreground">Positions</dt>
              <dd className="col-span-2 wrap-break-word">{detail.positions ?? ""}</dd>

              <dt className="text-muted-foreground">Deposited</dt>
              <dd className="col-span-2">{String(detail.deposited ?? "")}</dd>

              <dt className="text-muted-foreground">Method</dt>
              <dd className="col-span-2">{detail.method ?? ""}</dd>

              <dt className="text-muted-foreground">Resolution</dt>
              <dd className="col-span-2">{detail.resolution ?? ""} Å</dd>

              <dt className="text-muted-foreground">Class</dt>
              <dd className="col-span-2">{detail.class ?? ""}</dd>
            </dl>

            <div>
              <img
                src={`/pic/${encodeURIComponent(detail.pdbID)}.jpeg`}
                alt={detail.pdbID}
                loading="lazy"
                className="w-full rounded-lg border"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
