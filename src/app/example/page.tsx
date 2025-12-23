import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-0px)] max-w-3xl items-start p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>BioDB Search</CardTitle>
          <CardDescription>
            キーワードを入力してDB検索し、結果から詳細ページへ移動します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/example/search" method="get" className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
              <label className="text-sm font-medium" htmlFor="id">
                PDBID
              </label>
              <div className="sm:col-span-2">
                <Input
                  id="id"
                  name="id"
                  placeholder="例: 1A30"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
              <label className="text-sm font-medium" htmlFor="name">
                Protein Name
              </label>
              <div className="sm:col-span-2">
                <Input
                  id="name"
                  name="name"
                  placeholder="例: kinase"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
              <label className="text-sm font-medium" htmlFor="org">
                Organism
              </label>
              <div className="sm:col-span-2">
                <Input
                  id="org"
                  name="org"
                  placeholder="例: Homo sapiens"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
              <label className="text-sm font-medium" htmlFor="res">
                Resolution ≤
              </label>
              <div className="sm:col-span-2">
                <Input
                  id="res"
                  name="res"
                  inputMode="decimal"
                  placeholder="例: 2.0"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
              <label className="text-sm font-medium" htmlFor="class">
                Class
              </label>
              <div className="sm:col-span-2">
                <select
                  id="class"
                  name="class"
                  defaultValue=""
                  className="border-input dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="">Any</option>
                  <option value="Enzyme">Enzyme</option>
                  <option value="DNA-Binding">DNA-binding</option>
                  <option value="Membrane">Membrane</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full sm:w-auto">
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
