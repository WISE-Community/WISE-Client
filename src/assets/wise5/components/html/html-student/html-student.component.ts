import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';

@Component({
  selector: 'html-student',
  templateUrl: 'html-student.component.html'
})
export class HtmlStudent extends ComponentStudent {
  html: SafeHtml = '';
  htmlDiv: any;
  wiseLinkClickedHandler: any;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    private sanitizer: DomSanitizer,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      NodeService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.html = this.sanitizer.bypassSecurityTrustHtml(
      this.UtilService.replaceDivReference(
        this.UtilService.replaceWISELinks(this.componentContent.html),
        this.componentId
      )
    );
    if (!this.isAuthoringComponentPreviewMode()) {
      this.setupWiseLinkClickedListener();
    }
    this.broadcastDoneRenderingComponent();
  }

  ngAfterViewInit() {
    this.htmlDiv = document.getElementById(`html-${this.componentId}`);
    this.htmlDiv.addEventListener('wiselinkclicked', this.wiseLinkClickedHandler);
  }

  setupWiseLinkClickedListener(): void {
    // Create the wiseLinkClickedHandler and keep a reference to it so we can remove the event
    // listener in ngOnDestroy. The removeEventListener matches the event name and callback function
    // to remove the listener. If we use an anonymous function, it won't be able to remove the
    // event listener.
    this.wiseLinkClickedHandler = this.createWiseLinkClickedHandler();
  }

  createWiseLinkClickedHandler(): any {
    return (event: CustomEvent) => {
      this.followLink(event.detail.nodeId, event.detail.componentId);
    };
  }

  ngOnDestroy(): void {
    if (this.wiseLinkClickedHandler != null) {
      this.htmlDiv.removeEventListener('wiselinkclicked', this.wiseLinkClickedHandler);
    }
  }

  followLink(nodeId: string, componentId: string): void {
    if (this.isLinkToComponentInStep(nodeId)) {
      this.NodeService.scrollToComponentAndHighlight(componentId);
    } else {
      this.goToNode(nodeId, componentId);
    }
  }

  isLinkToComponentInStep(nodeId: string): boolean {
    return nodeId === this.nodeId;
  }

  goToNode(nodeId: string, componentId: string): void {
    if (componentId !== '') {
      this.NodeService.registerScrollToComponent(componentId);
    }
    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nodeId);
  }
}
