"use server";

import { revalidatePath } from "next/cache";
import { pdbService } from "@/lib/pdb-service";

export async function addPdbAction(formData: FormData) {
    const pdb_id = String(formData.get("pdb_id") ?? "").trim();
    const protein_name = String(formData.get("protein_name") ?? "").trim();

    if (!pdb_id || !protein_name) return;

    await pdbService.createPdb({ pdb_id, protein_name });

    // Revalidate both management page and search results so new entry appears in searches
    revalidatePath("/example");
    revalidatePath(`/example/search?id=${encodeURIComponent(pdb_id)}`);
}

export async function deletePdbAction(formData: FormData) {
    const pdbId = String(formData.get("pdb_id") ?? "");
    if (!pdbId) return;

    await pdbService.deletePdb(pdbId);
    revalidatePath("/example");
}