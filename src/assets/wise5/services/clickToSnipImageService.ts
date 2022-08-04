import { Injectable } from '@angular/core';

@Injectable()
export class ClickToSnipImageService {
  /**
   * Inject the ng-click attribute that will call the snipImage function
   * @param content the content
   * @returns the modified content
   */
  injectClickToSnipImageListener(content: any): any {
    let contentString = JSON.stringify(content);
    const imgMatcher = new RegExp('<img.*?src=\\\\?[\'"](.*?)\\\\?[\'"].*?>', 'gi');
    contentString = contentString.replace(imgMatcher, (matchedString: string) => {
      return matchedString.replace(
        '<img',
        `<img onclick=\\"window.dispatchEvent(new CustomEvent('snip-image', ` +
          `{ detail: { target: this } }))\\" ` +
          `onkeypress=\\"javascript: if (event.key === 'Enter' || event.keyCode === 13 || ` +
          `event.which === 13 ) { window.dispatchEvent(new CustomEvent('snip-image', ` +
          `{ detail: { target: this } } )) }\\" aria-label=\\"Select image to add to notebook\\" ` +
          `title=\\"Add to notebook\\" tabindex=\\"0\\" snip`
      );
    });
    return JSON.parse(contentString);
  }
}
