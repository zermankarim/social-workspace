export function buildDirectKey(userAId: string, userBId: string): string {
  return [userAId, userBId].sort().join('_');
}
