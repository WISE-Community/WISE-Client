import { insertWiseLinks } from './wise-link';

const componentId1: string = 'component1';
const linkText1: string = 'Go to step';
const nodeId1: string = 'node1';
const typeButton: string = 'button';
const typeLink: string = 'link';

describe('wise-link', () => {
  describe('insertWiseLinks', () => {
    anchorTag();
    buttonTag();
    multipleTags();
  });
});

function anchorTag(): void {
  it('should change anchor tag to wiselink when there is a node id', () => {
    const html = createAnchorHtml(nodeId1, '', linkText1);
    const modifiedHtml = insertWiseLinks(html);
    expect(modifiedHtml).toEqual(createWiseLink(typeLink, linkText1, nodeId1, ''));
  });

  it('should change anchor tag to wiselink when there is a node id and component id', () => {
    const html = createAnchorHtml(nodeId1, componentId1, linkText1);
    const modifiedHtml = insertWiseLinks(html);
    expect(modifiedHtml).toEqual(createWiseLink(typeLink, linkText1, nodeId1, componentId1));
  });

  it('should not change anchor tag to wiselink when wiselink attribute is not present', () => {
    const html = `<a href="http://wise.berkeley.edu">Go to WISE</a>`;
    const modifiedHtml = insertWiseLinks(html);
    expect(modifiedHtml).toEqual(html);
  });
}

function buttonTag(): void {
  it('should change button tag to wiselink when there is a node id', () => {
    const html = createButtonHtml(nodeId1, '', linkText1);
    const modifiedHtml = insertWiseLinks(html);
    expect(modifiedHtml).toEqual(createWiseLink(typeButton, linkText1, nodeId1, ''));
  });

  it('should change button tag to wiselink when there is a node id and component id', () => {
    const html = createButtonHtml(nodeId1, componentId1, linkText1);
    const modifiedHtml = insertWiseLinks(html);
    expect(modifiedHtml).toEqual(createWiseLink(typeButton, linkText1, nodeId1, componentId1));
  });

  it('should not change button tag to wiselink when wiselink attribute is not present', () => {
    const html = `<button onclick="">Go to WISE</button>`;
    const modifiedHtml = insertWiseLinks(html);
    expect(modifiedHtml).toEqual(html);
  });
}

function multipleTags(): void {
  it('should change multiple tags to wiselink', () => {
    const anchorHtml = createAnchorHtml(nodeId1, componentId1, linkText1);
    const buttonHtml = createButtonHtml(nodeId1, componentId1, linkText1);
    const html = anchorHtml + buttonHtml;
    const modifiedHtml = insertWiseLinks(html);
    expect(modifiedHtml).toEqual(
      createWiseLink(typeLink, linkText1, nodeId1, componentId1) +
        createWiseLink(typeButton, linkText1, nodeId1, componentId1)
    );
  });
}

function createAnchorHtml(nodeId: string, componentId: string, linkText: string): string {
  return createElementHtml('a', nodeId, componentId, linkText);
}

function createButtonHtml(nodeId: string, componentId: string, linkText: string): string {
  return createElementHtml('button', nodeId, componentId, linkText);
}

function createElementHtml(
  tag: string,
  nodeId: string,
  componentId: string,
  linkText: string
): string {
  return `<${tag} wiselink="true" node-id="${nodeId}" component-id="${componentId}" link-text="${linkText}">${linkText}</${tag}>`;
}

function createWiseLink(
  type: string,
  linkText: string,
  nodeId: string,
  componentId: string
): string {
  return `<wiselink type='${type}' link-text='${linkText}' node-id='${nodeId}' component-id='${componentId}'/>`;
}
