import { Component, Input } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { CommonModule } from '@angular/common';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { DetectedIdeasComponent } from '../../dialogGuidance/detected-ideas/detected-ideas.component';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { AnnotationService } from '../../../services/annotationService';
import { Annotation } from '../../../common/Annotation';
import { ShowCRaterRubricComponent } from '../../../../../app/classroom-monitor/show-crater-rubric/show-crater-rubric.component';
import { UserService } from '../../../../../app/services/user.service';

@Component({
  imports: [CommonModule, DetectedIdeasComponent, ShowCRaterRubricComponent],
  selector: 'open-response-show-work',
  templateUrl: 'open-response-show-work.component.html'
})
export class OpenResponseShowWorkComponent extends ComponentShowWorkDirective {
  private annotations: Annotation[] = [];
  protected audioAttachments: any[] = [];
  private cRaterAnnotation: Annotation;
  protected cRaterRubric: CRaterRubric;
  protected otherAttachments: any[] = [];
  protected showDetectedIdeas: boolean = false;
  protected studentResponse: string = '';

  constructor(
    private annotationService: AnnotationService,
    nodeService: NodeService,
    projectService: ProjectService,
    protected userService: UserService
  ) {
    super(nodeService, projectService);
  }

  ngOnInit(): void {
    if (this.componentState != null && this.componentState !== '') {
      this.studentResponse = this.componentState.studentData.response;
      this.componentContent = this.projectService.getComponent(this.nodeId, this.componentId);
      if (this.componentContent.cRater) {
        this.cRaterRubric = new CRaterRubric(this.componentContent.cRater.rubric);
        this.annotations = this.annotationService.getAnnotationsByStudentWorkId(
          this.componentState.id
        );
        this.cRaterAnnotation = this.annotations.find((annotation) => annotation.type === 'autoScore' && annotation.data.ideas);
      }
      this.showDetectedIdeas =
        this.userService.isTeacher() &&
        this.cRaterRubric?.ideas.length &&
        this.cRaterAnnotation != null;
      this.processAttachments();
    }
  }

  private processAttachments(): void {
    this.componentState.studentData.attachments.forEach((attachment: any) => {
      if (attachment.type === 'audio') {
        this.audioAttachments.push(attachment);
      } else {
        this.otherAttachments.push(attachment);
      }
    });
  }
}
