#!/usr/bin/env npx tsx
/**
 * Create a user (email + password). Run with:
 *   pnpm tsx scripts/create-user.ts <email> <password>
 *   npx tsx scripts/create-user.ts <email> <password>
 *
 * Requires DATABASE_URL in .env
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

const email = process.argv[2]?.trim();
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: pnpm tsx scripts/create-user.ts <email> <password>");
  process.exit(1);
}

if (password.length < 6) {
  console.error("Password must be at least 6 characters");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      name: email.split("@")[0] ?? null,
    },
  });
  console.log("User created/updated:", user.id, user.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
