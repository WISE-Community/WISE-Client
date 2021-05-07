export class GenerateImageDialog {
  destroyDoneRenderingComponentListenerTimeout: any;
  doneRenderingComponentSubscription: any;

  static $inject = [
    '$scope',
    '$mdDialog',
    'nodeId',
    'componentId',
    'componentState',
    'NodeService',
    'ConceptMapService',
    'DrawService',
    'EmbeddedService',
    'GraphService',
    'TableService'
  ];

  constructor(
    private $scope,
    private $mdDialog,
    private nodeId,
    private componentId,
    private componentState,
    private NodeService,
    private ConceptMapService,
    private DrawService,
    private EmbeddedService,
    private GraphService,
    private TableService
  ) {
    $scope.nodeId = nodeId;
    $scope.componentId = componentId;
    $scope.componentState = componentState;
    this.subscribeToDoneRenderingComponent();
    this.setDestroyTimeout();
    $scope.closeDialog = function () {
      $mdDialog.hide();
    };
  }

  subscribeToDoneRenderingComponent(): void {
    this.doneRenderingComponentSubscription = this.NodeService.doneRenderingComponent$.subscribe(
      ({ nodeId, componentId }) => {
        if (
          this.componentState.nodeId == nodeId &&
          this.componentState.componentId == componentId
        ) {
          setTimeout(() => {
            this.generateImage();
          }, 1000);
        }
      }
    );
  }

  generateImage() {
    const componentService = this.getComponentService(this.componentState.componentType);
    componentService
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
      case 'Table':
        return this.TableService;
    }
  }
}
