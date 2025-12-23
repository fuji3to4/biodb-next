import Link from "next/link";

import { searchPdb } from "@/app/example/_lib/biodb";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const runtime = "nodejs"; // Node.js環境で実行
export const dynamic = "force-dynamic"; // キャッシュせず、毎回新しくレンダリング

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const id = first(sp.id);
  const name = first(sp.name);
  const org = first(sp.org);
  const cls = first(sp.class);
  const res = first(sp.res);

  const rows = await searchPdb({ id, name, org, class: cls, res });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>検索結果は{rows.length}件です。</CardDescription>
            </div>
            <Button asChild variant="secondary">
              <Link href="/example/">検索フォームに戻る</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>PDBID</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Protein Name</TableHead>
                <TableHead>Organism</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.pdbID}>
                  <TableCell className="font-medium">
                    <Link
                      className="text-primary hover:underline"
                      href={`/example/pdb/${encodeURIComponent(row.pdbID)}`}
                    >
                      {row.pdbID}
                    </Link>
                  </TableCell>
                  <TableCell>{row.method ?? ""}</TableCell>
                  <TableCell>{row.resolution ?? ""}</TableCell>
                  <TableCell>{row.class ?? ""}</TableCell>
                  <TableCell className="max-w-xl truncate">
                    {row.name ?? ""}
                  </TableCell>
                  <TableCell className="max-w-[18rem] truncate">
                    {row.organism ?? ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
