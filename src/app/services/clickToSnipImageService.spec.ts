import { TestBed } from '@angular/core/testing';
import { ClickToSnipImageService } from '../../assets/wise5/services/clickToSnipImageService';

let service: ClickToSnipImageService;
describe('ClickToSnipImageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClickToSnipImageService]
    });
    service = TestBed.inject(ClickToSnipImageService);
  });
  injectClickToSnipImageListener();
});

function injectClickToSnipImageListener() {
  describe('injectClickToSnipImageListener()', () => {
    it('should not alter content when there is no <img> element', () => {
      const content = { text: 'no image' };
      expect(service.injectClickToSnipImageListener(content)).toEqual(content);
    });
    it('should inject code to snip image when there is <img> element', () => {
      expect(service.injectClickToSnipImageListener({ text: '<img src="abc.png">' })).toEqual({
        text:
          "<img onclick=\"window.dispatchEvent(new CustomEvent('snip-image', " +
          '{ detail: { target: this } }))" onkeypress="javascript: if ' +
          "(event.key === 'Enter' || event.keyCode === 13 || event.which === 13 ) { " +
          "window.dispatchEvent(new CustomEvent('snip-image', { detail: { target: this } } )) " +
          '}" aria-label="Select image to add to notebook" title="Add to notebook" tabindex="0" ' +
          'snip src="abc.png">'
      });
    });
  });
}
