import { isValidJSONString, wordWrap } from './string';

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

describe('wordWrap()', () => {
  it('should break string into multiple lines', () => {
    const string = 'A string with more than 20 characters.';
    expect(wordWrap(string, 20)).toEqual('A string with more\nthan 20 characters.');
  });

  it('should not break string into multiple lines if string is same length or shorter than the wrap limit', () => {
    const string = 'A short string.';
    expect(wordWrap(string, 20)).toEqual('A short string.');
  });
});
