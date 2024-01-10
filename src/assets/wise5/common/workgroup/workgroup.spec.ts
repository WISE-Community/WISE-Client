import { getAvatarColorForWorkgroupId } from './workgroup';

describe('getAvatarColorForWorkgroupId()', () => {
  it('should return #E91E63 when workgroup id is 1000', () => {
    expect(getAvatarColorForWorkgroupId(10000)).toEqual('#E91E63');
  });
  it('should return #C62828 when workgroup id is 10008', () => {
    expect(getAvatarColorForWorkgroupId(10008)).toEqual('#C62828');
  });
});
