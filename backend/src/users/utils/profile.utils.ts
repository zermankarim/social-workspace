import { BadRequestException } from '@nestjs/common';

export function assertDateRange(
  startDate: Date | string,
  endDate: Date | string | null | undefined,
): void {
  if (endDate == null) {
    return;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new BadRequestException('Invalid date');
  }
  if (end < start) {
    throw new BadRequestException('endDate must be on or after startDate');
  }
}

export function normalizeSkillName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}
