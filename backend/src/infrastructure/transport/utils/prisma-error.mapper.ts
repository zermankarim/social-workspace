import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type MappedError = {
  statusCode: number;
  message: string;
};

export function mapPrismaError(
  error: Prisma.PrismaClientKnownRequestError,
): MappedError | null {
  switch (error.code) {
    case 'P2002': {
      const target = (error.meta?.target as string[] | undefined)?.join(', ');
      return {
        statusCode: HttpStatus.CONFLICT,
        message: target
          ? `Already exists: ${target}`
          : 'Resource already exists',
      };
    }
    case 'P2025':
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found',
      };
    default:
      return null;
  }
}
