import { title } from 'process';
import { Run, sortByRunStartTimeDesc } from './run';

describe('Run', () => {
  const run = new Run({
    startTime: new Date('2019-03-21').getTime()
  });
  const beforeStartTime = new Date('2019-03-20').getTime();
  const betweenStartAndEndTimes = new Date('2019-03-22').getTime();
  const endTime = new Date('2019-03-23').getTime();
  const afterEndTime = new Date('2019-03-24').getTime();

  function expectRun(func, timeNow, expectedValue) {
    expect(run[func](timeNow)).toEqual(expectedValue);
  }

  it('should calculate active', () => {
    expectRun('isActive', beforeStartTime, false);
    expectRun('isActive', betweenStartAndEndTimes, true);
    run.endTime = endTime;
    expectRun('isActive', beforeStartTime, false);
    expectRun('isActive', betweenStartAndEndTimes, true);
    expectRun('isActive', afterEndTime, false);
  });

  it('should calculate completed', () => {
    expect(run.isCompleted(betweenStartAndEndTimes)).toBeFalsy();
    run.endTime = endTime;
    expectRun('isCompleted', beforeStartTime, false);
    expectRun('isCompleted', betweenStartAndEndTimes, false);
    expectRun('isCompleted', afterEndTime, true);
  });

  it('should calculate scheduled', () => {
    expectRun('isScheduled', beforeStartTime, true);
    expectRun('isScheduled', betweenStartAndEndTimes, false);
  });

  describe('sortByStartTimeDesc()', () => {
    let runList: Run[];
    const run2 = new Run({
      startTime: endTime
    });
    const run3 = new Run({
      startTime: afterEndTime
    });
    beforeEach(() => {
      runList = [run2, run3, run];
      runList.sort(sortByRunStartTimeDesc);
    });
    it('should sort runs by start date', async () => {
      expect(runList).toEqual([run3, run2, run]);
    });
  });
});
