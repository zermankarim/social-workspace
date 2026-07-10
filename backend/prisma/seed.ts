import { PrismaClient, ProfileRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'password123';

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash, role: ProfileRole.ADMIN },
    create: {
      email: 'admin@example.com',
      passwordHash,
      role: ProfileRole.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { passwordHash, role: ProfileRole.USER },
    create: {
      email: 'user@example.com',
      passwordHash,
      role: ProfileRole.USER,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
