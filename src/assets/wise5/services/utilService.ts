'use strict';

import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { copy } from '../common/object/object';
import '../lib/jquery/jquery-global';

@Injectable()
export class UtilService {
  constructor(@Inject(LOCALE_ID) private localeID: string) {}

  convertStringToNumber(str) {
    if (str != null && str != '' && !isNaN(Number(str))) {
      return Number(str);
    }
    return str;
  }

  isImage(fileName: string): boolean {
    const imageExtensionsRegEx = new RegExp('.*.(png|jpg|jpeg|bmp|gif|tiff|svg|webp)');
    return fileName.toLowerCase().match(imageExtensionsRegEx) != null;
  }

  isVideo(fileName: string): boolean {
    const videoExtensionsRegEx = new RegExp('.*.(mp4|mpg|mpeg|m4v|m2v|avi|gifv|mov|qt|webm)');
    return fileName.toLowerCase().match(videoExtensionsRegEx) != null;
  }

  isAudio(fileName: string): boolean {
    const videoExtensionsRegEx = new RegExp('.*.(mp3|flac|m4a|ogg|wav|webm)');
    return fileName.toLowerCase().match(videoExtensionsRegEx) != null;
  }

  replaceDivReference(html: string, newString: string): string {
    return html.replace(
      /document\.getElementById\('replace-with-unique-id'\)/g,
      `document.getElementById('${newString}')`
    );
  }

  /**
   * Remove html tags and newlines from the string.
   * @param html an html string
   * @return text without html tags and new lines
   */
  removeHTMLTags(html = '') {
    let text = this.replaceImgTagWithFileName(html);
    text = text.replace(/<\/?[^>]+(>|$)/g, ' ');
    return this.removeNewLines(text);
  }

  removeNewLines(html = '') {
    let text = html.replace(/\n/g, ' ');
    return text.replace(/\r/g, ' ');
  }

  /**
   * Replace img tags with the src value.
   * Example: <img src="computer.png"/> will be replaced with computer.png.
   */
  replaceImgTagWithFileName(html = '') {
    return html.replace(/<img.*?src=["'](.*?)["'].*?>/g, '$1');
  }

  /**
   * Check if a string ends with a specific string
   * @param subjectString the main string
   * @param searchString the potential end of the string
   * @param position (optional) the position to start searching
   * @return whether the subjectString ends with the searchString
   */
  endsWith(subjectString: string, searchString: string, position?: number) {
    if (
      typeof position !== 'number' ||
      !isFinite(position) ||
      Math.floor(position) !== position ||
      position > subjectString.length
    ) {
      position = subjectString.length;
    }
    position -= searchString.length;
    const lastIndex = subjectString.lastIndexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  }

  /**
   * Sort the objects by server save time
   * @param object1 an object
   * @param object2 an object
   * @return -1 if object1 server save time comes before object2 server save time
   * 1 if object1 server save time comes after object2 server save time
   * 0 if object1 server save time is equal to object2 server save time
   */
  sortByServerSaveTime(object1, object2) {
    if (object1.serverSaveTime < object2.serverSaveTime) {
      return -1;
    } else if (object1.serverSaveTime > object2.serverSaveTime) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Convert milliseconds since the epoch to a pretty printed date time
   * @param milliseconds the milliseconds since the epoch
   * @return a string containing the pretty printed date time
   * example
   * Wed Apr 06 2016 9:05:38 AM
   */
  convertMillisecondsToFormattedDateTime(milliseconds) {
    const date = new Date(milliseconds);
    if (date != null) {
      return date.toDateString() + ' ' + date.toLocaleTimeString();
    }
    return '';
  }

  /**
   * Check if two arrays contain the same values. This is commonly used to
   * check if two arrays of ids contain the same values. The order of the
   * elements is not compared, only the actual values. This means the elements
   * can be in different orders but still contain the same values.
   * Example:
   * array1=['1234567890', 'abcdefghij']
   * array2=['abcdefghij', '1234567890']
   * If these two arrays are passed in as the two arguments, this function
   * will return true.
   * Note: This may only work if the elements are strings, numbers or
   * booleans. If the elements are objects, this function may or may not work.
   * @param array1 an array of strings, numbers, or booleans
   * @param array2 an array of strings, numbers, or booleans
   * @return whether the arrays contain the same values
   */
  arraysContainSameValues(array1, array2): boolean {
    const array1Copy = copy(array1);
    array1Copy.sort();
    const array2Copy = copy(array2);
    array2Copy.sort();
    return JSON.stringify(array1Copy) == JSON.stringify(array2Copy);
  }

  /**
   * Check if an array has any non null elements.
   * @param arrayToCheck An array which may have null and non null elements.
   * @return True if the array has at least one non null element.
   * False if the array has all null elements.
   */
  arrayHasNonNullElement(arrayToCheck) {
    for (let element of arrayToCheck) {
      if (element != null) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the number of words in the string.
   * @param str The string.
   * @return The number of words in the string.
   */
  wordCount(str) {
    return str.trim().split(/\s+/).length;
  }

  trimToLength(str: string, maxLength: number): string {
    return str.length > maxLength ? `${str.substring(0, maxLength - 3)}...` : str;
  }

  /**
   * Determine whether the component has been authored to import work.
   * @param componentContent The component content.
   * @return Whether to import work in this component.
   */
  hasImportWorkConnectedComponent(componentContent) {
    return this.hasXConnectedComponent(componentContent, 'importWork');
  }

  /**
   * Determine whether the component has been authored to show work.
   * @param componentContent The component content.
   * @return Whether to show work in this component.
   */
  hasShowWorkConnectedComponent(componentContent) {
    return this.hasXConnectedComponent(componentContent, 'showWork');
  }

  /**
   * Determine whether the component has a connected component of the given type.
   * @param componentContent The component content.
   * @param connectedComponentType The connected component type.
   * @return Whether the component has a connected component of the given type.
   */
  hasXConnectedComponent(componentContent, connectedComponentType) {
    if (componentContent.connectedComponents != null) {
      let connectedComponents = componentContent.connectedComponents;
      for (let connectedComponent of connectedComponents) {
        if (connectedComponent.type == connectedComponentType) {
          return true;
        }
      }
    }
    return false;
  }

  calculateMean(values) {
    return values.reduce((a, b) => a + b) / values.length;
  }

  greaterThanEqualTo(a: number, b: number): boolean {
    return a >= b;
  }

  greaterThan(a: number, b: number): boolean {
    return a > b;
  }

  lessThanEqualTo(a: number, b: number): boolean {
    return a <= b;
  }

  lessThan(a: number, b: number): boolean {
    return a < b;
  }

  equalTo(a: number, b: number): boolean {
    return a === b;
  }

  notEqualTo(a: number, b: number): boolean {
    return a !== b;
  }

  getSavedMessage(clientSaveTime: number, showFullDate: boolean = false): string {
    let saveTimeText = this.getSaveTimeText(clientSaveTime, showFullDate);
    return $localize`Saved ${saveTimeText}:saveTime:`;
  }

  getAutoSavedMessage(clientSaveTime: number, showFullDate: boolean = false): string {
    let saveTimeText = this.getSaveTimeText(clientSaveTime, showFullDate);
    return $localize`Auto Saved ${saveTimeText}:saveTime:`;
  }

  getSubmittedMessage(clientSaveTime: number, showFullDate: boolean = false): string {
    let saveTimeText = this.getSaveTimeText(clientSaveTime, showFullDate);
    return $localize`Submitted ${saveTimeText}:saveTime:`;
  }

  getSaveTimeMessage(clientSaveTime: number, showFullDate: boolean = false): string {
    return this.getSaveTimeText(clientSaveTime, showFullDate);
  }

  getSaveTimeText(saveTime: number, showFullDate: boolean = false): string {
    const now = new Date();
    let saveTimeText = '';
    if (showFullDate) {
      saveTimeText = `${formatDate(saveTime, 'fullDate', this.localeID)} • ${formatDate(
        saveTime,
        'shortTime',
        this.localeID
      )}`;
    } else if (this.isSameDay(now, saveTime)) {
      saveTimeText = formatDate(saveTime, 'shortTime', this.localeID);
    } else {
      saveTimeText = formatDate(saveTime, 'mediumDate', this.localeID);
    }
    return saveTimeText;
  }

  private isSameDay(a: string | number | Date, b: string | number | Date): boolean {
    return formatDate(a, 'shortDate', this.localeID) === formatDate(b, 'shortDate', this.localeID);
  }
}

declare global {
  interface Array<T> {
    last(): T;
  }
}
// extend array prototype with a last() method
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}
