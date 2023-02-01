/**
 * Replace <a> and <button> elements with <wiselink> elements
 * @param html the html
 * @return the modified html with <wiselink> elements
 */
export function insertWiseLinks(html: string): string {
  let modifiedHtml = insertWiseLinkAnchors(html);
  modifiedHtml = insertWiseLinkButtons(modifiedHtml);
  return modifiedHtml;
}

/**
 * Replace <a> elements that have the parameter wiselink=true with <wiselink> elements
 * @param html the html
 * @return the modified html with certain <a> elements replaced with <wiselink> elements
 */
function insertWiseLinkAnchors(html: string): string {
  return insertWiseLinkElements(html, /<a.*?wiselink="true".*?>(.*?)<\/a>/, 'link');
}

/**
 * Replace <button> elements that have the parameter wiselink=true with <wiselink> elements
 * @param html the html
 * @return the modified html with certain <button> elements replaced with <wiselink> elements
 */
function insertWiseLinkButtons(html: string): string {
  return insertWiseLinkElements(html, /<button.*?wiselink="true".*?>(.*?)<\/button>/, 'button');
}

/**
 * Replace elements that have the parameter wiselink=true with <wiselink> elements
 * @param html the html
 * @return the modified html with certain elements replaced with <wiselink> elements
 */
function insertWiseLinkElements(html: string, regex: RegExp, type: string): string {
  let modifiedHtml = html;
  const wiseLinkRegEx = new RegExp(regex);
  let wiseLinkRegExMatchResult = wiseLinkRegEx.exec(modifiedHtml);
  while (wiseLinkRegExMatchResult != null) {
    const elementHtml = wiseLinkRegExMatchResult[0];
    const elementText = wiseLinkRegExMatchResult[1];
    const nodeId = getWiseLinkNodeId(elementHtml);
    const componentId = getWiseLinkComponentId(elementHtml);
    const wiselinkHtml = `<wiselink type='${type}' link-text='${elementText}' node-id='${nodeId}' component-id='${componentId}'/>`;
    modifiedHtml = modifiedHtml.replace(wiseLinkRegExMatchResult[0], wiselinkHtml);
    wiseLinkRegExMatchResult = wiseLinkRegEx.exec(modifiedHtml);
  }
  return modifiedHtml;
}

/**
 * Get the node id from the wiselink element
 * e.g. for input <wiselink node-id='node5'/>, returns 'node5'
 * @param html the html for the element
 * @return the node id from the node id parameter in the element
 */
export function getWiseLinkNodeId(html: string = ''): string {
  return getWiseLinkId(html, /node-id=["'b](.*?)["']/g);
}

/**
 * Get the component id from the wiselink element
 * e.g. for input <wiselink node-id='node5' component-id='xyzabc' /> returns 'xyzabc'
 * @param html the html for the element
 * @return the component id from the component id parameter in the element
 */
export function getWiseLinkComponentId(html: string = ''): string {
  return getWiseLinkId(html, /component-id=["'b](.*?)["']/g);
}

/**
 * Get an id from the wiselink element
 * @param html the html for the element
 * @param regex the regex to extract the id
 * @return the id extracted from the regex
 */
function getWiseLinkId(html: string, regex: RegExp): string {
  const componentIdRegEx = new RegExp(regex);
  const componentIdRegExResult = componentIdRegEx.exec(html);
  return componentIdRegExResult == null ? '' : componentIdRegExResult[1];
}
