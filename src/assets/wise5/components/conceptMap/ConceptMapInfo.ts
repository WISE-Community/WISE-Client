import { ComponentInfo } from '../ComponentInfo';

export class ConceptMapInfo extends ComponentInfo {
  protected description: string = $localize`The student adds items to a canvas and connects the items with links.`;
  protected label: string = $localize`Concept Map`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'ConceptMap',
    prompt: 'Link the sun to the plant.',
    showSaveButton: false,
    showSubmitButton: false,
    width: 800,
    height: 600,
    background: null,
    stretchBackground: null,
    nodes: [
      {
        id: 'node1',
        label: 'Sun',
        fileName: '/assets/img/component-preview/sun.png',
        width: 100,
        height: 100
      },
      {
        id: 'node2',
        label: 'Plant',
        fileName: '/assets/img/component-preview/leaf.png',
        width: 100,
        height: 100
      }
    ],
    linksTitle: '',
    links: [
      {
        id: 'link1',
        label: 'Sunlight Energy',
        color: 'red'
      }
    ],
    rules: [],
    starterConceptMap: null,
    customRuleEvaluator: '',
    showAutoScore: false,
    showAutoFeedback: false,
    showNodeLabels: true,
    constraints: []
  };
}
