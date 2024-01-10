import { millisecondsToDateTime } from './datetime';

describe('millisecondsToDateTime()', () => {
  it('should convert milliseconds to formatted date/time string', () => {
    expect(millisecondsToDateTime(1682115840000)).toEqual('Fri Apr 21 2023 10:24:00 PM');
    expect(millisecondsToDateTime(-1682115840000)).toEqual('Tue Sep 12 1916 1:36:00 AM');
  });
});
