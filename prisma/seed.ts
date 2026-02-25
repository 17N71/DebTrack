import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SEED_EMAIL = "user@deb-track.local";
const SEED_PASSWORD = "password123";

async function main() {
  const passwordHash = await hash(SEED_PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: SEED_EMAIL },
    update: { passwordHash },
    create: {
      email: SEED_EMAIL,
      passwordHash,
      name: "User",
    },
  });
  console.log("Seed: user", user.id, user.email);

  const seed = process.env.SEED_SAMPLE === "true";
  if (seed) {
    const contact = await prisma.contact.upsert({
      where: { id: "seed-contact-1" },
      update: {},
      create: {
        id: "seed-contact-1",
        userId: user.id,
        name: "John Doe",
        email: "john@example.com",
      },
    });
    await prisma.debt.upsert({
      where: { id: "seed-debt-1" },
      update: {},
      create: {
        id: "seed-debt-1",
        userId: user.id,
        contactId: contact.id,
        type: "I_OWE",
        title: "Personal loan from John",
        principalAmount: 5000,
        currency: "USD",
        startDate: new Date("2025-01-01"),
        dueDate: new Date("2025-06-01"),
        status: "OPEN",
      },
    });
    console.log("Seed: sample contact and debt created.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
