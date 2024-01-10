import { isMatchingPeriods } from './period';

describe('isMatchingPeriods', () => {
  firstPeriodIsAll();
  secondPeriodIsAll();
  periodsAreTheSame();
  periodsAreDifferent();
});

function firstPeriodIsAll(): void {
  it('should check if period matches when first period is all periods', () => {
    expectIsMatchingPeriods(-1, 1, true);
  });
}

function secondPeriodIsAll(): void {
  it('should check if period matches when second period is all periods', () => {
    expectIsMatchingPeriods(1, -1, true);
  });
}

function periodsAreTheSame(): void {
  it('should check if period matches when periods are the same', () => {
    expectIsMatchingPeriods(1, 1, true);
  });
}

function periodsAreDifferent(): void {
  it('should check if period matches when periods are different', () => {
    expectIsMatchingPeriods(1, 2, false);
  });
}

function expectIsMatchingPeriods(
  periodId1: number,
  periodId2: number,
  expectedResult: boolean
): void {
  expect(isMatchingPeriods(periodId1, periodId2)).toEqual(expectedResult);
}
