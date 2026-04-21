
import { PrismaClient } from '@prisma/client'
import { classifiersData } from './classifiers-data'

const prisma = new PrismaClient()

// Map classifier "type" string from classifiers-data.ts to Prisma Model Name
const TYPE_TO_MODEL: Record<string, string> = {
    "inspection_status": "refInspectionStatus",
    "severity_level": "refViolationSeverity",
    "violation_status": "refViolationStatus",
    "decision_status": "refDecisionStatus",
    "military_rank": "refRank",
    "unit_type": "refUnitType",
    "gender": "refGender",
    "nationality": "refNationality",
    "personnel_composition": "refComposition",
    "military_position": "refPosition",
    "funding_source": "refFinancingSource",
    "tmc_type": "refTmcType",
    "audit_object": "refAuditObject",
    "specialization": "refSpecialization",
    "violation_cause": "refViolationReason",
    "education_level": "refEducationLevel",
    "security_clearance": "refSecurityClearance",
    "unit_name": "refSubdivisionName",
    "vus": "refVus",
    "fitness_category": "refFitnessCategory",
    "conduct": "refAwardPenalty",
    "inspection_type": "refInspectionType",
    "control_type": "refControlType",
    "document_type": "refDocumentType",
    "inspection_kind": "refInspectionKind",
    "budget_article": "refBudgetArticle",
    "control_direction": "refControlDirection",
    "control_authority": "refControlAuthority",
    "violation_type": "refViolation",
}

async function seedUnified() {
    console.log("🚀 Starting Unified Seeding...")

    for (const category of classifiersData) {
        const modelName = TYPE_TO_MODEL[category.type]

        if (modelName) {
            console.log(`📦 Seeding Specific Table: ${modelName} for type '${category.type}'`)
            // Seed specific table
            for (const item of category.values) {
                const nameJson = {
                    ru: item.name,
                    uz: item.name_uz_latn,
                    uzk: item.name_uz_cyrl
                }

                // Different models have different unique keys (usually 'code', sometimes 'id' or 'rankId')
                // We need to handle this.
                // RefRank uses rankId. Others use id.

                const delegate = (prisma as any)[modelName]
                if (!delegate) {
                    console.error(`❌ Model '${modelName}' not found in Prisma Client!`)
                    continue
                }

                try {
                    // Logic to find valid ID and Code
                    // Most tables have `id` as Int @id.
                    // RefRank has `rankId` @id.
                    // Models usually also have `code` String? @unique.

                    const itemId = item.id
                    const itemCode = item.id.toString()

                    // Prepare common data
                    const commonData = {
                        name: nameJson,
                        status: "active",
                    }

                    // Specific handling for RefRank (rankId)
                    if (modelName === 'refRank') {
                        await delegate.upsert({
                            where: { rankId: itemId },
                            update: {
                                name: nameJson,
                                type: "military",
                                category: "army"
                            },
                            create: {
                                // rankId: itemId, // Cannot set autoincrement ID manually here
                                name: nameJson,
                                type: "military",
                                category: "army"
                            }
                        })
                    }
                    else if (modelName === 'refVus') {
                        // RefVus uses id @id @default(autoincrement) in schema, BUT data has manual IDs like 140001
                        // We must cast generic upsert to use 'id'
                        await delegate.upsert({
                            where: { id: itemId },
                            update: { ...commonData, code: itemCode },
                            create: { id: itemId, code: itemCode, ...commonData }
                        })
                    }
                    else if (modelName === 'refViolation') {
                        // Manual check for RefViolation
                        const existing = await delegate.findFirst({ where: { code: itemCode } });
                        if (existing) {
                            await delegate.update({
                                where: { violTypeId: existing.violTypeId },
                                data: { name: nameJson }
                            });
                        } else {
                            await delegate.create({
                                data: { code: itemCode, name: nameJson }
                            });
                        }
                    }
                    else if (modelName === 'refBudgetArticle') {
                        // Manual check for RefBudgetArticle
                        const existing = await delegate.findFirst({ where: { code: itemCode } });
                        if (existing) {
                            await delegate.update({
                                where: { articleId: existing.articleId },
                                data: { name: nameJson, isActive: true }
                            });
                        } else {
                            await delegate.create({
                                data: { code: itemCode, name: nameJson, isActive: true }
                            });
                        }
                    }
                    else if (modelName === 'refControlDirection') {
                        // RefControlDirection uses directionId @id
                        // It also has description field which is optional
                        await delegate.upsert({
                            where: { directionId: itemId },
                            update: { ...commonData, code: itemCode },
                            create: { directionId: itemId, code: itemCode, ...commonData }
                        })
                    }
                    else if (modelName === 'refControlAuthority') {
                        // RefControlAuthority uses authorityId @id
                        await delegate.upsert({
                            where: { authorityId: itemId },
                            update: { name: nameJson, code: itemCode }, // No status field in this table
                            create: { authorityId: itemId, code: itemCode, name: nameJson }
                        })
                    }
                    // Default for tables with id @default(autoincrement) and 'code' field
                    else {
                        await delegate.upsert({
                            where: { id: itemId },
                            update: { ...commonData, code: itemCode },
                            create: { id: itemId, code: itemCode, ...commonData }
                        })
                    }
                } catch (e) {
                    console.error(`Error seeding ${modelName} ID ${item.id}:`, e)
                }
            }
        } else {
            console.log(`🗂️ Seeding Generic Table: RefClassifier for type '${category.type}'`)
            // Seed RefClassifier
            for (const item of category.values) {
                const nameJson = {
                    ru: item.name,
                    uz: item.name_uz_latn,
                    uzk: item.name_uz_cyrl
                }

                await prisma.refClassifier.upsert({
                    where: {
                        type_code: {
                            type: category.type,
                            code: item.id.toString()
                        }
                    },
                    update: {
                        name: nameJson
                    },
                    create: {
                        type: category.type,
                        code: item.id.toString(),
                        name: nameJson
                    }
                })
            }
        }
    }

    console.log("✅ Unified Seeding Complete")
}

seedUnified()
    .catch(e => {
        console.error(e)
        // process.exit(1) // Allow to finish
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
