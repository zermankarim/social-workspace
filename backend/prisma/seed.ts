import { PrismaClient, ProfileRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'password123';

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash, role: ProfileRole.ADMIN },
    create: {
      email: 'admin@example.com',
      passwordHash,
      role: ProfileRole.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { passwordHash, role: ProfileRole.USER },
    create: {
      email: 'user@example.com',
      passwordHash,
      role: ProfileRole.USER,
    },
  });

  const todos = Array.from({ length: 100 }, (_, index) => ({
    userId: index % 2 === 0 ? user.id : admin.id, // 50/50
    text: `Seed todo #${index + 1}`,
    completed: index % 7 === 0, // ~14% completed
  }));

  await prisma.todo.createMany({ data: todos });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
