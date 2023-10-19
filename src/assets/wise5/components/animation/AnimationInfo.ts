import { ComponentInfo } from '../ComponentInfo';

export class AnimationInfo extends ComponentInfo {
  protected description: string = $localize`The student watches an animation.`;
  protected label: string = $localize`Animation`;
  protected previewContent: any = {
    id: 'abcde12345',
    type: 'Animation',
    prompt: 'Press play to watch the animation.',
    showSaveButton: false,
    showSubmitButton: false,
    widthInPixels: 600,
    widthInUnits: 60,
    heightInPixels: 200,
    heightInUnits: 20,
    dataXOriginInPixels: 0,
    dataYOriginInPixels: 80,
    coordinateSystem: 'screen',
    objects: [
      {
        id: 'fw4df1y7nd',
        type: 'image',
        image: '/assets/img/component-preview/sun.png',
        data: [
          {
            t: 0,
            x: 0,
            y: 0
          },
          {
            t: 1,
            x: 25,
            y: -8
          },
          {
            t: 2,
            x: 50,
            y: 0
          }
        ]
      }
    ],
    constraints: []
  };
}
