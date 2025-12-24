"use client";

import { Button } from "@/components/ui/button";
import { deletePdbAction } from "@/app/example/actions";

export default function DeletePdbButton({ id }: { id: string }) {
  return (
    <form action={deletePdbAction} onSubmit={e => {
      if (!confirm("本当に削除しますか？")) {
        e.preventDefault();
      }
    }}>
      <input type="hidden" name="pdb_id" value={String(id)} />
      <Button type="submit" variant="destructive">Delete</Button>
    </form>
  );
}
