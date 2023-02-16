import { isValidJSONString } from './string';

describe('isValidJSONString()', () => {
  it('should return true if json string is valid', () => {
    const validJSON = '{"a":1,"b":2}';
    expect(isValidJSONString(validJSON)).toBeTruthy();
    const validJSON2 = '[{"a":1},{"b":2}]';
    expect(isValidJSONString(validJSON2)).toBeTruthy();
  });

  it('should return false for invalid json strings', () => {
    const invalidJSON = '{"a":1,"b":2';
    expect(isValidJSONString(invalidJSON)).toBeFalsy();
  });
});
