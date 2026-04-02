/**
 * One-time migration: set all fully-paid debts (remaining balance <= 0)
 * to ARCHIVED status.
 *
 * Usage: npx tsx scripts/archive-paid-debts.ts
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const debts = await prisma.debt.findMany({
    where: { status: { in: ["OPEN", "CLOSED"] } },
    include: { payments: true },
  });

  let archived = 0;
  for (const debt of debts) {
    const principal = Number(debt.principalAmount);
    const paid = debt.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const remaining = Math.max(0, Math.round((principal - paid) * 100) / 100);

    if (remaining <= 0) {
      await prisma.debt.update({
        where: { id: debt.id },
        data: { status: "ARCHIVED" },
      });
      console.log(`Archived: "${debt.title}" (paid ${paid} / ${principal})`);
      archived++;
    }
  }

  console.log(`\nDone. Archived ${archived} fully-paid debt(s) out of ${debts.length} total.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
