export function convertToPNGFile(canvas: HTMLCanvasElement): File {
  const img_b64 = canvas.toDataURL('image/png');
  const blob = dataURItoBlob(img_b64);
  const now = new Date().getTime();
  const filename = encodeURIComponent('picture_' + now + '.png');
  return new File([blob], filename, {
    lastModified: now, // optional - default = now
    type: 'image/png' // optional - default = ''
  });
}

/**
 * Convert base64/URLEncoded data component to raw binary data held in a string
 * @param dataURI base64/URLEncoded data
 * @returns a Blob object
 */
function dataURItoBlob(dataURI: string): Blob {
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
  else byteString = unescape(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
}
