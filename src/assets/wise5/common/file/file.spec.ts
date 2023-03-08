import { isAudio, isImage, isVideo } from './file';

describe('isImage()', () => {
  it('should return true if string ends in an image extension type', () => {
    expect(isImage('image.jpg')).toBeTruthy();
  });
  it('should return false if string does not end in an image extension type', () => {
    expect(isImage('image.jpg.bak')).toBeFalsy();
  });
});

describe('isVideo()', () => {
  it('should return true if string ends in a video extension type', () => {
    expect(isVideo('video.mp4')).toBeTruthy();
  });
  it('should return false if string does not end in a video extension type', () => {
    expect(isVideo('video.mp4.bak')).toBeFalsy();
  });
});
describe('isAudio()', () => {
  it('should return true if string ends in an audio extension type', () => {
    expect(isAudio('audio.mp3')).toBeTruthy();
  });
  it('should return false if string does not end in an audio extension type', () => {
    expect(isAudio('audio.mp3.bak')).toBeFalsy();
  });
});
