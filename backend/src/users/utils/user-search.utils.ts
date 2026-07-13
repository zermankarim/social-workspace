import { Prisma } from '@prisma/client';

export function buildUserSearchWhere(q: string): Prisma.UserWhereInput {
  const parts = q.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    const [first, ...rest] = parts;
    const last = rest.join(' ');
    return {
      AND: [
        { firstName: { contains: first, mode: 'insensitive' } },
        { lastName: { contains: last, mode: 'insensitive' } },
      ],
    };
  }

  return {
    OR: [
      { firstName: { contains: q, mode: 'insensitive' } },
      { lastName: { contains: q, mode: 'insensitive' } },
    ],
  };
}
