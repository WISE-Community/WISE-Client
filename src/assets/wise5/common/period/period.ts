export function isMatchingPeriods(periodId1: number, periodId2: number): boolean {
  return isAllPeriods(periodId1) || isAllPeriods(periodId2) || periodId1 == periodId2;
}

function isAllPeriods(periodId: number): boolean {
  return periodId == null || periodId === -1;
}
