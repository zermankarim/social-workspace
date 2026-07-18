import {
  ConnectionStatus,
  EducationDegree,
  EmploymentType,
  LanguageProficiency,
  NotificationType,
  PostLikeType,
  PreferredLocale,
  PrismaClient,
  ProfileRole,
  WorkplaceType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { generateKeyPairSync } from 'node:crypto';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'Review123!';
const LEGACY_MESSAGE_NONCE = 'stub-nonce-v1';

const LANGUAGES = [
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
] as const;

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
  'Go',
  'SQL',
  'REST API',
  'GraphQL',
  'CSS',
  'Product Strategy',
  'Product Design',
  'Data Analysis',
  'Recruiting',
  'Leadership',
  'Communication',
] as const;

const USER_FIXTURES = [
  {
    key: 'review',
    email: 'review@example.com',
    role: ProfileRole.ADMIN,
    preferredLocale: PreferredLocale.en,
    firstName: 'Elena',
    lastName: 'Morozova',
    headline: 'Head of Product Engineering',
    bio: 'I build product teams and reliable systems for growing professional communities. Interested in platform architecture, healthy engineering culture, and measurable product outcomes.',
    avatarUrl: 'https://i.pravatar.cc/300?img=47',
    coverUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600',
    website: 'https://example.com/elena',
    github: 'https://github.com/example',
    city: 'Berlin',
    country: 'Germany',
    lat: 52.52,
    lng: 13.405,
    skills: ['Leadership', 'TypeScript', 'Product Strategy', 'PostgreSQL'],
    languages: [
      ['en', LanguageProficiency.FULL_PROFESSIONAL],
      ['ru', LanguageProficiency.NATIVE_OR_BILINGUAL],
      ['de', LanguageProficiency.PROFESSIONAL],
    ] as const,
    experience: {
      title: 'Head of Product Engineering',
      companyName: 'Northstar Labs',
      employmentType: EmploymentType.FULL_TIME,
      workplaceType: WorkplaceType.HYBRID,
      startDate: new Date('2022-03-01'),
      description:
        'Leading product engineering, platform reliability, and developer experience across distributed teams.',
    },
    education: {
      schoolName: 'Technical University of Berlin',
      degree: EducationDegree.MASTER,
      startDate: new Date('2012-09-01'),
      endDate: new Date('2014-06-30'),
      description: 'Computer Science — distributed systems.',
      gradePoint: 1.4,
    },
  },
  {
    key: 'amir',
    email: 'amir.hassan@example.com',
    role: ProfileRole.USER,
    preferredLocale: PreferredLocale.en,
    firstName: 'Amir',
    lastName: 'Hassan',
    headline: 'Senior Backend Engineer · Distributed Systems',
    bio: 'Backend engineer focused on dependable APIs, event-driven systems, and pragmatic observability.',
    avatarUrl: 'https://i.pravatar.cc/300?img=12',
    coverUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600',
    website: 'https://example.com/amir',
    github: 'https://github.com/example',
    city: 'Amsterdam',
    country: 'Netherlands',
    lat: 52.3676,
    lng: 4.9041,
    skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Docker', 'Go'],
    languages: [
      ['en', LanguageProficiency.FULL_PROFESSIONAL],
      ['ar', LanguageProficiency.NATIVE_OR_BILINGUAL],
    ] as const,
    experience: {
      title: 'Senior Backend Engineer',
      companyName: 'Atlas Systems',
      employmentType: EmploymentType.FULL_TIME,
      workplaceType: WorkplaceType.REMOTE,
      startDate: new Date('2021-08-01'),
      description:
        'Designing high-throughput services and mentoring engineers on production readiness.',
    },
    education: {
      schoolName: 'Delft University of Technology',
      degree: EducationDegree.MASTER,
      startDate: new Date('2014-09-01'),
      endDate: new Date('2016-07-01'),
      description: 'Software systems and cloud computing.',
      gradePoint: 8.7,
    },
  },
  {
    key: 'sofia',
    email: 'sofia.rossi@example.com',
    role: ProfileRole.USER,
    preferredLocale: PreferredLocale.en,
    firstName: 'Sofia',
    lastName: 'Rossi',
    headline: 'Staff Product Designer · Design Systems',
    bio: 'I turn complex workflows into calm, accessible product experiences and scalable design systems.',
    avatarUrl: 'https://i.pravatar.cc/300?img=32',
    coverUrl:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1600',
    website: 'https://example.com/sofia',
    github: null,
    city: 'Milan',
    country: 'Italy',
    lat: 45.4642,
    lng: 9.19,
    skills: ['Product Design', 'CSS', 'Communication', 'Leadership'],
    languages: [
      ['it', LanguageProficiency.NATIVE_OR_BILINGUAL],
      ['en', LanguageProficiency.FULL_PROFESSIONAL],
    ] as const,
    experience: {
      title: 'Staff Product Designer',
      companyName: 'Canvas Works',
      employmentType: EmploymentType.FULL_TIME,
      workplaceType: WorkplaceType.HYBRID,
      startDate: new Date('2020-11-01'),
      description:
        'Owning the design system and accessibility practice for a multi-product platform.',
    },
    education: {
      schoolName: 'Politecnico di Milano',
      degree: EducationDegree.MASTER,
      startDate: new Date('2013-09-01'),
      endDate: new Date('2015-07-01'),
      description: 'Communication design and human-computer interaction.',
      gradePoint: 108,
    },
  },
  {
    key: 'daniel',
    email: 'daniel.kim@example.com',
    role: ProfileRole.USER,
    preferredLocale: PreferredLocale.en,
    firstName: 'Daniel',
    lastName: 'Kim',
    headline: 'Data Product Lead · Analytics & Experimentation',
    bio: 'Helping product teams ask better questions, run trustworthy experiments, and act on data.',
    avatarUrl: 'https://i.pravatar.cc/300?img=11',
    coverUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600',
    website: 'https://example.com/daniel',
    github: 'https://github.com/example',
    city: 'Toronto',
    country: 'Canada',
    lat: 43.6532,
    lng: -79.3832,
    skills: ['Python', 'SQL', 'Data Analysis', 'Product Strategy'],
    languages: [
      ['en', LanguageProficiency.NATIVE_OR_BILINGUAL],
      ['ko', LanguageProficiency.PROFESSIONAL],
    ] as const,
    experience: {
      title: 'Data Product Lead',
      companyName: 'Signal Metrics',
      employmentType: EmploymentType.FULL_TIME,
      workplaceType: WorkplaceType.REMOTE,
      startDate: new Date('2023-01-01'),
      description:
        'Building experimentation and analytics capabilities for product organizations.',
    },
    education: {
      schoolName: 'University of Toronto',
      degree: EducationDegree.BACHELOR,
      startDate: new Date('2012-09-01'),
      endDate: new Date('2016-06-01'),
      description: 'Statistics and computer science.',
      gradePoint: 3.8,
    },
  },
  {
    key: 'maya',
    email: 'maya.patel@example.com',
    role: ProfileRole.USER,
    preferredLocale: PreferredLocale.en,
    firstName: 'Maya',
    lastName: 'Patel',
    headline: 'Technical Talent Partner · Scaling Product Teams',
    bio: 'Partnering with thoughtful teams and helping candidates make informed career decisions.',
    avatarUrl: 'https://i.pravatar.cc/300?img=45',
    coverUrl:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600',
    website: 'https://example.com/maya',
    github: null,
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5072,
    lng: -0.1276,
    skills: ['Recruiting', 'Communication', 'Leadership'],
    languages: [
      ['en', LanguageProficiency.NATIVE_OR_BILINGUAL],
      ['fr', LanguageProficiency.ADVANCED],
    ] as const,
    experience: {
      title: 'Technical Talent Partner',
      companyName: 'BrightPath',
      employmentType: EmploymentType.FULL_TIME,
      workplaceType: WorkplaceType.HYBRID,
      startDate: new Date('2022-06-01'),
      description:
        'Supporting engineering and product hiring with structured, candidate-friendly processes.',
    },
    education: {
      schoolName: 'University of Manchester',
      degree: EducationDegree.BACHELOR,
      startDate: new Date('2013-09-01'),
      endDate: new Date('2016-06-01'),
      description: 'Organizational psychology.',
      gradePoint: 3.7,
    },
  },
  {
    key: 'liam',
    email: 'liam.oconnor@example.com',
    role: ProfileRole.USER,
    preferredLocale: PreferredLocale.en,
    firstName: 'Liam',
    lastName: "O'Connor",
    headline: 'Platform Engineer · Cloud Infrastructure',
    bio: 'Making delivery pipelines boring, infrastructure observable, and on-call sustainable.',
    avatarUrl: 'https://i.pravatar.cc/300?img=53',
    coverUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600',
    website: 'https://example.com/liam',
    github: 'https://github.com/example',
    city: 'Dublin',
    country: 'Ireland',
    lat: 53.3498,
    lng: -6.2603,
    skills: ['Docker', 'Go', 'PostgreSQL', 'Git'],
    languages: [
      ['en', LanguageProficiency.NATIVE_OR_BILINGUAL],
      ['de', LanguageProficiency.ELEMENTARY],
    ] as const,
    experience: {
      title: 'Platform Engineer',
      companyName: 'Harbor Cloud',
      employmentType: EmploymentType.FULL_TIME,
      workplaceType: WorkplaceType.REMOTE,
      startDate: new Date('2021-02-01'),
      description:
        'Operating cloud infrastructure, deployment tooling, and service observability.',
    },
    education: {
      schoolName: 'Trinity College Dublin',
      degree: EducationDegree.BACHELOR,
      startDate: new Date('2011-09-01'),
      endDate: new Date('2015-05-01'),
      description: 'Computer engineering.',
      gradePoint: 3.6,
    },
  },
] as const;

type SeedUserKey = (typeof USER_FIXTURES)[number]['key'];

const POST_FIXTURES = [
  {
    id: '30000000-0000-4000-8000-000000000001',
    author: 'review',
    text: 'We just finished a reliability review of our feed architecture. The biggest win was not a new service—it was making ownership, failure modes, and observability explicit. #engineering #leadership #product',
    tags: ['engineering', 'leadership', 'product'],
    createdAt: new Date('2026-07-16T08:30:00Z'),
  },
  {
    id: '30000000-0000-4000-8000-000000000002',
    author: 'amir',
    text: 'A practical API performance checklist: measure p95 and p99, inspect query plans, cap fan-out, and make retries visible. Optimizing without a trace is just guessing. #backend #postgresql #observability',
    tags: ['backend', 'postgresql', 'observability'],
    createdAt: new Date('2026-07-16T10:15:00Z'),
  },
  {
    id: '30000000-0000-4000-8000-000000000003',
    author: 'sofia',
    text: 'Accessibility reviews are most useful before the UI is polished. Today our team tested keyboard flow and content hierarchy using only a rough prototype—and changed the product for the better. #designsystems #accessibility',
    tags: ['designsystems', 'accessibility'],
    createdAt: new Date('2026-07-16T12:00:00Z'),
    attachment: {
      url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200',
      fileName: 'design-workshop.jpg',
      mimeType: 'image/jpeg',
    },
  },
  {
    id: '30000000-0000-4000-8000-000000000004',
    author: 'daniel',
    text: 'An experiment result without its guardrail metrics is incomplete. Conversion moved +4.2%, but support contacts also increased. The useful question is not “did it win?” but “what did we learn?” #analytics #experimentation',
    tags: ['analytics', 'experimentation'],
    createdAt: new Date('2026-07-16T14:20:00Z'),
  },
  {
    id: '30000000-0000-4000-8000-000000000005',
    author: 'maya',
    text: 'A strong interview process tells candidates what good looks like, gives them enough context, and produces evidence—not vibes. Sharing our updated hiring rubric with the team today. #careers #hiring',
    tags: ['careers', 'hiring'],
    createdAt: new Date('2026-07-17T07:45:00Z'),
  },
  {
    id: '30000000-0000-4000-8000-000000000006',
    author: 'liam',
    text: 'This week we cut noisy alerts by 38%. Fewer alerts did not mean less coverage; it meant every page had an owner, a runbook, and a clear user impact. #devops #reliability #observability',
    tags: ['devops', 'reliability', 'observability'],
    createdAt: new Date('2026-07-17T09:10:00Z'),
  },
] as const;

function fixtureId(namespace: string, index: number): string {
  return `${namespace}-0000-4000-8000-${String(index).padStart(12, '0')}`;
}

function buildDirectKey(firstUserId: string, secondUserId: string): string {
  return [firstUserId, secondUserId].sort().join('_');
}

function generatePublicKey(): string {
  const { publicKey } = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
  });
  return publicKey.export({ type: 'spki', format: 'der' }).toString('base64');
}

async function seedCatalogs() {
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
}

async function seedUsers(passwordHash: string) {
  const users = new Map<SeedUserKey, { id: string; email: string }>();

  for (let index = 0; index < USER_FIXTURES.length; index += 1) {
    const fixture = USER_FIXTURES[index];
    const user = await prisma.user.upsert({
      where: { email: fixture.email },
      update: {
        passwordHash,
        role: fixture.role,
        preferredLocale: fixture.preferredLocale,
        firstName: fixture.firstName,
        lastName: fixture.lastName,
        headline: fixture.headline,
        bio: fixture.bio,
        avatarUrl: fixture.avatarUrl,
        coverUrl: fixture.coverUrl,
        website: fixture.website,
        github: fixture.github,
      },
      create: {
        id: fixtureId('10000000', index + 1),
        email: fixture.email,
        passwordHash,
        role: fixture.role,
        preferredLocale: fixture.preferredLocale,
        firstName: fixture.firstName,
        lastName: fixture.lastName,
        headline: fixture.headline,
        bio: fixture.bio,
        avatarUrl: fixture.avatarUrl,
        coverUrl: fixture.coverUrl,
        website: fixture.website,
        github: fixture.github,
      },
      select: { id: true, email: true },
    });
    users.set(fixture.key, user);

    await prisma.location.upsert({
      where: { userId: user.id },
      update: {
        label: `${fixture.city}, ${fixture.country}`,
        city: fixture.city,
        country: fixture.country,
        lat: fixture.lat,
        lng: fixture.lng,
      },
      create: {
        id: fixtureId('11000000', index + 1),
        userId: user.id,
        label: `${fixture.city}, ${fixture.country}`,
        city: fixture.city,
        country: fixture.country,
        lat: fixture.lat,
        lng: fixture.lng,
      },
    });

    await prisma.workExperience.upsert({
      where: { id: fixtureId('12000000', index + 1) },
      update: { userId: user.id, ...fixture.experience },
      create: {
        id: fixtureId('12000000', index + 1),
        userId: user.id,
        ...fixture.experience,
      },
    });

    const education = await prisma.education.upsert({
      where: { id: fixtureId('13000000', index + 1) },
      update: { userId: user.id, ...fixture.education },
      create: {
        id: fixtureId('13000000', index + 1),
        userId: user.id,
        ...fixture.education,
      },
    });

    for (const skillName of fixture.skills) {
      const skill = await prisma.skill.findUniqueOrThrow({
        where: { name: skillName },
        select: { id: true },
      });
      await prisma.userSkill.upsert({
        where: { userId_skillId: { userId: user.id, skillId: skill.id } },
        update: {},
        create: { userId: user.id, skillId: skill.id },
      });
      await prisma.educationSkill.upsert({
        where: {
          educationId_skillId: {
            educationId: education.id,
            skillId: skill.id,
          },
        },
        update: {},
        create: { educationId: education.id, skillId: skill.id },
      });
    }

    for (const [languageCode, proficiency] of fixture.languages) {
      const language = await prisma.language.findUniqueOrThrow({
        where: { code: languageCode },
        select: { id: true },
      });
      await prisma.userLanguage.upsert({
        where: {
          userId_languageId: {
            userId: user.id,
            languageId: language.id,
          },
        },
        update: { proficiency },
        create: {
          userId: user.id,
          languageId: language.id,
          proficiency,
        },
      });
    }
  }

  return users;
}

async function seedConnections(
  users: Map<SeedUserKey, { id: string; email: string }>,
) {
  const acceptedPairs: [SeedUserKey, SeedUserKey][] = [
    ['review', 'amir'],
    ['review', 'sofia'],
    ['review', 'daniel'],
    ['review', 'maya'],
    ['amir', 'liam'],
    ['sofia', 'maya'],
  ];

  for (let index = 0; index < acceptedPairs.length; index += 1) {
    const [requesterKey, addresseeKey] = acceptedPairs[index];
    const requesterId = users.get(requesterKey)!.id;
    const addresseeId = users.get(addresseeKey)!.id;
    await prisma.connection.upsert({
      where: { requesterId_addresseeId: { requesterId, addresseeId } },
      update: { status: ConnectionStatus.ACCEPTED },
      create: {
        id: fixtureId('20000000', index + 1),
        requesterId,
        addresseeId,
        status: ConnectionStatus.ACCEPTED,
      },
    });
  }

  const requesterId = users.get('liam')!.id;
  const addresseeId = users.get('review')!.id;
  await prisma.connection.upsert({
    where: { requesterId_addresseeId: { requesterId, addresseeId } },
    update: { status: ConnectionStatus.PENDING },
    create: {
      id: fixtureId('20000000', 99),
      requesterId,
      addresseeId,
      status: ConnectionStatus.PENDING,
    },
  });
}

async function seedPosts(
  users: Map<SeedUserKey, { id: string; email: string }>,
) {
  const allTags = [...new Set(POST_FIXTURES.flatMap((post) => post.tags))];
  for (let index = 0; index < allTags.length; index += 1) {
    await prisma.hashtag.upsert({
      where: { tag: allTags[index] },
      update: {},
      create: {
        id: fixtureId('31000000', index + 1),
        tag: allTags[index],
      },
    });
  }

  for (const post of POST_FIXTURES) {
    const hashtagConnections = post.tags.map((tag) => ({ tag }));
    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        authorId: users.get(post.author)!.id,
        textContent: post.text,
        createdAt: post.createdAt,
        hashtags: { set: hashtagConnections },
      },
      create: {
        id: post.id,
        authorId: users.get(post.author)!.id,
        textContent: post.text,
        createdAt: post.createdAt,
        hashtags: { connect: hashtagConnections },
      },
    });

    if ('attachment' in post) {
      await prisma.postAttachment.upsert({
        where: { id: fixtureId('32000000', 1) },
        update: { postId: post.id, ...post.attachment },
        create: {
          id: fixtureId('32000000', 1),
          postId: post.id,
          ...post.attachment,
        },
      });
    }
  }

  const reposts = [
    {
      id: fixtureId('33000000', 1),
      author: 'review' as SeedUserKey,
      originalId: POST_FIXTURES[1].id,
      text: 'This checklist is worth keeping. The reminder about visible retries is especially important.',
      createdAt: new Date('2026-07-17T10:00:00Z'),
    },
    {
      id: fixtureId('33000000', 2),
      author: 'maya' as SeedUserKey,
      originalId: POST_FIXTURES[0].id,
      text: null,
      createdAt: new Date('2026-07-17T10:30:00Z'),
    },
  ];
  for (const repost of reposts) {
    await prisma.post.upsert({
      where: { id: repost.id },
      update: {
        authorId: users.get(repost.author)!.id,
        repostOfId: repost.originalId,
        textContent: repost.text,
        createdAt: repost.createdAt,
      },
      create: {
        id: repost.id,
        authorId: users.get(repost.author)!.id,
        repostOfId: repost.originalId,
        textContent: repost.text,
        createdAt: repost.createdAt,
      },
    });
  }

  const comments = [
    ['amir', 0, 'Clear ownership made the biggest difference for us too.'],
    [
      'sofia',
      0,
      'Love that the review included product outcomes, not only uptime.',
    ],
    [
      'review',
      1,
      'The query-plan reminder saved us from adding unnecessary caching.',
    ],
    [
      'maya',
      2,
      'Early keyboard testing should be part of every discovery cycle.',
    ],
    ['liam', 5, 'Runbooks with user impact have also improved our handoffs.'],
  ] as const;
  for (let index = 0; index < comments.length; index += 1) {
    const [author, postIndex, textContent] = comments[index];
    const id = fixtureId('34000000', index + 1);
    await prisma.postComment.upsert({
      where: { id },
      update: {
        authorId: users.get(author)!.id,
        postId: POST_FIXTURES[postIndex].id,
        textContent,
      },
      create: {
        id,
        authorId: users.get(author)!.id,
        postId: POST_FIXTURES[postIndex].id,
        textContent,
      },
    });
  }

  const likes = [
    ['amir', 0, PostLikeType.SUPER],
    ['sofia', 0, PostLikeType.LIKE],
    ['daniel', 0, PostLikeType.INFORMATIVE],
    ['review', 1, PostLikeType.INFORMATIVE],
    ['liam', 1, PostLikeType.LIKE],
    ['review', 2, PostLikeType.SUPPORT],
    ['maya', 2, PostLikeType.SUPER],
    ['review', 3, PostLikeType.INFORMATIVE],
    ['amir', 5, PostLikeType.CONGRATULATIONS],
  ] as const;
  for (const [author, postIndex, likeType] of likes) {
    const postId = POST_FIXTURES[postIndex].id;
    const authorId = users.get(author)!.id;
    await prisma.postLike.upsert({
      where: { postId_authorId: { postId, authorId } },
      update: { likeType },
      create: { postId, authorId, likeType },
    });
  }

  const saves: [SeedUserKey, number][] = [
    ['review', 1],
    ['review', 3],
    ['amir', 2],
    ['maya', 0],
  ];
  for (const [userKey, postIndex] of saves) {
    const userId = users.get(userKey)!.id;
    const postId = POST_FIXTURES[postIndex].id;
    await prisma.savedPost.upsert({
      where: { userId_postId: { userId, postId } },
      update: {},
      create: { userId, postId },
    });
  }

  for (const post of POST_FIXTURES) {
    for (const [viewerKey, viewer] of users) {
      if (viewerKey === post.author) continue;
      await prisma.postImpression.upsert({
        where: {
          viewerId_postId: { viewerId: viewer.id, postId: post.id },
        },
        update: {},
        create: { viewerId: viewer.id, postId: post.id },
      });
    }
  }

  const seededPostIds = [
    ...POST_FIXTURES.map((post) => post.id),
    ...reposts.map((repost) => repost.id),
  ];
  for (const postId of seededPostIds) {
    const [likesCount, commentsCount, repostsCount, impressionsCount] =
      await Promise.all([
        prisma.postLike.count({ where: { postId } }),
        prisma.postComment.count({ where: { postId } }),
        prisma.post.count({ where: { repostOfId: postId } }),
        prisma.postImpression.count({ where: { postId } }),
      ]);
    await prisma.post.update({
      where: { id: postId },
      data: { likesCount, commentsCount, repostsCount, impressionsCount },
    });
  }

  for (const tag of allTags) {
    const postsCount = await prisma.post.count({
      where: { hashtags: { some: { tag } } },
    });
    await prisma.hashtag.update({ where: { tag }, data: { postsCount } });
  }
}

async function seedProfileViewsAndNotifications(
  users: Map<SeedUserKey, { id: string; email: string }>,
) {
  const reviewId = users.get('review')!.id;
  const viewers: SeedUserKey[] = ['amir', 'sofia', 'daniel', 'maya', 'liam'];
  for (let index = 0; index < viewers.length; index += 1) {
    const actorId = users.get(viewers[index])!.id;
    const viewedAt = new Date(
      `2026-07-17T${String(index + 7).padStart(2, '0')}:00:00Z`,
    );
    await prisma.profileView.upsert({
      where: {
        viewerId_profileId: { viewerId: actorId, profileId: reviewId },
      },
      update: { updatedAt: viewedAt },
      create: {
        id: fixtureId('40000000', index + 1),
        viewerId: actorId,
        profileId: reviewId,
        updatedAt: viewedAt,
      },
    });
    await prisma.notification.upsert({
      where: { id: fixtureId('41000000', index + 1) },
      update: {
        type: NotificationType.PROFILE_VIEW,
        recipientId: reviewId,
        actorId,
        read: index < 2,
      },
      create: {
        id: fixtureId('41000000', index + 1),
        type: NotificationType.PROFILE_VIEW,
        recipientId: reviewId,
        actorId,
        read: index < 2,
        createdAt: viewedAt,
      },
    });
  }

  const notificationFixtures = [
    {
      type: NotificationType.POST_LIKE,
      actor: 'amir' as SeedUserKey,
      postId: POST_FIXTURES[0].id,
    },
    {
      type: NotificationType.POST_COMMENT,
      actor: 'sofia' as SeedUserKey,
      postId: POST_FIXTURES[0].id,
    },
    {
      type: NotificationType.POST_REPOST,
      actor: 'maya' as SeedUserKey,
      postId: POST_FIXTURES[0].id,
    },
    {
      type: NotificationType.CONNECTION_REQUEST,
      actor: 'liam' as SeedUserKey,
      postId: null,
    },
    {
      type: NotificationType.CONNECTION_ACCEPTED,
      actor: 'maya' as SeedUserKey,
      postId: null,
    },
  ];
  for (let index = 0; index < notificationFixtures.length; index += 1) {
    const fixture = notificationFixtures[index];
    await prisma.notification.upsert({
      where: { id: fixtureId('42000000', index + 1) },
      update: {
        type: fixture.type,
        recipientId: reviewId,
        actorId: users.get(fixture.actor)!.id,
        postId: fixture.postId,
        read: false,
      },
      create: {
        id: fixtureId('42000000', index + 1),
        type: fixture.type,
        recipientId: reviewId,
        actorId: users.get(fixture.actor)!.id,
        postId: fixture.postId,
        read: false,
        createdAt: new Date(`2026-07-17T1${index}:15:00Z`),
      },
    });
  }
}

async function seedNews(
  users: Map<SeedUserKey, { id: string; email: string }>,
) {
  const stories = [
    {
      id: fixtureId('50000000', 1),
      title: 'Engineering teams invest in smaller, safer releases',
      summary:
        'New industry research links deployment confidence with clearer ownership and faster feedback.',
      body: [
        'Product engineering teams are moving away from large, scheduled releases in favor of smaller changes that can be verified quickly. The shift is less about deployment frequency itself and more about reducing the amount of uncertainty attached to each release.',
        'Teams reporting the strongest results combine small batches with explicit service ownership, observable user outcomes, and clear rollback paths. A release is considered complete only when the team can confirm how it affected reliability and the people using the product.',
        'Leaders are also changing how they review delivery performance. Instead of rewarding raw release counts, they are looking at recovery time, escaped defects, and whether teams can make changes during normal working hours without creating operational stress.',
      ].join('\n\n'),
      url: null,
      createdAt: new Date('2026-07-17T06:00:00Z'),
    },
    {
      id: fixtureId('50000000', 2),
      title: 'Design systems expand beyond component libraries',
      summary:
        'Teams are treating accessibility guidance and content patterns as first-class system assets.',
      body: [
        'Design systems are increasingly becoming shared product infrastructure rather than collections of reusable interface components. Mature teams now include accessibility guidance, content patterns, interaction principles, and decision records alongside visual primitives.',
        'This broader scope helps designers and engineers make consistent decisions without forcing every workflow into the same layout. The system provides constraints and tested patterns while leaving room for teams to solve domain-specific problems.',
        'Adoption still depends on contribution paths and ownership. Teams seeing sustained usage make it easy to propose improvements, document why patterns exist, and measure whether the system actually reduces duplicated work and accessibility regressions.',
      ].join('\n\n'),
      url: null,
      createdAt: new Date('2026-07-16T06:00:00Z'),
    },
    {
      id: fixtureId('50000000', 3),
      title: 'Career growth conversations move closer to daily work',
      summary:
        'Managers are replacing annual check-ins with frequent evidence-based development conversations.',
      body: [
        'More teams are replacing isolated annual reviews with shorter career conversations connected to ongoing work. The goal is to make growth expectations visible while there is still time to practice new skills and adjust responsibilities.',
        'Effective conversations use concrete examples: decisions the person influenced, systems they improved, colleagues they supported, and outcomes they helped create. This gives employees a clearer picture of progress than generic competency ratings.',
        'Managers are encouraged to separate development from promotion promises. A useful growth plan identifies the next capability to build, creates opportunities to demonstrate it, and schedules a follow-up where both sides can review evidence together.',
      ].join('\n\n'),
      url: null,
      createdAt: new Date('2026-07-15T06:00:00Z'),
    },
  ];

  for (const story of stories) {
    await prisma.newsStory.upsert({
      where: { id: story.id },
      update: {
        title: story.title,
        summary: story.summary,
        body: story.body,
        url: story.url,
        createdAt: story.createdAt,
      },
      create: story,
    });
  }

  const userIds = [...users.values()].map((user) => user.id);
  for (let storyIndex = 0; storyIndex < stories.length; storyIndex += 1) {
    const readers = userIds.slice(0, userIds.length - storyIndex);
    for (const userId of readers) {
      await prisma.newsStoryRead.upsert({
        where: {
          userId_storyId: { userId, storyId: stories[storyIndex].id },
        },
        update: {},
        create: { userId, storyId: stories[storyIndex].id },
      });
    }
    await prisma.newsStory.update({
      where: { id: stories[storyIndex].id },
      data: {
        readersCount: await prisma.newsStoryRead.count({
          where: { storyId: stories[storyIndex].id },
        }),
      },
    });
  }
}

async function seedConversations(
  users: Map<SeedUserKey, { id: string; email: string }>,
) {
  const deviceIds = new Map<SeedUserKey, string>();
  for (const [index, fixture] of USER_FIXTURES.entries()) {
    const userId = users.get(fixture.key)!.id;
    const publicKey = generatePublicKey();
    const device = await prisma.userDevice.upsert({
      where: {
        userId_deviceId: { userId, deviceId: `seed-${fixture.key}-web` },
      },
      update: {
        identityKeyPub: publicKey,
        signedPreKeyPub: publicKey,
        signedPreKeyId: 1,
        lastSeenAt: new Date('2026-07-17T10:00:00Z'),
      },
      create: {
        id: fixtureId('60000000', index + 1),
        userId,
        deviceId: `seed-${fixture.key}-web`,
        identityKeyPub: publicKey,
        signedPreKeyPub: publicKey,
        signedPreKeyId: 1,
        lastSeenAt: new Date('2026-07-17T10:00:00Z'),
      },
    });
    deviceIds.set(fixture.key, device.id);
  }

  const conversations = [
    {
      peer: 'amir' as SeedUserKey,
      messages: [
        [
          'amir',
          'Hi Elena! I added the query-plan notes to the architecture review.',
        ],
        [
          'review',
          'Great, thank you. I will share the final version this afternoon.',
        ],
        ['amir', 'Perfect. I also included the retry metrics we discussed.'],
      ] as const,
    },
    {
      peer: 'sofia' as SeedUserKey,
      messages: [
        [
          'review',
          'The accessibility findings from the prototype were excellent.',
        ],
        [
          'sofia',
          'Thanks! I will turn them into reusable design-system guidance.',
        ],
      ] as const,
    },
    {
      peer: 'maya' as SeedUserKey,
      messages: [
        [
          'maya',
          'I sent the updated interview rubric. Could you review the engineering section?',
        ],
        [
          'review',
          'Absolutely. I will leave comments before tomorrow morning.',
        ],
      ] as const,
    },
  ];

  const reviewId = users.get('review')!.id;
  for (
    let conversationIndex = 0;
    conversationIndex < conversations.length;
    conversationIndex += 1
  ) {
    const fixture = conversations[conversationIndex];
    const peerId = users.get(fixture.peer)!.id;
    const conversation = await prisma.conversation.upsert({
      where: { directKey: buildDirectKey(reviewId, peerId) },
      update: { updatedAt: new Date('2026-07-17T12:00:00Z') },
      create: {
        id: fixtureId('61000000', conversationIndex + 1),
        directKey: buildDirectKey(reviewId, peerId),
        updatedAt: new Date('2026-07-17T12:00:00Z'),
      },
    });

    for (const memberId of [reviewId, peerId]) {
      await prisma.conversationMember.upsert({
        where: {
          conversationId_userId: {
            conversationId: conversation.id,
            userId: memberId,
          },
        },
        update: {
          lastReadAt:
            memberId === reviewId
              ? new Date('2026-07-17T11:30:00Z')
              : new Date('2026-07-17T12:00:00Z'),
        },
        create: {
          conversationId: conversation.id,
          userId: memberId,
          lastReadAt:
            memberId === reviewId
              ? new Date('2026-07-17T11:30:00Z')
              : new Date('2026-07-17T12:00:00Z'),
        },
      });
    }

    for (
      let messageIndex = 0;
      messageIndex < fixture.messages.length;
      messageIndex += 1
    ) {
      const [senderKey, ciphertext] = fixture.messages[messageIndex];
      const senderId = users.get(senderKey)!.id;
      const messageId = fixtureId(
        `62${String(conversationIndex + 1).padStart(6, '0')}`,
        messageIndex + 1,
      );
      await prisma.message.upsert({
        where: { id: messageId },
        update: {
          conversationId: conversation.id,
          senderId,
          senderDeviceId: deviceIds.get(senderKey)!,
          ciphertext,
          nonce: LEGACY_MESSAGE_NONCE,
          createdAt: new Date(
            `2026-07-17T1${conversationIndex}:${String(
              10 + messageIndex * 8,
            ).padStart(2, '0')}:00Z`,
          ),
        },
        create: {
          id: messageId,
          conversationId: conversation.id,
          senderId,
          senderDeviceId: deviceIds.get(senderKey)!,
          ciphertext,
          nonce: LEGACY_MESSAGE_NONCE,
          createdAt: new Date(
            `2026-07-17T1${conversationIndex}:${String(
              10 + messageIndex * 8,
            ).padStart(2, '0')}:00Z`,
          ),
        },
      });

      if (messageIndex === 0) {
        await prisma.messageReaction.upsert({
          where: {
            messageId_userId: { messageId, userId: reviewId },
          },
          update: { emoji: conversationIndex === 0 ? '👍' : '❤️' },
          create: {
            messageId,
            userId: reviewId,
            emoji: conversationIndex === 0 ? '👍' : '❤️',
          },
        });
      }
    }
  }
}

async function main() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  await seedCatalogs();
  const users = await seedUsers(passwordHash);
  await seedConnections(users);
  await seedPosts(users);
  await seedProfileViewsAndNotifications(users);
  await seedNews(users);
  await seedConversations(users);

  console.log('Seed completed.');
  console.log(`Review account: review@example.com / ${SEED_PASSWORD}`);
  console.log(`Other demo accounts use the same password: ${SEED_PASSWORD}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
