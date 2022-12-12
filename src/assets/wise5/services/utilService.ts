'use strict';

import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
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

  makeCopyOfJSONObject(jsonObject: any): any {
    return this.isUndefined(jsonObject) ? undefined : JSON.parse(JSON.stringify(jsonObject));
  }

  private isUndefined(value: any): boolean {
    return typeof value === 'undefined';
  }

  getImageObjectFromBase64String(img_b64) {
    const blob = this.dataURItoBlob(img_b64);
    const now = new Date().getTime();
    const filename = encodeURIComponent('picture_' + now + '.png');
    const pngFile = new File([blob], filename, {
      lastModified: now, // optional - default = now
      type: 'image/png' // optional - default = ''
    });
    return pngFile;
  }

  /**
   * Convert base64/URLEncoded data component to raw binary data held in a string
   * @param dataURI base64/URLEncoded data
   * @returns a Blob object
   */
  dataURItoBlob(dataURI) {
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

  /**
   * Get an image object from an image element
   * @param imageElement an image element (<img src='abc.jpg'/>)
   * @returns an image object
   */
  getImageObjectFromImageElement(imageElement: any): any {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return this.getImageObjectFromBase64String(dataURL);
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

  /**
   * Replace <a> and <button> elements with <wiselink> elements
   * @param html the html
   * @return the modified html with <wiselink> elements
   */
  insertWISELinks(html) {
    html = this.insertWISELinkAnchors(html);
    html = this.insertWISELinkButtons(html);
    return html;
  }

  /**
   * Replace <a> elements that have the parameter wiselink=true with
   * <wiselink> elements
   * @param html the html
   * @return the modified html with certain <a> elements replaced with
   * <wiselink> elements
   */
  insertWISELinkAnchors(html) {
    let wiseLinkRegEx = new RegExp(/<a.*?wiselink="true".*?>(.*?)<\/a>/);
    let wiseLinkRegExMatchResult = wiseLinkRegEx.exec(html);
    while (wiseLinkRegExMatchResult != null) {
      let anchorHTML = wiseLinkRegExMatchResult[0];
      let anchorText = wiseLinkRegExMatchResult[1];
      let nodeId = this.getWISELinkNodeId(anchorHTML);
      if (nodeId == null) {
        nodeId = '';
      }
      let componentIdAttr = '';
      let componentId = this.getWISELinkComponentId(anchorHTML);
      if (componentId != null) {
        componentIdAttr = "component-id='" + componentId + "'";
      }
      let wiselinkHtml =
        "<wiselink type='link' link-text='" +
        anchorText +
        "' node-id='" +
        nodeId +
        "' " +
        componentIdAttr +
        '/>';
      html = html.replace(wiseLinkRegExMatchResult[0], wiselinkHtml);
      wiseLinkRegExMatchResult = wiseLinkRegEx.exec(html);
    }
    return html;
  }

  /**
   * Replace <button> elements that have the parameter wiselink=true
   * with <wiselink> elements
   * @param html the html
   * @return the modified html with certain <button> elements replaced with
   * <wiselink> elements
   */
  insertWISELinkButtons(html) {
    const wiseLinkRegEx = new RegExp(/<button.*?wiselink="true".*?>(.*?)<\/button>/);
    let wiseLinkRegExMatchResult = wiseLinkRegEx.exec(html);
    while (wiseLinkRegExMatchResult != null) {
      const buttonHTML = wiseLinkRegExMatchResult[0];
      const buttonText = wiseLinkRegExMatchResult[1];
      let nodeId = this.getWISELinkNodeId(buttonHTML);
      if (nodeId == null) {
        nodeId = '';
      }
      let componentIdAttr = '';
      let componentId = this.getWISELinkComponentId(buttonHTML);
      if (componentId != null) {
        componentIdAttr = "component-id='" + componentId + "'";
      }
      const wiselinkHtml =
        "<wiselink type='button' link-text='" +
        buttonText +
        "' node-id='" +
        nodeId +
        "' " +
        componentIdAttr +
        '/>';
      html = html.replace(wiseLinkRegExMatchResult[0], wiselinkHtml);
      wiseLinkRegExMatchResult = wiseLinkRegEx.exec(html);
    }
    return html;
  }

  /**
   * Get the node id from the wiselink element
   * e.g. for input <wiselink node-id='node5'/>, returns 'node5'
   * @param html the html for the element
   * @return the node id from the node id parameter in the element
   */
  getWISELinkNodeId(html = '') {
    let nodeIdRegEx = new RegExp(/node-id=["'b](.*?)["']/, 'g');
    let nodeIdRegExResult = nodeIdRegEx.exec(html);
    if (nodeIdRegExResult != null) {
      return nodeIdRegExResult[1];
    }
    return '';
  }

  /**
   * Get the component id from the wiselink element
   * e.g. for input <wiselink node-id='node5' component-id='xyzabc' /> returns 'xyzabc'
   * @param html the html for the element
   * @return the component id from the component id parameter in the element
   */
  getWISELinkComponentId(html = '') {
    let componentIdRegEx = new RegExp(/component-id=["'b](.*?)["']/, 'g');
    let componentIdRegExResult = componentIdRegEx.exec(html);
    if (componentIdRegExResult != null) {
      return componentIdRegExResult[1];
    }
    return '';
  }

  /**
   * Get the link type from the wiselink element
   * e.g. for input <wiselink type='button'/> return 'button'
   * @param html the html for the element
   * @return the link type from the type parameter in the element
   */
  getWISELinkType(html = '') {
    let typeRegEx = new RegExp(/type=["'b](.*?)["']/, 'g');
    let typeRegExResult = typeRegEx.exec(html);
    if (typeRegExResult != null) {
      return typeRegExResult[1];
    }
    return null;
  }

  /**
   * Get the link text from the wiselink element
   * e.g. for input <wiselink link-text='Go to here'/> return 'Go to here'
   * @param html the html for the element
   * @return the link text from the link text parameter in the element
   */
  getWISELinkLinkText(html = '') {
    let linkTextRegEx = new RegExp(/link-text=["'b](.*?)["']/, 'g');
    let linkTextRegExResult = linkTextRegEx.exec(html);
    if (linkTextRegExResult != null) {
      return linkTextRegExResult[1];
    }
    return null;
  }

  /**
   * Replace <wiselink> elements with <a> and <button> elements
   * @param html the html
   * @return the modified html without <wiselink> elements
   */
  replaceWISELinks(html) {
    html = this.replaceWISELinksHelper(html, '<wiselink.*?/>');
    html = this.replaceWISELinksHelper(html, '<wiselink.*?>.*?</wiselink>');
    return html;
  }

  replaceWISELinksHelper(html: string, regex: string): string {
    const wiseLinkRegEx = new RegExp(regex);
    let wiseLinkRegExMatchResult = wiseLinkRegEx.exec(html);
    while (wiseLinkRegExMatchResult != null) {
      const wiseLinkHTML = wiseLinkRegExMatchResult[0];
      const nodeId = this.getWISELinkNodeId(wiseLinkHTML);
      const componentId = this.getWISELinkComponentId(wiseLinkHTML);
      const type = this.getWISELinkType(wiseLinkHTML);
      const linkText = this.getWISELinkLinkText(wiseLinkHTML);
      let newElement = '';
      const onclickString = `document.getElementById('replace-with-unique-id').dispatchEvent(new CustomEvent('wiselinkclicked', { detail: { nodeId: '${nodeId}', componentId: '${componentId}' } })); return false;`;
      if (type === 'button') {
        newElement = `<button wiselink="true" onclick="${onclickString}">${linkText}</button>`;
      } else {
        newElement = `<a wiselink="true" onclick="${onclickString}">${linkText}</a>`;
      }
      html = html.replace(wiseLinkHTML, newElement);
      wiseLinkRegExMatchResult = wiseLinkRegEx.exec(html);
    }
    return html;
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
  arraysContainSameValues(array1, array2) {
    const array1Copy = this.makeCopyOfJSONObject(array1);
    array1Copy.sort();
    const array2Copy = this.makeCopyOfJSONObject(array2);
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
   * Takes a string and breaks it up into multiple lines so that the length of
   * each line does not exceed a certain number of characters. This code was
   * found on stackoverflow.
   * https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
   * @param str The string to break up.
   * @param maxWidth The max width of a line.
   * @return A string that has been broken up into multiple lines using \n.
   */
  wordWrap(str, maxWidth) {
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
        if (this.testWhite(str.charAt(i))) {
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
  testWhite(x) {
    let white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
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
   * Check if there is a 'nodeEntered' event in the array of events.
   * @param events An array of events.
   * @return Whether there is a 'nodeEntered' event in the array of events.
   */
  hasNodeEnteredEvent(events) {
    for (let event of events) {
      if (event.event == 'nodeEntered') {
        return true;
      }
    }
    return false;
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

  /**
   * Temporarily highlight an element in the DOM.
   * @param id The id of the element.
   * @param duration The number of milliseconds to keep the element highlighted.
   */
  temporarilyHighlightElement(id, duration = 1000) {
    let element = $('#' + id);
    let originalBackgroundColor = element.css('backgroundColor');
    element.css('background-color', '#FFFF9C');

    /*
     * Use a timeout before starting to transition back to
     * the original background color. For some reason the
     * element won't get highlighted in the first place
     * unless this timeout is used.
     */
    setTimeout(() => {
      // slowly fade back to the original background color
      element.css({
        transition: 'background-color 2s ease-in-out',
        'background-color': originalBackgroundColor
      });

      /*
       * remove these styling fields after we perform
       * the fade otherwise the regular mouseover
       * background color change will not work
       */
      setTimeout(() => {
        element.css({
          transition: '',
          'background-color': ''
        });
      }, 2000);
    }, duration);
  }

  /**
   * Get the connected component associated with the component state.
   * @param componentContent The component content.
   * @param componentState The component state.
   * @return A connected component object or null.
   */
  getConnectedComponentByComponentState(componentContent, componentState) {
    let nodeId = componentState.nodeId;
    let componentId = componentState.componentId;
    let connectedComponents = componentContent.connectedComponents;
    for (let connectedComponent of connectedComponents) {
      if (connectedComponent.nodeId == nodeId && connectedComponent.componentId == componentId) {
        return connectedComponent;
      }
    }
    return null;
  }

  isValidJSONString(jsonString) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  }

  rgbToHex(color, opacity) {
    let values = color
      .replace(/rgb?\(/, '')
      .replace(/\)/, '')
      .replace(/[\s+]/g, '')
      .split(',');
    let a = parseFloat(opacity || 1),
      r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
      g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
      b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return (
      '#' +
      ('0' + r.toString(16)).slice(-2) +
      ('0' + g.toString(16)).slice(-2) +
      ('0' + b.toString(16)).slice(-2)
    );
  }

  isMatchingPeriods(periodId1, periodId2) {
    return this.isAllPeriods(periodId1) || this.isAllPeriods(periodId2) || periodId1 == periodId2;
  }

  isAllPeriods(periodId) {
    return periodId == null || periodId === -1;
  }

  calculateMean(values) {
    return values.reduce((a, b) => a + b) / values.length;
  }

  getIntersectOfArrays(array1, array2) {
    return array1.filter((n) => {
      return array2.indexOf(n) != -1;
    });
  }

  /**
   * This will parse a delimited string into an array of
   * arrays. The default delimiter is the comma, but this
   * can be overriden in the second argument.
   * Source: http://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
   */
  CSVToArray(strData: string, strDelimiter: string = ','): string[][] {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ',';

    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
      // Delimiters.
      '(\\' +
        strDelimiter +
        '|\\r?\\n|\\r|^)' +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        strDelimiter +
        '\\r\\n]*))',
      'gi'
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while ((arrMatches = objPattern.exec(strData))) {
      // Get the delimiter that was found.
      const strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter != strDelimiter) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      let strMatchedValue;
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }

      // Now that we have our value string, let's add
      // it to the data array.
      let finalValue = strMatchedValue;
      const floatVal = parseFloat(strMatchedValue.replace(new RegExp(',', 'g'), ''));
      if (!isNaN(floatVal)) {
        finalValue = floatVal;
      }
      arrData[arrData.length - 1].push(finalValue);
    }
    return arrData;
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
