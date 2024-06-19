import { Component, Input, SimpleChanges } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { WiseLinkService } from '../../../../app/services/wiseLinkService';
import { ConfigService } from '../../services/configService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../../vle/vleProjectService';
import { CommonModule } from '@angular/common';
import { SaveTimeMessageComponent } from '../../common/save-time-message/save-time-message.component';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatCardModule, MatIconModule, SaveTimeMessageComponent],
  selector: 'component-annotations',
  standalone: true,
  styleUrl: 'component-annotations.component.scss',
  templateUrl: 'component-annotations.component.html'
})
export class ComponentAnnotationsComponent {
  @Input() annotations: any;
  protected comment: SafeHtml;
  @Input() componentId: string;
  protected icon: string = 'person';
  protected label: string;
  protected latestAnnotationTime: any = null;
  @Input() maxScore: string;
  protected maxScoreDisplay: string;
  @Input() nodeId: string;
  protected showComment: boolean = true;
  protected showScore: boolean = true;

  constructor(
    private configService: ConfigService,
    private dataService: StudentDataService,
    private projectService: VLEProjectService,
    private wiseLinkService: WiseLinkService
  ) {}

  ngOnInit(): void {
    this.maxScoreDisplay = parseInt(this.maxScore) > 0 ? '/' + this.maxScore : '';
    this.processAnnotations();
  }

  ngAfterViewInit(): void {
    this.processAnnotations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.annotations.isFirstChange()) {
      this.processAnnotations();
    }
  }

  private processAnnotations(): void {
    if (this.annotations.comment || this.annotations.score) {
      this.nodeId = this.getNodeId(this.annotations);
      this.componentId = this.getComponentId(this.annotations);
      this.showScore = this.isShowScore(this.annotations);
      this.showComment = this.isShowComment(this.annotations);
      if (this.showComment) {
        this.comment = this.getCommentHtml(this.annotations.comment);
      }
      this.setLabelAndIcon();
    }
    this.latestAnnotationTime = this.getLatestAnnotationTime();
  }

  private getNodeId(annotations: any): string {
    return this.hasCommentAnnotation(annotations)
      ? annotations.comment.nodeId
      : annotations.score.nodeId;
  }

  private getComponentId(annotations: any): string {
    return this.hasCommentAnnotation(annotations)
      ? annotations.comment.componentId
      : annotations.score.componentId;
  }

  private isShowScore(annotations: any): boolean {
    return (
      this.hasScoreAnnotation(annotations) &&
      this.projectService.displayAnnotation(annotations.score)
    );
  }

  private isShowComment(annotations: any): boolean {
    return (
      this.hasCommentAnnotation(annotations) &&
      this.projectService.displayAnnotation(this.annotations.comment)
    );
  }

  private hasCommentAnnotation(annotations: any): boolean {
    return annotations.comment != null;
  }

  private hasScoreAnnotation(annotations: any): boolean {
    return annotations.score != null;
  }

  private getCommentHtml(commentAnnotation: any): SafeHtml {
    return this.wiseLinkService.generateHtmlWithWiseLink(commentAnnotation.data.value);
  }

  private getLatestAnnotation(): any {
    let latest = null;
    if (this.annotations.comment || this.annotations.score) {
      const commentSaveTime = this.getSaveTime(this.annotations.comment);
      const scoreSaveTime = this.getSaveTime(this.annotations.score);
      if (commentSaveTime >= scoreSaveTime) {
        latest = this.annotations.comment;
      } else if (scoreSaveTime > commentSaveTime) {
        latest = this.annotations.score;
      }
    }
    return latest;
  }

  private getSaveTime(annotation: any): number {
    let saveTime = null;
    if (annotation != null) {
      if (annotation.serverSaveTime != null) {
        saveTime = annotation.serverSaveTime;
      }
      if (annotation.clientSaveTime != null) {
        saveTime = annotation.clientSaveTime;
      }
    }
    return saveTime;
  }

  private getLatestAnnotationTime(): any {
    const latest = this.getLatestAnnotation();
    if (latest) {
      return this.configService.convertToClientTimestamp(this.getSaveTime(latest));
    }
    return null;
  }

  private getLatestVisitTime(): any {
    let nodeEvents = this.dataService.getEventsByNodeId(this.nodeId);
    let n = nodeEvents.length - 1;
    let visitTime = null;
    for (let i = n; i > 0; i--) {
      let event = nodeEvents[i];
      if (event.event === 'nodeExited') {
        visitTime = this.configService.convertToClientTimestamp(event.serverSaveTime);
        break;
      }
    }
    return visitTime;
  }

  private getLatestSaveTime(): any {
    const latestState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    let saveTime = null;
    if (latestState) {
      saveTime = this.configService.convertToClientTimestamp(this.getSaveTime(latestState));
    }
    return saveTime;
  }

  protected isNewAnnotation(): boolean {
    let latestVisitTime = this.getLatestVisitTime();
    let latestSaveTime = this.getLatestSaveTime();
    let latestAnnotationTime = this.getLatestAnnotationTime();
    let isNew = true;
    if (latestVisitTime && latestVisitTime > latestAnnotationTime) {
      isNew = false;
    }
    if (latestSaveTime && latestSaveTime > latestAnnotationTime) {
      isNew = false;
    }
    return isNew;
  }

  private setLabelAndIcon(): void {
    const latest = this.getLatestAnnotation();
    if (latest) {
      if (latest.type === 'autoComment' || latest.type === 'autoScore') {
        this.label = $localize`Feedback`;
        this.icon = 'message';
      } else {
        this.label = $localize`Teacher Feedback`;
        this.icon = 'person';
      }
    }
  }
}
