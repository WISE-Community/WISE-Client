const imageExtensionsRegEx = new RegExp('.*.(png|jpg|jpeg|bmp|gif|tiff|svg|webp)$');
const videoExtensionsRegEx = new RegExp('.*.(mp4|mpg|mpeg|m4v|m2v|avi|gifv|mov|qt|webm)$');
const audioExtensionsRegEx = new RegExp('.*.(aiff|mp3|flac|m4a|m4p|ogg|wav|webm)$');

export function isImage(fileName: string): boolean {
  return isFileTypeMatch(fileName, imageExtensionsRegEx);
}

export function isVideo(fileName: string): boolean {
  return isFileTypeMatch(fileName, videoExtensionsRegEx);
}

export function isAudio(fileName: string): boolean {
  return isFileTypeMatch(fileName, audioExtensionsRegEx);
}

function isFileTypeMatch(fileName: string, extensionsRegex: RegExp): boolean {
  return fileName.toLowerCase().match(extensionsRegex) != null;
}
