import { ComponentInfo } from '../ComponentInfo';

export class ConceptMapInfo extends ComponentInfo {
  protected description: string = $localize`Students add items to a canvas and connect the items with links.`;
  protected label: string = $localize`Concept Map`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'ConceptMap',
    prompt:
      "How is the Earth warmed by energy from the Sun? It's your turn to show how energy moves between the Sun, the Earth, and Space. Drag the pictures to the canvas and add links between them make your diagram.",
    showSaveButton: false,
    showSubmitButton: false,
    showAddToNotebookButton: false,
    width: 800,
    height: 600,
    background: null,
    stretchBackground: null,
    nodes: [
      {
        fileName: '/assets/img/component-preview/sun2.png',
        width: 100,
        id: 'node1',
        label: 'Sun',
        height: 100
      },
      {
        fileName: '/assets/img/component-preview/Space.png',
        width: 100,
        id: 'node2',
        label: 'Space',
        height: 100
      },
      {
        fileName: '/assets/img/component-preview/Earth_surface.png',
        width: 100,
        id: 'node3',
        label: "Earth's Surface",
        height: 100
      },
      {
        fileName: '/assets/img/component-preview/Earth_beneath.png',
        width: 100,
        id: 'node4',
        label: 'Beneath Surface',
        height: 100
      }
    ],
    linksTitle: '',
    links: [
      {
        color: '#DDD266',
        id: 'link1',
        label: 'Solar Radiation'
      },
      {
        color: '#B62467',
        id: 'link2',
        label: 'Infrared Radiation'
      },
      {
        color: '#DE2D26',
        id: 'link3',
        label: 'Heat'
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
