import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { EmbeddedService } from '../embeddedService';

@Component({
  selector: 'embedded-show-work',
  templateUrl: 'embedded-show-work.component.html'
})
export class EmbeddedShowWorkComponent extends ComponentShowWorkDirective {
  embeddedApplicationIFrameId: string;
  url: any;
  width: string = this.EmbeddedService.defaultWidth;
  height: string = this.EmbeddedService.defaultHeight;
  messageEventListener: any;

  constructor(
    private AnnotationService: AnnotationService,
    private ConfigService: ConfigService,
    private EmbeddedService: EmbeddedService,
    protected nodeService: NodeService,
    protected ProjectService: ProjectService,
    private sanitizer: DomSanitizer
  ) {
    super(nodeService, ProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.embeddedApplicationIFrameId = this.getIframeId();
    this.setHeight(this.componentContent);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.componentContent.url);
    this.initializeMessageEventListener();
  }

  getIframeId(): string {
    return this.getIframeIdPrefix() + this.componentState.id;
  }

  getIframeIdPrefix(): string {
    if (this.isRevision) {
      return `${this.EmbeddedService.iframePrefix}-revision-${this.componentId}`;
    } else {
      return this.EmbeddedService.getEmbeddedApplicationIframeId(this.componentId);
    }
  }

  setHeight(componentContent: any): void {
    this.height = componentContent.height + 'px';
  }

  iframeLoaded(): void {
    (window.document.getElementById(
      this.embeddedApplicationIFrameId
    ) as HTMLIFrameElement).contentWindow.addEventListener('message', this.messageEventListener);
  }

  sendMessageToApplication(message: any): void {
    this.EmbeddedService.sendMessageToApplication(this.embeddedApplicationIFrameId, message);
  }

  initializeMessageEventListener(): void {
    this.messageEventListener = (messageEvent: any) => {
      const messageEventData = messageEvent.data;
      if (messageEventData.messageType === 'applicationInitialized') {
        this.handleApplicationInitializedMessage();
      } else if (messageEventData.messageType === 'getParameters') {
        this.handleGetParametersMessage();
      } else if (messageEventData.messageType === 'getLatestStudentWork') {
        this.handleGetLatestStudentWorkMessage();
      } else if (messageEventData.messageType === 'getProjectPath') {
        this.handleGetProjectPathMessage();
      } else if (messageEventData.messageType === 'getLatestAnnotations') {
        this.handleGetLatestAnnotationsMessage();
      }
    };
  }

  handleApplicationInitializedMessage(): void {
    this.sendLatestWorkToApplication();
  }

  sendLatestWorkToApplication(): void {
    const message = {
      messageType: 'componentState',
      componentState: this.componentState
    };
    this.sendMessageToApplication(message);
  }

  handleGetParametersMessage(): void {
    this.EmbeddedService.handleGetParametersMessage(
      this.embeddedApplicationIFrameId,
      this.nodeId,
      this.componentId,
      this.componentContent
    );
  }

  handleGetLatestStudentWorkMessage(): void {
    this.sendMessageToApplication(
      this.EmbeddedService.createLatestStudentWorkMessage(this.componentState)
    );
  }

  handleGetProjectPathMessage(): void {
    this.sendMessageToApplication(this.EmbeddedService.createProjectPathMessage());
  }

  handleGetLatestAnnotationsMessage(): void {
    const workgroupId = this.ConfigService.getWorkgroupId();
    const type = 'any';
    const latestScoreAnnotation = this.AnnotationService.getLatestScoreAnnotation(
      this.nodeId,
      this.componentId,
      workgroupId,
      type
    );
    const latestCommentAnnotation = this.AnnotationService.getLatestCommentAnnotation(
      this.nodeId,
      this.componentId,
      workgroupId,
      type
    );
    const message = {
      messageType: 'latestAnnotations',
      latestScoreAnnotation: latestScoreAnnotation,
      latestCommentAnnotation: latestCommentAnnotation
    };
    this.sendMessageToApplication(message);
  }
}
