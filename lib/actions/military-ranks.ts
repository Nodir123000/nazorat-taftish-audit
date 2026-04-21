
"use server"

import { prisma } from "../db/prisma";

export async function getMilitaryRanksTableData() {
    try {
        console.log("Fetching Military Ranks Table Data...");

        // 1. Fetch Compositions directly
        const compositions = await prisma.ref_compositions.findMany({
            orderBy: { id: 'asc' }
        });

        // 2. Fetch Ranks directly
        const ranks = await prisma.ref_ranks.findMany({
            orderBy: { level: 'asc' }
        });

        // 3. Transform Compositions
        const compositionsMapped = compositions.map((c: any) => {
            const name = c.name && typeof c.name === 'object' ? c.name : { ru: c.name };
            return {
                id: c.id,
                name: name, // Keep raw object for frontend helper
                nameRu: name.ru || "",
                nameUz: name.uz || "",
                nameUzk: name.uzk || "",
                // Add flat fields for backup
                name_uz_latn: name.uz || "",
                name_uz_cyrl: name.uzk || ""
            };
        });

        // 4. Transform Ranks
        const ranksMapped = ranks.map((r: any) => {
            const name = r.name && typeof r.name === 'object' ? r.name : { ru: r.name };
            return {
                id: r.rank_id,
                name: name, // Keep raw object
                nameRu: name.ru || "",
                nameUz: name.uz || "",
                nameUzk: name.uzk || "",
                compositionId: r.composition_id,
                type: r.type,
                level: r.level,
                status: r.status || 'active'
            };
        });

        console.log(`Fetched ${compositionsMapped.length} compositions and ${ranksMapped.length} ranks.`);

        return {
            compositions: compositionsMapped,
            ranks: ranksMapped
        };
    } catch (error) {
        console.error("Error in getMilitaryRanksTableData:", error);
        throw error;
    }
}
