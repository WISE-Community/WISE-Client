export function isValidJSONString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Takes a string and breaks it up into multiple lines so that the length of
 * each line does not exceed a certain number of characters. This code was
 * found on stackoverflow.
 * https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
 * @param str The string to break up.
 * @param maxWidth The max width of a line.
 * @return A string that has been broken up into multiple lines using \n.
 */
export function wordWrap(str, maxWidth) {
  if (str.length <= maxWidth) {
    return str;
  }
  let newLineStr = '\n';
  let done = false;
  let res = '';
  do {
    let found = false;
    // Inserts new line at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('');
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join('');
      str = str.slice(maxWidth);
    }

    if (str.length < maxWidth) done = true;
  } while (!done);

  return res + str;
}

/**
 * Helper function for wordWrap().
 * @param x A single character string.
 * @return Whether the single character is a whitespace character.
 */
function testWhite(x) {
  let white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}

export function trimToLength(str: string, maxLength: number): string {
  return str.length > maxLength ? `${str.substring(0, maxLength - 3)}...` : str;
}

/**
 * Remove html tags and newlines from the string.
 * @param html an html string
 * @return text without html tags and new lines
 */
export function removeHTMLTags(html: string = '') {
  let text = replaceImgTagWithFileName(html);
  text = text.replace(/<\/?[^>]+(>|$)/g, ' ');
  return removeNewLines(text);
}

function removeNewLines(html: string = '') {
  let text = html.replace(/\n/g, ' ');
  return text.replace(/\r/g, ' ');
}

function replaceImgTagWithFileName(html: string = '') {
  return html.replace(/<img.*?src=["'](.*?)["'].*?>/g, '$1');
}

const CHARS = [
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

export function generateRandomKey(length: number = 10): string {
  let key = '';
  const numChars = CHARS.length;
  for (let i = 0; i < length; i++) {
    key += CHARS[Math.floor(Math.random() * (numChars - 1))];
  }
  return key;
}