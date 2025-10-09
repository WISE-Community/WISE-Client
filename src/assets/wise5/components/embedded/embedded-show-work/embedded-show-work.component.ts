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
  template: `<iframe
    [id]="embeddedApplicationIFrameId"
    [src]="url"
    (load)="iframeLoaded()"
    class="embedded-content__iframe"
    style="width: 100%; height: {{ height }};"
  ></iframe>`
})
export class EmbeddedShowWorkComponent extends ComponentShowWorkDirective {
  protected embeddedApplicationIFrameId: string;
  protected height: string = this.embeddedService.defaultHeight;
  private messageEventListener: any;
  protected url: any;

  constructor(
    private annotationService: AnnotationService,
    private configService: ConfigService,
    private embeddedService: EmbeddedService,
    protected nodeService: NodeService,
    protected projectService: ProjectService,
    private sanitizer: DomSanitizer
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.embeddedApplicationIFrameId = this.getIframeId();
    this.setHeight(this.componentContent);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.componentContent.url);
    this.initializeMessageEventListener();
  }

  private getIframeId(): string {
    return this.getIframeIdPrefix() + this.componentState.id;
  }

  private getIframeIdPrefix(): string {
    if (this.isRevision) {
      return `${this.embeddedService.iframePrefix}-revision-${this.componentId}`;
    } else {
      return this.embeddedService.getEmbeddedApplicationIframeId(this.componentId);
    }
  }

  private setHeight(componentContent: any): void {
    this.height = componentContent.height + 'px';
  }

  protected iframeLoaded(): void {
    (
      window.document.getElementById(this.embeddedApplicationIFrameId) as HTMLIFrameElement
    ).contentWindow.addEventListener('message', this.messageEventListener);
  }

  sendMessageToApplication(message: any): void {
    this.embeddedService.sendMessageToApplication(this.embeddedApplicationIFrameId, message);
  }

  private initializeMessageEventListener(): void {
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
    this.embeddedService.handleGetParametersMessage(
      this.embeddedApplicationIFrameId,
      this.nodeId,
      this.componentId,
      this.componentContent
    );
  }

  handleGetLatestStudentWorkMessage(): void {
    this.sendMessageToApplication(
      this.embeddedService.createLatestStudentWorkMessage(this.componentState)
    );
  }

  handleGetProjectPathMessage(): void {
    this.sendMessageToApplication(this.embeddedService.createProjectPathMessage());
  }

  handleGetLatestAnnotationsMessage(): void {
    const workgroupId = this.configService.getWorkgroupId();
    const type = 'any';
    const latestScoreAnnotation = this.annotationService.getLatestScoreAnnotation(
      this.nodeId,
      this.componentId,
      workgroupId,
      type
    );
    const latestCommentAnnotation = this.annotationService.getLatestCommentAnnotation(
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
