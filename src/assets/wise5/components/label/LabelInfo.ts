import { ComponentInfo } from '../ComponentInfo';

export class LabelInfo extends ComponentInfo {
  description: string = $localize`The student adds label to a canvas.`;
  previewContent: any = {
    id: 'abcde12345',
    type: 'Label',
    prompt: 'Label the layers of the Earth by moving the labels to the correct location.',
    showSaveButton: false,
    showSubmitButton: false,
    backgroundImage: '/assets/img/component-preview/earth-layers.jpg',
    canCreateLabels: true,
    canEditLabels: true,
    canDeleteLabels: true,
    enableCircles: true,
    width: 800,
    height: 600,
    pointSize: 5,
    fontSize: 20,
    labelWidth: 20,
    labels: [
      {
        pointX: 453,
        pointY: 50,
        textX: 648,
        textY: 50,
        text: 'Crust',
        color: 'black',
        canEdit: false,
        canDelete: false,
        timestamp: 1697647088109,
        isStarterLabel: true
      },
      {
        pointX: 449,
        pointY: 155,
        textX: 644,
        textY: 156,
        text: 'Mantle',
        color: 'black',
        canEdit: false,
        canDelete: false,
        timestamp: 1697647088112,
        isStarterLabel: true
      },
      {
        pointX: 445,
        pointY: 250,
        textX: 646,
        textY: 249,
        text: 'Outer Core',
        color: 'black',
        canEdit: false,
        canDelete: false,
        timestamp: 1697647088114,
        isStarterLabel: true
      },
      {
        pointX: 443,
        pointY: 344,
        textX: 639,
        textY: 344,
        text: 'Inner Core',
        color: 'black',
        canEdit: false,
        canDelete: false,
        timestamp: 1697647088117,
        isStarterLabel: true
      }
    ],
    constraints: []
  };
}
