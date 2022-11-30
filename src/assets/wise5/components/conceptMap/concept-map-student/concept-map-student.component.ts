import SVG from 'svg.js';
import 'svg.draggable.js';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { ConceptMapService } from '../conceptMapService';
import { DialogWithCloseComponent } from '../../../directives/dialog-with-close/dialog-with-close.component';

@Component({
  selector: 'concept-map-student',
  templateUrl: 'concept-map-student.component.html',
  styleUrls: ['concept-map-student.component.scss']
})
export class ConceptMapStudent extends ComponentStudent {
  activeLink: any;
  activeLinkStartX: number;
  activeLinkStartY: number;
  activeNode: any;
  addedDropListener: any;
  autoFeedbackResult: any;
  autoFeedbackString: string = '';
  availableNodes: any[] = [];
  availableLinks: any[] = [];
  background: any;
  backgroundSize: string;
  backgroundUrl: string = '';
  componentStateId: number;
  componentTypesCanImportAsBackground: string[] = ['Draw', 'Embedded', 'Graph', 'Label', 'Table'];
  conceptMapContainerId: string;
  displayLinkTypeChooser: boolean = false;
  domIdEnding: string;
  dragOverListenerFunction: any;
  draw: any;
  drawingLink: any;
  dropListenerFunction: any;
  feedbackContainerId: string;
  height: number = 600;
  highlightedElement: any;
  linkCurvatureSet: boolean;
  links: any[] = [];
  linksTitle: string = 'Links';
  linkTypeChooserStyle: any;
  modalHeight: number = 600;
  modalWidth: number = 800;
  newlyCreatedLink: any;
  nodes: any[] = [];
  selectedLinkType: string;
  selectedNode: any;
  selectNodeBarId: string;
  stretchBackground: any;
  svgId: string;
  tempOffsetX: number = 0;
  tempOffsetY: number = 0;
  width: number = 800;

  constructor(
    protected AnnotationService: AnnotationService,
    private changeDetector: ChangeDetectorRef,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    private ConceptMapService: ConceptMapService,
    protected dialog: MatDialog,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initialize();
  }

  ngAfterViewInit(): void {
    this.initializeSVG();
    this.changeDetector.detectChanges(); // prevents dev-mode change detection error
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    const svg = this.getElementById(this.svgId, true);
    svg.removeEventListener('dragover', this.dragOverListenerFunction);
    svg.removeEventListener('drop', this.dropListenerFunction);
  }

  initialize(): void {
    this.setIdsWithNodeIdComponentId();
    this.initializeWidth();
    this.initializeHeight();
    this.initializeShowNodeLabels();
    this.initializeLinksTitle();
    this.availableNodes = this.componentContent.nodes;
    this.availableLinks = this.componentContent.links;
    this.setBackground(this.componentContent.background, this.componentContent.stretchBackground);
  }

  setIdsWithNodeIdComponentId(): void {
    this.domIdEnding = this.ConceptMapService.getDomIdEnding(
      this.nodeId,
      this.componentId,
      this.componentState
    );
    this.svgId = this.ConceptMapService.getSVGId(this.domIdEnding);
    this.conceptMapContainerId = this.ConceptMapService.getConceptMapContainerId(this.domIdEnding);
    this.selectNodeBarId = this.ConceptMapService.getSelectNodeBarId(this.domIdEnding);
    this.feedbackContainerId = this.ConceptMapService.getFeedbackContainerId(this.domIdEnding);
  }

  initializeWidth(): void {
    if (this.componentContent.width != null) {
      this.width = this.componentContent.width;
    }
  }

  initializeHeight(): void {
    if (this.componentContent.height != null) {
      this.height = this.componentContent.height;
    }
  }

  initializeShowNodeLabels(): void {
    if (this.componentContent.showNodeLabels == null) {
      this.componentContent.showNodeLabels = true;
    }
  }

  initializeLinksTitle(): void {
    if (this.componentContent.linksTitle != null && this.componentContent.linksTitle !== '') {
      this.linksTitle = this.componentContent.linksTitle;
    }
  }

  initializeSVG(): void {
    this.setupSVG();
    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (this.componentStateHasStudentWork(this.componentState, this.componentContent)) {
      this.componentState = this.ProjectService.injectAssetPaths(this.componentState);
      this.setStudentWork(this.componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
    } else if (this.componentContentHasStarterConceptMap()) {
      this.populateConceptMapData(this.componentContent.starterConceptMap);
    }
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableSubmitButton();
    }
    if (!this.isDisabled) {
      this.enableNodeDragging();
      this.addStudentInteractionListeners();
    }
    this.disableComponentIfNecessary();
    this.broadcastDoneRenderingComponent();
  }

  componentStateHasStudentWork(componentState: any, componentContent: any): boolean {
    return this.ConceptMapService.componentStateHasStudentWork(componentState, componentContent);
  }

  componentContentHasStarterConceptMap(): boolean {
    return this.componentContent.starterConceptMap != null;
  }

  setStudentWork(componentState: any): void {
    const studentData = componentState.studentData;
    const conceptMapData = studentData.conceptMapData;
    const submitCounter = studentData.submitCounter;
    if (submitCounter != null) {
      this.submitCounter = submitCounter;
    }
    this.populateConceptMapData(conceptMapData);
    this.processLatestStudentWork();
  }

  populateConceptMapData(conceptMapData: any): void {
    this.populateNodes(conceptMapData);
    this.populateLinks(conceptMapData);
    if (conceptMapData.backgroundPath != null && conceptMapData.backgroundPath != '') {
      this.setBackground(conceptMapData.backgroundPath, conceptMapData.stretchBackground);
    }
    this.moveLinkTextToFront();
    this.moveNodesToFront();

    // set a timeout to refresh the link labels so the rectangles around the labels are properly
    // resized
    setTimeout(() => {
      this.refreshLinkLabels();
    });
  }

  populateNodes(conceptMapData: any): void {
    this.nodes = [];
    for (const node of conceptMapData.nodes) {
      const conceptMapNode = this.ConceptMapService.newConceptMapNode(
        this.draw,
        node.instanceId,
        node.originalId,
        node.fileName,
        node.label,
        node.x,
        node.y,
        node.width,
        node.height,
        this.componentContent.showNodeLabels
      );
      this.addNode(conceptMapNode);
      if (!this.isDisabled) {
        this.setNodeMouseEvents(conceptMapNode);
      }
    }
  }

  populateLinks(conceptMapData: any): void {
    this.links = [];
    for (const link of conceptMapData.links) {
      let sourceNode = null;
      const sourceNodeId = link.sourceNodeInstanceId;
      if (sourceNodeId != null) {
        sourceNode = this.getNodeById(sourceNodeId);
      }

      let destinationNode = null;
      const destinationNodeId = link.destinationNodeInstanceId;
      if (destinationNodeId != null) {
        destinationNode = this.getNodeById(destinationNodeId);
      }

      const conceptMapLink = this.ConceptMapService.newConceptMapLink(
        this.draw,
        link.instanceId,
        link.originalId,
        sourceNode,
        destinationNode,
        link.label,
        link.color,
        link.curvature,
        link.startCurveUp,
        link.endCurveUp
      );
      this.addLink(conceptMapLink);
      if (!this.isDisabled) {
        this.setLinkMouseEvents(conceptMapLink);
      }
    }
  }

  /**
   * Refresh the link labels so that the rectangles around the text labels are resized to fit the
   * text properly. This is required because the rectangles are not properly sized when the
   * ConceptMapLinks are initialized. The rectangles need to be rendered first and then the labels
   * need to be set in order for the rectangles to be resized properly. This is why this function is
   * called in a seTimeout.
   */
  refreshLinkLabels(): void {
    for (const node of this.nodes) {
      if (node.showLabel) {
        const label = node.getLabel();
        // set the label back into the node so that the rectangle around the text label is resized
        // to the text
        node.setLabel(label);
      }
    }

    for (const link of this.links) {
      const label = link.getLabel();
      // set the label back into the link so that the rectangle around the text label is resized to
      // the text
      link.setLabel(label);
    }
  }

  /**
   * A submit was triggered by the component submit button or node submit button
   * @param submitTriggeredBy what triggered the submit
   * e.g. 'componentSubmitButton' or 'nodeSubmitButton'
   */
  submit(submitTriggeredBy: string): void {
    if (this.isSubmitDirty) {
      if (this.checkIfShouldPerformSubmit()) {
        this.incrementSubmitCounter();
        if (this.hasMaxSubmitCount() && !this.hasSubmitsLeft()) {
          this.isSubmitButtonDisabled = true;
        }
        if (this.hasAutoGrading()) {
          this.performAutoGrading();
        }
        this.isSubmit = true;
        this.emitComponentSubmitTriggered();
      } else {
        this.isSubmit = false;
      }
    }
  }

  checkIfShouldPerformSubmit(): boolean {
    let performSubmit = true;
    if (this.hasMaxSubmitCount()) {
      const numberOfSubmitsLeft = this.getNumberOfSubmitsLeft();
      let message = '';
      if (numberOfSubmitsLeft <= 0) {
        alert($localize`You have no more chances to receive feedback on your answer.`);
        performSubmit = false;
      } else if (numberOfSubmitsLeft === 1) {
        message = $localize`You have 1 chance to receive feedback on your answer so this should be your best work.\n\nAre you ready to receive feedback on this answer?`;
        performSubmit = confirm(message);
      } else if (numberOfSubmitsLeft > 1) {
        message = $localize`You have ${numberOfSubmitsLeft} chances to receive feedback on your answer so this this should be your best work.\n\nAre you ready to receive feedback on this answer?`;
        performSubmit = confirm(message);
      }
    }
    return performSubmit;
  }

  hasAutoGrading(): boolean {
    return (
      this.componentContent.customRuleEvaluator != null &&
      this.componentContent.customRuleEvaluator != ''
    );
  }

  performAutoGrading(): void {
    const customRuleEvaluator = this.componentContent.customRuleEvaluator;
    const componentContent = this.componentContent;
    const conceptMapData = this.getConceptMapData();
    const thisConceptMapService = this.ConceptMapService;
    let thisResult: any = {};

    /*
     * Create the any function that can be called in the custom rule evaluator code. The arguments
     * to the any function are rule names. For example if we are looking for any of the links below
     * Sun (Infrared Radiation) Space
     * Sun (Heat) Space
     * Sun (Solar Radiation) Space
     * We will call the any function like this
     * any("Sun (Infrared Radiation) Space", "Sun (Heat) Space", "Sun (Solar Radiation) Space")
     * These arguments to the any function will be placed in the arguments variable.
     */
    const any = function () {
      return thisConceptMapService.any(componentContent, conceptMapData, arguments);
    };

    /*
     * Create the all function that can be called in the custom rule evaluator code. The arguments
     * to the all function are rule names. For example if we are looking for all of the links below
     * Sun (Infrared Radiation) Space
     * Sun (Heat) Space
     * Sun (Solar Radiation) Space
     * We will call the all function like this
     * all("Sun (Infrared Radiation) Space", "Sun (Heat) Space", "Sun (Solar Radiation) Space")
     * These arguments to the all function will be placed in the arguments variable.
     */
    const all = function () {
      return thisConceptMapService.all(componentContent, conceptMapData, arguments);
    };

    // Create the setResult function that can be called in the custom rule evaluator code.
    const setResult = function (result: any) {
      thisResult = result;
    };

    eval(customRuleEvaluator);
    this.autoFeedbackResult = thisResult;
    const feedback = this.getFeedbackFromResult(thisResult);
    if (feedback != '') {
      this.showFeedbackInPopup(feedback);
    }
    this.autoFeedbackString = feedback;
  }

  getFeedbackFromResult(result: any): string {
    let feedback = '';
    if (this.componentContent.showAutoScore && result.score != null) {
      feedback += $localize`Score` + ': ' + result.score;
      if (this.hasMaxScore()) {
        feedback += '/' + this.getMaxScore();
      }
    }
    if (this.componentContent.showAutoFeedback && result.feedback != null) {
      if (feedback !== '') {
        feedback += '<br/>';
      }
      feedback += $localize`Feedback` + ': ' + result.feedback;
    }
    return feedback;
  }

  showFeedbackInPopup(feedbackText: string): void {
    this.dialog.open(DialogWithCloseComponent, {
      data: {
        content: feedbackText,
        title: $localize`Feedback`
      }
    });
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action: string): Promise<any> {
    const componentState = this.createComponentStateObject();
    const promise = new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
    return promise;
  }

  createComponentStateObject(): any {
    const componentState: any = this.createNewComponentState();
    componentState.componentType = 'ConceptMap';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    componentState.isSubmit = this.isSubmit;
    const studentData: any = {
      conceptMapData: this.getConceptMapData(),
      submitCounter: this.submitCounter
    };
    componentState.studentData = studentData;
    if (this.isSubmit) {
      this.isSubmit = false;
      if (this.hasAutoFeedbackScore() || this.hasAutoFeedbackText()) {
        this.addAnnotations(componentState);
      } else if (this.hasDefaultFeedback()) {
        this.addDefaultFeedback(componentState);
      }
    }
    return componentState;
  }

  addAnnotations(componentState: any): void {
    const runId = this.ConfigService.getRunId();
    const periodId = this.ConfigService.getPeriodId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const toWorkgroupId = this.ConfigService.getWorkgroupId();
    componentState.annotations = [];
    if (this.hasAutoFeedbackScore()) {
      this.addScoreAnnotation(componentState, runId, periodId, nodeId, componentId, toWorkgroupId);
    }
    if (this.hasAutoFeedbackText()) {
      this.addCommentAnnotation(
        componentState,
        runId,
        periodId,
        nodeId,
        componentId,
        toWorkgroupId
      );
    }
  }

  addScoreAnnotation(
    componentState: any,
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string,
    toWorkgroupId: number
  ): void {
    const data: any = {
      value: parseFloat(this.autoFeedbackResult.score),
      autoGrader: 'conceptMap'
    };
    if (this.hasMaxScore()) {
      data.maxAutoScore = this.getMaxScore();
    }
    const scoreAnnotation = this.AnnotationService.createAutoScoreAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      toWorkgroupId,
      data
    );
    componentState.annotations.push(scoreAnnotation);
  }

  addCommentAnnotation(
    componentState: any,
    runId: number,
    periodId: number,
    nodeId: string,
    componentId: string,
    toWorkgroupId: number
  ): void {
    const data = {
      value: this.autoFeedbackResult.feedback,
      autoGrader: 'conceptMap'
    };
    const commentAnnotation = this.AnnotationService.createAutoCommentAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      toWorkgroupId,
      data
    );
    componentState.annotations.push(commentAnnotation);
  }

  hasAutoFeedback(): boolean {
    return this.autoFeedbackResult != null;
  }

  hasAutoFeedbackScore(): boolean {
    return this.autoFeedbackResult != null && this.autoFeedbackResult.score != null;
  }

  hasAutoFeedbackText(): boolean {
    return this.autoFeedbackResult != null && this.autoFeedbackResult.feedback != null;
  }

  getConceptMapData(): any {
    const conceptMapData: any = {
      nodes: [],
      links: []
    };

    for (const node of this.nodes) {
      const nodeJSON = node.toJSONObject();
      conceptMapData.nodes.push(nodeJSON);
    }

    for (const link of this.links) {
      const linkJSON = link.toJSONObject();
      conceptMapData.links.push(linkJSON);
    }

    if (this.background != null) {
      const background = this.background;
      conceptMapData.background = this.getBackgroundFileName(background);
      conceptMapData.backgroundPath = background;
      conceptMapData.stretchBackground = this.stretchBackground;
    }

    return conceptMapData;
  }

  getBackgroundFileName(background: string): string {
    return background.substring(background.lastIndexOf('/') + 1);
  }

  createAutoScoreAnnotation(data: any): any {
    return this.AnnotationService.createAutoScoreAnnotation(
      this.ConfigService.getRunId(),
      this.ConfigService.getPeriodId(),
      this.nodeId,
      this.componentId,
      this.ConfigService.getWorkgroupId(),
      data
    );
  }

  createAutoCommentAnnotation(data: any): any {
    return this.AnnotationService.createAutoCommentAnnotation(
      this.ConfigService.getRunId(),
      this.ConfigService.getPeriodId(),
      this.nodeId,
      this.componentId,
      this.ConfigService.getWorkgroupId(),
      data
    );
  }

  linkTypeSelected(selectedLink: any): void {
    if (this.highlightedElement != null && this.highlightedElement.type === 'ConceptMapLink') {
      const link = this.highlightedElement;
      link.setLabel(selectedLink.label);
      link.setColor(selectedLink.color);
      link.setOriginalId(selectedLink.id);
    }
    this.clearHighlightedElement();
    this.studentDataChanged();
  }

  showLinkTypeChooser(): void {
    this.displayLinkTypeChooser = true;
  }

  hideLinkTypeChooser(): void {
    this.displayLinkTypeChooser = false;
    this.newlyCreatedLink = null;
  }

  setupSVG(): void {
    this.draw = SVG(this.svgId);
    this.draw.width(this.width);
    this.draw.height(this.height);
    this.highlightedElement = null;
    this.activeNode = null;
    this.activeLink = null;
    this.drawingLink = false;
    this.newlyCreatedLink = null;
  }

  addStudentInteractionListeners(): void {
    this.addMouseListeners();
    this.addDragOverListenerIfNecessary();
    this.addDropListenerIfNecessary();
  }

  addMouseListeners(): void {
    this.draw.mousedown((event: any) => {
      this.svgMouseDown(event);
    });

    this.draw.mouseup((event: any) => {
      this.svgMouseUp(event);
    });

    this.draw.mousemove((event: any) => {
      this.svgMouseMove(event);
    });
  }

  addDragOverListenerIfNecessary(): void {
    // check if we have already added the dragover listener so we don't add multiple listeners for
    // the same event. adding multiple listeners to the same event may occur in the authoring tool.
    if (this.dragOverListenerFunction == null) {
      this.dragOverListenerFunction = (event: any) => {
        // prevent the default because if we don't, the user won't be able to drop a new node
        // instance onto the svg in the authoring preview mode
        event.preventDefault();
      };
      const svg = this.getElementById(this.svgId, true);
      svg.addEventListener('dragover', this.dragOverListenerFunction);
    }
  }

  addDropListenerIfNecessary(): void {
    // check if we have already added the drop listener so we don't add multiple listeners for the
    // same event. adding multiple listeners to the same event may occur in the authoring tool.
    if (this.dropListenerFunction == null) {
      this.dropListenerFunction = (event: any) => {
        // the user has dropped a new node onto the svg to create a new instance of a node
        this.newNodeDropped(event);
      };
      const svg = this.getElementById(this.svgId, true);
      svg.addEventListener('drop', this.dropListenerFunction);
    }
  }

  getModalWidth(): number {
    const selectNodeBarWidthString = this.getElementById(this.selectNodeBarId).css('width');
    const svgWidthString = this.getElementById(this.svgId).css('width');
    if (selectNodeBarWidthString != null && svgWidthString != null) {
      const selectNodeBarWidth = parseInt(selectNodeBarWidthString.replace('px', ''));
      const svgWidth = parseInt(svgWidthString.replace('px', ''));
      if (selectNodeBarWidth != null && svgWidth != null) {
        return selectNodeBarWidth + svgWidth;
      }
    }
    return null;
  }

  getModalHeight(): number {
    const selectNodeBarHeightString = this.getElementById(this.selectNodeBarId).css('height');
    const svgHeightString = this.getElementById(this.svgId).css('height');
    if (selectNodeBarHeightString != null && svgHeightString != null) {
      const selectNodeBarHeight = parseInt(selectNodeBarHeightString.replace('px', ''));
      const svgHeight = parseInt(svgHeightString.replace('px', ''));
      if (selectNodeBarHeight != null && svgHeight != null) {
        return Math.max(selectNodeBarHeight, svgHeight);
      }
    }
    return null;
  }

  cancelLinkTypeChooser(): void {
    if (this.newlyCreatedLink != null) {
      // the student has just created this link and has not yet chosen a link type so we will remove
      // the link
      this.newlyCreatedLink.remove();
      this.newlyCreatedLink = null;
    }
    this.hideLinkTypeChooser();
    this.clearHighlightedElement();
  }

  svgMouseDown(event: any): void {
    if (event.target.tagName === 'svg') {
      this.clearHighlightedElement();
    }
  }

  svgMouseUp(event: any): void {
    if (this.activeLink != null && this.activeNode == null) {
      // the student was creating a link but did not connect the link to a destination node so we
      // will just remove the link
      this.activeLink.remove();
    }
    this.drawingLink = false;
    this.activeLink = null;
    if (!this.isDisabled) {
      this.enableNodeDragging();
    }
    this.moveLinkTextToFront();
    this.moveNodesToFront();
  }

  svgMouseMove(event: any): void {
    if (this.activeLink != null) {
      // there is an active link which means the student has created a new link and is in the
      // process of choosing the link's destination node

      // get the coordinates that the link should be updated to
      const coordinates = this.getRelativeCoordinatesByEvent(event);
      const x1 = null;
      const y1 = null;
      const x2 = coordinates.x;
      const y2 = coordinates.y;

      // get the location of the center of the connector that the link originated from
      const startX = this.activeLinkStartX;
      const startY = this.activeLinkStartY;

      // get the distance from the start to the current position of the mouse
      const distance = this.ConceptMapService.calculateDistance(startX, startY, x2, y2);

      // check if we have set the curvature yet and that the mouse is more than 20 pixels away from
      // the start.
      //
      // we will determine the curvature of the link based upon how the user has dragged the mouse
      // in relation to the center of the connector. if they start drawing the link horizontally we
      // will create a straight line with no curvature. if they start drawing the link by moving the
      // mouse up, we will create a line that curves up. if they start drawing the link by moving
      // the mouse down, we will create a line that curves down.
      if (!this.linkCurvatureSet && distance > 20) {
        // get the slope of the line from the start to the location of the mouse
        const slope = Math.abs(this.ConceptMapService.getSlope(startX, startY, x2, y2));
        if (y2 < startY) {
          // the user has moved the mouse above the connector
          this.setActiveLinkCurvature(slope);
          this.setLinkCurveUp(this.activeLink);
        } else if (y2 > startY) {
          // the user has moved the mouse below the connector
          this.setActiveLinkCurvature(slope);
          this.setLinkCurveDown(this.activeLink);
        }
        this.linkCurvatureSet = true;
      }

      const isDragging = true;
      this.activeLink.updateCoordinates(x1, y1, x2, y2, isDragging);
    }
  }

  setActiveLinkCurvature(slope: number): void {
    if (slope == null) {
      // the slope is infinite so we will default the curvature to 0.5
      this.activeLink.curvature = 0.5;
    } else if (slope < 1.0) {
      // make the link straight
      this.activeLink.curvature = 0.0;
    } else {
      // make the link curved
      this.activeLink.curvature = 0.5;
    }
  }

  setLinkCurveUp(link: any): void {
    this.setLinkCurveDirection(link, true);
  }

  setLinkCurveDown(link: any): void {
    this.setLinkCurveDirection(link, false);
  }

  setLinkCurveDirection(link: any, isCurveDirectionUp: boolean): void {
    link.startCurveUp = isCurveDirectionUp;
    link.endCurveUp = isCurveDirectionUp;
  }

  /**
   * This is called when the student places the mouse over a node.
   * @param node the node to make active
   */
  setActiveNode(node: any): void {
    node.showDeleteButton();
    node.showBorder();
    this.activeNode = node;
  }

  clearActiveNode(): void {
    for (const node of this.nodes) {
      if (node === this.activeNode && node !== this.highlightedElement) {
        node.hideDeleteButton();
        node.hideBorder();
      }
    }
    this.activeNode = null;
  }

  /**
   * Get the coordinates of the mouse relative to the svg element
   * @param event a mouse event
   * @returns an object containing x and y values
   */
  getRelativeCoordinatesByEvent(event: any): any {
    let parentOffsetX = 0;
    let parentOffsetY = 0;
    const userAgent = navigator.userAgent;
    switch (event.target.tagName) {
      case 'svg':
        ({ parentOffsetX, parentOffsetY } = this.getParentOffsetsFromSVG(event, userAgent));
        break;
      case 'circle':
        ({ parentOffsetX, parentOffsetY } = this.getParentOffsetsFromCircle(event, userAgent));
        break;
      case 'rect':
        ({ parentOffsetX, parentOffsetY } = this.getParentOffsetsFromRect(event, userAgent));
        break;
      case 'image':
        ({ parentOffsetX, parentOffsetY } = this.getParentOffsetsFromImage(event, userAgent));
        break;
      case 'path':
        ({ parentOffsetX, parentOffsetY } = this.getParentOffsetsFromPath(event, userAgent));
        break;
      default:
        ({ parentOffsetX, parentOffsetY } = this.getParentOffsetsFromDefault(event, userAgent));
    }
    return {
      x: parentOffsetX + event.offsetX,
      y: parentOffsetY + event.offsetY
    };
  }

  getParentOffsetsFromSVG(event: any, userAgent: string): any {
    let parentOffsetX = 0;
    let parentOffsetY = 0;
    if (this.isUserAgentChrome(userAgent)) {
      const matrix = event.target.getCTM();
      parentOffsetX = matrix.e;
      parentOffsetY = matrix.f;
    } else if (this.isUserAgentFirefox(userAgent)) {
      const matrix = event.target.createSVGMatrix();
      parentOffsetX = matrix.e;
      parentOffsetY = matrix.f;
    } else {
      const matrix = event.target.getCTM();
      parentOffsetX = matrix.e;
      parentOffsetY = matrix.f;
    }
    return {
      parentOffsetX: parentOffsetX,
      parentOffsetY: parentOffsetY
    };
  }

  getParentOffsetsFromCircle(event: any, userAgent: string): any {
    let parentOffsetX = 0;
    let parentOffsetY = 0;
    if (this.isUserAgentFirefox(userAgent)) {
      const matrix = event.target.getCTM();
      const bbox = event.target.getBBox();
      parentOffsetX = matrix.e + bbox.x;
      parentOffsetY = matrix.f + bbox.y;
    }
    return {
      parentOffsetX: parentOffsetX,
      parentOffsetY: parentOffsetY
    };
  }

  getParentOffsetsFromRect(event: any, userAgent: string): any {
    let parentOffsetX = 0;
    let parentOffsetY = 0;
    if (this.isUserAgentFirefox(userAgent)) {
      const matrix = event.target.getCTM();
      const bbox = event.target.getBBox();
      const x = bbox.x;
      const y = bbox.y;
      parentOffsetX = matrix.e + x;
      parentOffsetY = matrix.f + y;
    }
    return {
      parentOffsetX: parentOffsetX,
      parentOffsetY: parentOffsetY
    };
  }

  getParentOffsetsFromImage(event: any, userAgent: string): any {
    let parentOffsetX = 0;
    let parentOffsetY = 0;
    if (this.isUserAgentFirefox(userAgent)) {
      const matrix = event.target.parentElement.getCTM();
      parentOffsetX = matrix.e;
      parentOffsetY = matrix.f;
    }
    return {
      parentOffsetX: parentOffsetX,
      parentOffsetY: parentOffsetY
    };
  }

  getParentOffsetsFromPath(event: any, userAgent: string): any {
    let parentOffsetX = 0;
    let parentOffsetY = 0;
    if (this.isUserAgentFirefox(userAgent)) {
      const x2 = event.target.attributes['x2'];
      const y2 = event.target.attributes['y2'];
      if (x2 != null && y2 != null) {
        parentOffsetX = parseInt(x2.value);
        parentOffsetY = parseInt(y2.value);
      }
    }
    return {
      parentOffsetX: parentOffsetX,
      parentOffsetY: parentOffsetY
    };
  }

  getParentOffsetsFromDefault(event: any, userAgent: string): any {
    let parentOffsetX = 0;
    let parentOffsetY = 0;
    if (this.isUserAgentChrome(userAgent)) {
    } else if (this.isUserAgentFirefox(userAgent)) {
      const matrix = event.target.getCTM();
      parentOffsetX = matrix.e;
      parentOffsetY = matrix.f;
    }
    return {
      parentOffsetX: parentOffsetX,
      parentOffsetY: parentOffsetY
    };
  }

  isUserAgentChrome(userAgent: string): boolean {
    return userAgent.includes('Chrome');
  }

  isUserAgentFirefox(userAgent: string): boolean {
    return userAgent.includes('Firefox');
  }

  /**
   * Called when the student clicks down on a node in the left node bar
   * @param $event the mouse down event
   * @param node the node the student clicked down on
   */
  selectNode($event: any, node: any): void {
    this.selectedNode = node;

    // remember the offset of the mouse relative to the upper left of the node's image so that we
    // properly calculate the node position when the student releases the mouse to put the node in
    // the svg
    this.tempOffsetX = $event.offsetX;
    this.tempOffsetY = $event.offsetY;
  }

  newNodeDropped(event: any): void {
    const selectedNode = this.selectedNode;
    const coordinates = this.getRelativeCoordinatesByEvent(event);
    const x = coordinates.x - this.tempOffsetX;
    const y = coordinates.y - this.tempOffsetY;
    const conceptMapNode = this.ConceptMapService.newConceptMapNode(
      this.draw,
      this.getNewConceptMapNodeId(),
      selectedNode.id,
      selectedNode.fileName,
      selectedNode.label,
      x,
      y,
      selectedNode.width,
      selectedNode.height,
      this.componentContent.showNodeLabels
    );
    this.addNode(conceptMapNode);
    this.setNodeMouseEvents(conceptMapNode);
    this.setHighlightedElement(conceptMapNode);
    this.studentDataChanged();
    if (!this.isDisabled) {
      this.enableNodeDragging();
    }
  }

  getNewConceptMapNodeId(): any {
    return this.ConceptMapService.getNextAvailableId(this.nodes, 'studentNode');
  }

  getNewConceptMapLinkId(): any {
    return this.ConceptMapService.getNextAvailableId(this.links, 'studentLink');
  }

  setNodeMouseEvents(conceptMapNode: any): void {
    conceptMapNode.setNodeMouseOver((event: any) => {
      this.nodeMouseOver(event);
    });

    conceptMapNode.setNodeMouseOut((event: any) => {
      this.nodeMouseOut(event);
    });

    conceptMapNode.setConnectorMouseDown((event: any) => {
      this.disableNodeDragging();
      this.connectorMouseDown(event);
    });

    conceptMapNode.setNodeMouseDown((event: any) => {
      this.nodeMouseDown(event);
    });

    conceptMapNode.setNodeMouseUp((event: any) => {
      this.nodeMouseUp(event);
    });

    conceptMapNode.setDeleteButtonMouseDown((event: any) => {
      this.nodeDeleteButtonMouseDown(event);
    });

    conceptMapNode.setDeleteButtonMouseOver((event: any) => {
      this.nodeDeleteButtonMouseOver(event);
    });

    conceptMapNode.setDeleteButtonMouseOut((event: any) => {
      this.nodeDeleteButtonMouseOut(event);
    });

    conceptMapNode.setDragMove((event: any) => {
      this.nodeDragMove(event);
    });
  }

  setHighlightedElement(element: any): void {
    this.clearHighlightedElement();
    this.hideLinkTypeChooser();
    this.highlightedElement = element;
    element.isHighlighted(true);
    element.showDeleteButton();
    if (element.type === 'ConceptMapNode') {
      element.showBorder();
    } else if (element.type === 'ConceptMapLink') {
      this.showLinkTypeChooser();
      this.selectedLinkType = element.getOriginalId();
    }
  }

  clearHighlightedElement(): void {
    if (this.highlightedElement != null) {
      if (this.highlightedElement.type === 'ConceptMapNode') {
        this.highlightedElement.hideBorder();
      } else if (this.highlightedElement.type === 'ConceptMapLink') {
        this.hideLinkTypeChooser();
      }
      this.highlightedElement.isHighlighted(false);
      this.highlightedElement.hideDeleteButton();
      this.highlightedElement = null;
    }
  }

  enableNodeDragging(): void {
    for (const node of this.nodes) {
      const group = node.getGroup();
      const options = {
        minX: 0,
        minY: 0,
        maxX: this.width,
        maxY: this.height
      };
      group.draggable(options);
    }
  }

  disableNodeDragging(): void {
    for (const node of this.nodes) {
      const group = node.getGroup();
      group.draggable(false);
    }
  }

  moveLinkTextToFront(): void {
    this.ConceptMapService.moveLinkTextToFront(this.links);
  }

  moveNodesToFront(): void {
    this.ConceptMapService.moveNodesToFront(this.nodes);
  }

  addNode(node: any): void {
    this.nodes.push(node);
  }

  removeNode(node: any): void {
    const outgoingLinks = node.getOutgoingLinks();
    let numOutgoingLinks = outgoingLinks.length;
    while (numOutgoingLinks > 0) {
      const outgoingLink = outgoingLinks[0];
      this.removeLink(outgoingLink);
      numOutgoingLinks--;
    }

    const incomingLinks = node.getIncomingLinks();
    let numIncomingLinks = incomingLinks.length;
    while (numIncomingLinks > 0) {
      const incomingLink = incomingLinks[0];
      this.removeLink(incomingLink);
      numIncomingLinks--;
    }

    node.remove();

    for (let n = 0; n < this.nodes.length; n++) {
      const tempNode = this.nodes[n];
      if (tempNode == node) {
        this.nodes.splice(n, 1);
        break;
      }
    }
  }

  removeAllNodes(): void {
    for (const node of this.nodes) {
      node.remove();
    }
    this.nodes = [];
  }

  getNodeById(id: string): any {
    return this.nodes.find((node) => {
      return node.getId() === id;
    });
  }

  getNodeByGroupId(id: string): any {
    return this.nodes.find((node) => {
      return node.getGroupId() === id;
    });
  }

  getLinkById(id: string): any {
    return this.links.find((link) => {
      return link.getId() === id;
    });
  }

  getLinkByGroupId(id: string): any {
    return this.links.find((link) => {
      return link.getGroupId() === id;
    });
  }

  getNodeByConnectorId(id: string): any {
    return this.nodes.find((node) => {
      return node.getConnectorId() === id;
    });
  }

  addLink(link: any): void {
    this.links.push(link);
  }

  removeLink(link: any): void {
    link.remove();
    for (let l = 0; l < this.links.length; l++) {
      const tempLink = this.links[l];
      if (tempLink === link) {
        this.links.splice(l, 1);
        break;
      }
    }
  }

  removeAllLinks(): void {
    for (const link of this.links) {
      link.remove();
    }
    this.links = [];
  }

  nodeMouseOver(event: any): void {
    const groupId = event.target.parentElement.id;
    const node = this.getNodeByGroupId(groupId);
    if (node != null) {
      this.setActiveNode(node);
    }
  }

  nodeMouseOut(event: any): void {
    const groupId = event.target.parentElement.id;
    const node = this.getNodeByGroupId(groupId);
    if (node != null) {
      this.clearActiveNode();
    }
  }

  nodeMouseDown(event: any): void {
    if (event.target.parentElement != null) {
      const groupId = event.target.parentElement.id;
      const node = this.getNodeByGroupId(groupId);
      if (node != null) {
        this.setHighlightedElement(node);
      }
    }
  }

  nodeMouseUp(event: any): void {
    if (this.isReleasingLinkOnToNode()) {
      const targetGroupId = event.target.parentElement.id;
      if (this.activeLink.sourceNode.getGroupId() === targetGroupId) {
        // the source of the link is the same as the destination so we will not create the link
        this.activeLink.remove();
        this.activeLink = null;
      } else {
        const node = this.getNodeByGroupId(targetGroupId);
        this.activeLink.setDestination(node);
        this.addLink(this.activeLink);
        this.setHighlightedElement(this.activeLink);
        this.newlyCreatedLink = this.activeLink;
        this.studentDataChanged();
      }
    }
    this.drawingLink = false;
  }

  isReleasingLinkOnToNode(): boolean {
    return this.drawingLink && this.activeLink != null;
  }

  linkDeleteButtonClicked(event: any, link: any): void {
    this.removeLink(link);
    this.studentDataChanged();
    this.hideLinkTypeChooser();
  }

  connectorMouseDown(event: any) {
    this.drawingLink = true;
    const connector = event.target;
    this.disableNodeDragging();
    const node = this.getNodeByConnectorId(connector.id);
    const link = this.ConceptMapService.newConceptMapLink(
      this.draw,
      this.getNewConceptMapLinkId(),
      null,
      this.getNodeByConnectorId(connector.id)
    );
    this.setLinkMouseEvents(link);
    this.activeLink = link;
    this.linkCurvatureSet = false;
    this.activeLinkStartX = node.connectorCX();
    this.activeLinkStartY = node.connectorCY();
    this.setHighlightedElement(link);
    this.clearActiveNode();
    this.setActiveNode(node);
  }

  setLinkMouseEvents(link: any): void {
    link.setLinkMouseDown((event: any) => {
      this.linkMouseDown(event);
    });

    link.setLinkTextMouseDown((event: any) => {
      this.linkTextMouseDown(event);
    });

    link.setLinkMouseOver((event: any) => {
      this.linkMouseOver(event);
    });

    link.setLinkMouseOut((event: any) => {
      this.linkMouseOut(event);
    });

    link.setDeleteButtonClicked((event: any) => {
      this.linkDeleteButtonClicked(event, link);
    });
  }

  linkMouseDown(event: any): void {
    const groupId = this.getGroupId(event.target);
    const link = this.getLinkByGroupId(groupId);
    this.setHighlightedElement(link);
  }

  linkTextMouseDown(event: any): void {
    let linkGroupId = null;

    // the link group id is set into the text group in the linkGroupId variable. the text group
    // hierarchy looks like this
    // text group > text > tspan
    // text group > rect
    if (event.target.nodeName === 'tspan') {
      linkGroupId = event.target.parentElement.parentElement.linkGroupId;
    } else if (event.target.nodeName === 'text') {
      linkGroupId = event.target.parentElement.linkGroupId;
    } else if (event.target.nodeName === 'rect') {
      linkGroupId = event.target.parentElement.linkGroupId;
    }

    if (linkGroupId != null) {
      const link = this.getLinkByGroupId(linkGroupId);
      this.setHighlightedElement(link);
    }
  }

  linkMouseOver(event: any): void {
    const groupId = this.getGroupId(event.target);
    const link = this.getLinkByGroupId(groupId);
    // When the student first starts creating the link by dragging from the source node, it is
    // possible for them to mouse over the link. At this point the link instance has not been
    // created so getLinkByGroupId() will return null. The link instance is not created until the
    // student drops the end of the link on a destination node.
    if (link != null) {
      link.showDeleteButton();
    }
  }

  linkMouseOut(event: any): void {
    const groupId = this.getGroupId(event.target);
    const link = this.getLinkByGroupId(groupId);
    if (link != null && link != this.highlightedElement) {
      link.hideDeleteButton();
    }
  }

  nodeDeleteButtonMouseDown(event: any): void {
    if (event.target.parentElement != null) {
      const groupId = event.target.parentElement.parentElement.id;
      const node = this.getNodeByGroupId(groupId);
      this.removeNode(node);
      this.studentDataChanged();
    }
  }

  nodeDeleteButtonMouseOver(event: any): void {
    const groupId = event.target.parentElement.parentElement.id;
    const node = this.getNodeByGroupId(groupId);
    this.setActiveNode(node);
  }

  nodeDeleteButtonMouseOut(event: any): void {
    this.clearActiveNode();
  }

  nodeDragMove(event: any): void {
    const groupId = event.target.id;
    const node = this.getNodeByGroupId(groupId);
    if (node != null) {
      node.dragMove(event);
    }
    this.studentDataChanged();
  }

  /**
   * Get the group id of an element. All elements of a node or link are contained in a group. These
   * groups are the children of the main svg element.
   * For example a node's image element will be located here
   * svg > group > image
   * For example a link's path element will be located here
   * svg > group > path
   * @param element get the group id of this element
   * @returns the group id
   */
  getGroupId(element: any): string {
    let groupId = null;
    let currentElement = element;
    let previousId = null;
    while (currentElement != null) {
      if (currentElement.tagName === 'svg') {
        groupId = previousId;
        currentElement = null;
      } else {
        previousId = currentElement.id;
        currentElement = currentElement.parentElement;
      }
    }
    return groupId;
  }

  populateStarterConceptMap(): void {
    if (this.componentContent.starterConceptMap != null) {
      this.populateConceptMapData(this.componentContent.starterConceptMap);
    }
  }

  clearConceptMap(): void {
    this.removeAllLinks();
    this.removeAllNodes();
  }

  /**
   * Clear the concept map and populate the starter concept map and background if available.
   */
  resetConceptMap(): void {
    const message = $localize`Are you sure you want to reset your work?`;
    if (confirm(message)) {
      this.clearConceptMap();
      if (this.component.hasConnectedComponent()) {
        this.handleConnectedComponents();
      } else if (this.componentContent.starterConceptMap != null) {
        const conceptMapData = this.componentContent.starterConceptMap;
        this.populateConceptMapData(conceptMapData);
      }
      if (this.isBackgroundAvailable(this.componentContent)) {
        this.setBackground(
          this.componentContent.background,
          this.componentContent.stretchBackground
        );
      }
    }
  }

  snipImage(): void {
    const svgElement = this.getElementById(this.ConceptMapService.getSVGId(this.domIdEnding), true);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    this.ConceptMapService.getHrefToBase64ImageReplacements(svgString).then((images) => {
      const updatedSvgString = this.replaceImageRefsWithBase64Images(svgString, images);
      this.createNoteFromSvg(updatedSvgString);
    });
  }

  replaceImageRefsWithBase64Images(svgString: string, images: any[]): string {
    let updatedSvgString = svgString;
    for (const imagePair of images) {
      const imageHref = imagePair.imageHref;
      const base64Image = imagePair.base64Image;
      const imageRegEx = new RegExp(imageHref, 'g');
      updatedSvgString = updatedSvgString.replace(imageRegEx, base64Image);
    }
    return updatedSvgString;
  }

  createNoteFromSvg(svgString: string): void {
    const myCanvas = document.createElement('canvas');
    const ctx = myCanvas.getContext('2d');
    const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const domURL: any = self.URL || (self as any).webkitURL || self;
    const url = domURL.createObjectURL(svg);
    const image = new Image();
    const thisUtilService = this.UtilService;
    image.onload = (event) => {
      const image: any = event.target;
      myCanvas.width = image.width;
      myCanvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      const base64Image = myCanvas.toDataURL('image/png');
      const imageObject = thisUtilService.getImageObjectFromBase64String(base64Image);
      this.NotebookService.addNote(this.StudentDataService.getCurrentNodeId(), imageObject);
    };
    image.src = url;
  }

  /**
   * Create a component state with the merged student responses
   * @param componentStates an array of component states
   * @return a component state with the merged student responses
   */
  createMergedComponentState(componentStates: any[]): any {
    let componentStateToMergeInto: any = this.createNewComponentState();
    componentStateToMergeInto.studentData = {
      conceptMapData: {
        background: null,
        backgroundPath: null,
        links: [],
        nodes: [],
        stretchBackground: null
      }
    };
    for (const componentState of componentStates) {
      if (componentState.componentType === 'ConceptMap') {
        this.mergeConceptMapComponentState(componentStateToMergeInto, componentState);
      } else if (this.componentTypesCanImportAsBackground.includes(componentState.componentType)) {
        this.mergeOtherComponentState(componentState);
      }
    }
    if (this.isBackgroundAvailable(this.componentContent)) {
      const conceptMapData = componentStateToMergeInto.studentData.conceptMapData;
      conceptMapData.backgroundPath = this.componentContent.background;
      conceptMapData.stretchBackground = this.componentContent.stretchBackground;
    }
    componentStateToMergeInto = this.ProjectService.injectAssetPaths(componentStateToMergeInto);
    return componentStateToMergeInto;
  }

  mergeConceptMapComponentState(componentStateToMergeInto: any, componentStateToMerge: any): any {
    const componentStateToMergeCopy = this.makeIdsUnique(
      this.UtilService.makeCopyOfJSONObject(componentStateToMerge)
    );
    const studentData = componentStateToMergeCopy.studentData;
    const conceptMapData = studentData.conceptMapData;
    const nodes = conceptMapData.nodes;
    const links = conceptMapData.links;
    const conceptMapDataToMergeInto = componentStateToMergeInto.studentData.conceptMapData;
    conceptMapDataToMergeInto.nodes.push(...nodes);
    conceptMapDataToMergeInto.links.push(...links);
    conceptMapDataToMergeInto.background = conceptMapData.background;
    conceptMapDataToMergeInto.backgroundPath = conceptMapData.backgroundPath;
    conceptMapDataToMergeInto.stretchBackground = conceptMapData.stretchBackground;
  }

  makeIdsUnique(componentState: any): any {
    const nodeId = componentState.nodeId;
    const componentId = componentState.componentId;
    const conceptMapData = componentState.studentData.conceptMapData;
    const nodes = conceptMapData.nodes;
    const links = conceptMapData.links;
    for (const node of nodes) {
      node.instanceId = `${node.instanceId}-${nodeId}-${componentId}`;
    }
    for (const link of links) {
      link.instanceId = `${link.instanceId}-${nodeId}-${componentId}`;
      link.destinationNodeInstanceId = `${link.destinationNodeInstanceId}-${nodeId}-${componentId}`;
      link.sourceNodeInstanceId = `${link.sourceNodeInstanceId}-${nodeId}-${componentId}`;
    }
    return componentState;
  }

  mergeOtherComponentState(componentState: any): any {
    const connectedComponent = this.UtilService.getConnectedComponentByComponentState(
      this.componentContent,
      componentState
    );
    if (connectedComponent.importWorkAsBackground === true) {
      this.setComponentStateAsBackgroundImage(componentState);
    }
  }

  setBackgroundImage(image: string): void {
    this.setBackground(image, false);
  }

  isBackgroundAvailable(componentContent: any): boolean {
    return componentContent.background != null && componentContent.background != '';
  }

  setBackground(backgroundPath: string, stretchBackground: boolean): void {
    this.background = backgroundPath;
    this.setBackgroundUrl(backgroundPath);
    this.stretchBackground = stretchBackground;
    this.setBackgroundSize(stretchBackground);
  }

  setBackgroundUrl(backgroundPath: string): void {
    if (backgroundPath == null || backgroundPath === '') {
      this.backgroundUrl = '';
    } else {
      this.backgroundUrl = `url("${backgroundPath}")`;
    }
  }

  setBackgroundSize(isStretchBackground: boolean): void {
    if (isStretchBackground) {
      this.backgroundSize = '100% 100%';
    } else {
      this.backgroundSize = '';
    }
  }

  deleteBackgroundImage(): void {
    this.background = null;
  }

  generateStarterState(): any {
    return this.getConceptMapData();
  }

  attachStudentAsset(studentAsset: any): void {
    this.setBackground(studentAsset.url, false);
  }
}
