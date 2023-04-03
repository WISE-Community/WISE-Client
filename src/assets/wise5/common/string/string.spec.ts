import {
  generateRandomKey,
  isValidJSONString,
  removeHTMLTags,
  trimToLength,
  wordWrap
} from './string';

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

describe('removeHTMLTags()', () => {
  it('should remove html tags', () => {
    expect(removeHTMLTags('<p><img src="computer.png"/></p>')).toEqual(' computer.png ');
  });

  it('should replace image tag with file name when it uses double quotes', () => {
    expect(removeHTMLTags('<img src="computer.png"/>')).toEqual('computer.png');
  });
  it('should replace image tag with file name when it uses single quotes', () => {
    expect(removeHTMLTags("<img src='computer.png'/>")).toEqual('computer.png');
  });
  it('should replace image tag with file name when there are other attributes', () => {
    expect(
      removeHTMLTags("<img alt='Computer' src='computer.png' aria-label='Computer'/>")
    ).toEqual('computer.png');
  });
});

describe('generateRandomKey()', () => {
  it('should return random keys of length 10 by default', () => {
    const key1 = generateRandomKey();
    const key2 = generateRandomKey();
    expect(key1.length).toEqual(10);
    expect(key2.length).toEqual(10);
    expect(key1).not.toEqual(key2);
  });

  it('should return random keys of specified length', () => {
    expect(generateRandomKey(5).length).toEqual(5);
    expect(generateRandomKey(23).length).toEqual(23);
  });

  it('should produce 100 unique random strings', () => {
    const keysSoFar = [];
    for (let i = 0; i < 100; i++) {
      const key = generateRandomKey();
      expect(keysSoFar.includes(key)).toEqual(false);
      keysSoFar.push(key);
    }
  });
});
