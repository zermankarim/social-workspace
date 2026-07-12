import { Prisma, PrismaClient, ProfileRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'password123';
const POST_MOCK_IDS = Array.from(
  { length: 20 },
  (_, index) =>
    `11111111-1111-1111-1111-${String(index + 1).padStart(12, '0')}`,
);
const COMMENT_MOCK_IDS = Array.from(
  { length: 20 },
  (_, index) =>
    `11111111-1111-1111-1112-${String(index + 1).padStart(12, '0')}`,
);

const LANGUAGES: { code: string; nameEn: string; nameRu: string }[] = [
  { code: 'en', nameEn: 'English', nameRu: 'Английский' },
  { code: 'ru', nameEn: 'Russian', nameRu: 'Русский' },
  { code: 'kk', nameEn: 'Kazakh', nameRu: 'Казахский' },
  { code: 'uk', nameEn: 'Ukrainian', nameRu: 'Украинский' },
  { code: 'de', nameEn: 'German', nameRu: 'Немецкий' },
  { code: 'fr', nameEn: 'French', nameRu: 'Французский' },
  { code: 'es', nameEn: 'Spanish', nameRu: 'Испанский' },
  { code: 'it', nameEn: 'Italian', nameRu: 'Итальянский' },
  { code: 'pt', nameEn: 'Portuguese', nameRu: 'Португальский' },
  { code: 'zh', nameEn: 'Chinese', nameRu: 'Китайский' },
  { code: 'ja', nameEn: 'Japanese', nameRu: 'Японский' },
  { code: 'ko', nameEn: 'Korean', nameRu: 'Корейский' },
  { code: 'ar', nameEn: 'Arabic', nameRu: 'Арабский' },
  { code: 'tr', nameEn: 'Turkish', nameRu: 'Турецкий' },
  { code: 'pl', nameEn: 'Polish', nameRu: 'Польский' },
];

const SKILLS = [
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'NestJS',
  'PostgreSQL',
  'Prisma',
  'Docker',
  'Git',
  'Python',
  'Java',
  'Go',
  'SQL',
  'REST API',
  'GraphQL',
  'CSS',
  'HTML',
  'Leadership',
  'Communication',
];

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash, role: ProfileRole.ADMIN },
    create: {
      email: 'admin@example.com',
      passwordHash,
      role: ProfileRole.ADMIN,
      firstName: 'Admin',
      lastName: 'Admin',
      headline: 'Platform Administrator',
      location: {
        create: {
          lat: 0,
          lng: 0,
          label: 'New York, NY, USA',
          city: 'New York',
          country: 'USA',
          placeId: 'ChIJN1t_t2ZagwRYpp_3PN47QTk',
        },
      },
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { passwordHash, role: ProfileRole.USER },
    create: {
      email: 'user@example.com',
      passwordHash,
      role: ProfileRole.USER,
      firstName: 'John',
      lastName: 'Doe',
      headline: 'Software Engineer',
      location: {
        create: {
          lat: 0,
          lng: 0,
          label: 'New York, NY, USA',
          city: 'New York',
          country: 'USA',
          placeId: 'ChIJN1t_t2ZagwRYpp_3PN47QTk',
        },
      },
    },
  });

  for (const language of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: language.code },
      update: { nameEn: language.nameEn, nameRu: language.nameRu },
      create: language,
    });
  }

  for (const name of SKILLS) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const posts = Array.from({ length: 20 }, (_, index) => ({
    id: POST_MOCK_IDS[index],
    textContent: `Content of post #${index + 1}`,
    authorId: index % 2 === 0 ? user.id : admin.id,
  }));

  await prisma.post.createMany({ data: posts, skipDuplicates: true });

  const comments: Prisma.PostCommentCreateManyInput[] = posts.map(
    (post, index) => ({
      id: COMMENT_MOCK_IDS[index],
      textContent: `Content of comment #${index + 1}`,
      authorId: index % 2 === 0 ? user.id : admin.id,
      postId: post.id,
    }),
  );

  await prisma.postComment.createMany({
    data: comments,
    skipDuplicates: true,
  });

  await prisma.post.updateMany({
    where: {
      id: {
        in: posts.map((post) => post.id),
      },
    },
    data: {
      commentsCount: 1,
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
