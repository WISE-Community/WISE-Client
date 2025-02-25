import { Injectable } from '@angular/core';
import Color from 'colorjs.io';

@Injectable()
export class ColorService {
  getContrastColor(color: string): string {
    const colorObj = new Color(color);
    return colorObj.contrast('#FFFFFF', 'WCAG21') < 4.5 ? '#000000' : '#FFFFFF';
  }
}
