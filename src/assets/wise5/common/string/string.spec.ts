import { isValidJSONString, trimToLength, wordWrap } from './string';

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

describe('trimToLength()', () => {
  it('should keep string intact if its length is equal to or less than max length', () => {
    expect(trimToLength('123456789', 9)).toEqual('123456789');
    expect(trimToLength('123456789', 10)).toEqual('123456789');
  });
  it('should trim string and add ellipses if length is longer than max length', () => {
    expect(trimToLength('123456789', 7)).toEqual('1234...');
  });
});
