"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addPdbAction } from "@/app/example/actions";

export default function AddPdbForm() {
  return (
    <form action={addPdbAction} className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Input name="pdb_id" placeholder="PDB ID (例: 1A30)" required />
        <Input name="protein_name" placeholder="Protein name" required />
      </div>
      <div>
        <Button type="submit">Add PDB</Button>
      </div>
    </form>
  );
}
