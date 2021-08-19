import { Subscription } from 'rxjs';

export class GenerateImageDialog {
  destroyDoneRenderingComponentListenerTimeout: any;
  doneRenderingComponentSubscription: Subscription;

  static $inject = [
    '$mdDialog',
    'componentState',
    'NodeService',
    'ConceptMapService',
    'DrawService',
    'EmbeddedService',
    'GraphService',
    'LabelService',
    'TableService'
  ];

  constructor(
    private $mdDialog,
    private componentState,
    private NodeService,
    private ConceptMapService,
    private DrawService,
    private EmbeddedService,
    private GraphService,
    private LabelService,
    private TableService
  ) {}

  $onInit() {
    this.subscribeToDoneRenderingComponent();
    this.setDestroyTimeout();
  }

  subscribeToDoneRenderingComponent(): void {
    this.doneRenderingComponentSubscription = this.NodeService.doneRenderingComponent$.subscribe(
      ({ nodeId, componentId }) => {
        if (
          nodeId == this.componentState.nodeId &&
          componentId == this.componentState.componentId
        ) {
          setTimeout(() => {
            this.generateImage();
          }, 2000);
        }
      }
    );
  }

  generateImage() {
    this.getComponentService(this.componentState.componentType)
      .generateImageFromRenderedComponentState(this.componentState)
      .then((image: any) => {
        clearTimeout(this.destroyDoneRenderingComponentListenerTimeout);
        this.doneRenderingComponentSubscription.unsubscribe();
        this.$mdDialog.hide(image);
      });
  }

  /*
   * Set a timeout to destroy the listener in case there is an error creating the image and
   * we don't get to destroying it after we generate the image.
   */
  setDestroyTimeout() {
    this.destroyDoneRenderingComponentListenerTimeout = setTimeout(() => {
      this.doneRenderingComponentSubscription.unsubscribe();
    }, 10000);
  }

  getComponentService(componentType: string): any {
    switch (componentType) {
      case 'ConceptMap':
        return this.ConceptMapService;
      case 'Draw':
        return this.DrawService;
      case 'Embedded':
        return this.EmbeddedService;
      case 'Graph':
        return this.GraphService;
      case 'Label':
        return this.LabelService;
      case 'Table':
        return this.TableService;
    }
  }
}
