import { isAudio, isImage, isVideo } from './file';

describe('isImage()', () => {
  it('should return true if string ends in an image extension type', () => {
    const filename = 'image.jpg';
    expect(isImage(filename)).toBeTruthy();
  });
  it('should return false if string does not end in an image extension type', () => {
    const filename = 'image.jpg.bak';
    expect(isImage(filename)).toBeFalsy();
  });
});

describe('isVideo()', () => {
  it('should return true if string ends in a video extension type', () => {
    const filename = 'video.mp4';
    expect(isVideo(filename)).toBeTruthy();
  });
  it('should return false if string does not end in a video extension type', () => {
    const filename = 'video.mp4.bak';
    expect(isVideo(filename)).toBeFalsy();
  });
});
describe('isAudio()', () => {
  it('should return true if string ends in an audio extension type', () => {
    const filename = 'audio.mp3';
    expect(isAudio(filename)).toBeTruthy();
  });
  it('should return false if string does not end in an audio extension type', () => {
    const filename = 'audio.mp3.bak';
    expect(isAudio(filename)).toBeFalsy();
  });
});
