export class RandomKeyService {
  static CHARS = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ];

  static generate(length = 10): string {
    let key = '';
    const numChars = RandomKeyService.CHARS.length;
    for (let i = 0; i < length; i++) {
      key += RandomKeyService.CHARS[Math.floor(Math.random() * (numChars - 1))];
    }
    return key;
  }
}
