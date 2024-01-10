import { ComponentInfo } from '../ComponentInfo';

export class AnimationInfo extends ComponentInfo {
  protected description: string = $localize`Students watch an animation.`;
  protected label: string = $localize`Animation`;
  protected previewExamples: any[] = [
    {
      label: $localize`Animation`,
      content: {
        id: 'abcde12345',
        type: 'Animation',
        showSaveButton: false,
        showSubmitButton: false,
        widthInPixels: 740,
        heightInPixels: 200,
        widthInUnits: 53,
        heightInUnits: 20,
        dataXOriginInPixels: 0,
        dataYOriginInPixels: 90,
        coordinateSystem: 'screen',
        objects: [
          {
            id: 'qnn0c2xgck',
            type: 'image',
            image: '/assets/img/component-preview/pool-background.png',
            pixelX: 0,
            pixelY: 90
          },
          {
            id: '8p02z89200',
            type: 'image',
            image: '/assets/img/component-preview/Diving-board.png',
            pixelX: 0,
            pixelY: 25
          },
          {
            id: 'y2yv5w078a',
            type: 'text',
            text: 'Diving board',
            pixelX: 0,
            pixelY: 0
          },
          {
            id: 'kjlw72m46a',
            type: 'text',
            text: '0',
            pixelX: 0,
            pixelY: 60
          },
          {
            id: '3med1wqhac',
            type: 'text',
            text: '25',
            pixelX: 360,
            pixelY: 60
          },
          {
            id: 'k8hs2qlcxh',
            type: 'text',
            text: '50',
            pixelX: 720,
            pixelY: 60
          },
          {
            id: 'g1m6j9iyur',
            type: 'image',
            image: '/assets/img/component-preview/Swimmer-correct.png',
            dataX: 0,
            dataY: 0,
            data: [
              {
                t: 0,
                x: 0
              },
              {
                t: 20,
                x: 50
              },
              {
                t: 60,
                x: 0
              }
            ],
            imageMovingRight: '/assets/img/component-preview/Swimmer-correct.png',
            imageMovingLeft: '/assets/img/component-preview/Swimmer-correct-reverse.png'
          },
          {
            id: 'og4rulilwn',
            type: 'image',
            image: '/assets/img/component-preview/Swimmer.png',
            dataX: 0,
            dataY: 0,
            imageMovingRight: '/assets/img/component-preview/Swimmer.png',
            imageMovingLeft: '/assets/img/component-preview/Swimmer-reverse.png'
          }
        ],
        constraints: []
      }
    }
  ];
}
