import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { TeacherDataService } from '../../../services/teacherDataService';
import { Node } from '../../../common/Node';
import { ConfigService } from '../../../services/configService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { AnnotationService } from '../../../services/annotationService';
import { NotificationService } from '../../../services/notificationService';
import { CompletionStatus } from '../shared/CompletionStatus';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ComponentWorkgroupItemComponent } from '../component-workgroup-item/component-workgroup-item.component';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { AbstractClassResponsesComponent } from '../AbstractClassResponseComponent';

@Component({
  imports: [
    CommonModule,
    ComponentWorkgroupItemComponent,
    FlexLayoutModule,
    IntersectionObserverModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    WorkgroupSelectAutocompleteComponent
  ],
  selector: 'class-responses',
  templateUrl: './class-responses.component.html'
})
export class ClassResponsesComponent extends AbstractClassResponsesComponent {
  @Input() component: any;
  @Input() node: Node;

  constructor(
    protected annotationService: AnnotationService,
    protected classroomStatusService: ClassroomStatusService,
    private componentServiceLookupService: ComponentServiceLookupService,
    protected configService: ConfigService,
    protected dataService: TeacherDataService,
    protected notificationService: NotificationService,
    protected projectService: TeacherProjectService
  ) {
    super(
      annotationService,
      classroomStatusService,
      configService,
      dataService,
      notificationService,
      projectService
    );
  }

  ngOnInit(): void {
    this.retrieveStudentData(this.node);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.component) {
      this.collapseAll();
      this.setWorkgroupsById();
    }
  }

  protected getWorkgroupScore(workgroupId: number): any {
    return (
      this.annotationService.getLatestScoreAnnotation(this.node.id, this.component.id, workgroupId)
        ?.data.value ?? '-'
    );
  }

  protected getCompletionStatusByWorkgroupId(workgroupId: number): CompletionStatus {
    const completionStatus: CompletionStatus = {
      isCompleted: false,
      isVisible: false,
      latestWorkTime: null,
      latestAnnotationTime: null
    };
    const studentStatus = this.classroomStatusService.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus != null) {
      const nodeStatus = studentStatus.nodeStatuses[this.node.id];
      if (nodeStatus) {
        completionStatus.isVisible = nodeStatus.isVisible;
        completionStatus.latestWorkTime = this.getLatestWorkTimeByWorkgroupId(workgroupId);
        completionStatus.latestAnnotationTime =
          this.getLatestAnnotationTimeByWorkgroupId(workgroupId);
        if (!this.projectService.componentHasWork(this.component)) {
          completionStatus.isCompleted = nodeStatus.isVisited;
        }
        if (completionStatus.latestWorkTime) {
          completionStatus.isCompleted = this.isCompleted(workgroupId);
        }
      }
    }
    return completionStatus;
  }

  protected getComponentStates(): any[] {
    return this.dataService.getComponentStatesByComponentId(this.component.id);
  }

  protected isAnnotationForWorkgroup(annotation: any, workgroupId: number): boolean {
    return (
      super.isAnnotationForWorkgroup(annotation, workgroupId) &&
      annotation.componentId === this.component.id
    );
  }

  private isCompleted(workgroupId: number): boolean {
    const service = this.componentServiceLookupService.getService(this.component.type);
    const workgroupComponentStates = this.dataService.getComponentStatesByWorkgroupIdAndComponentId(
      workgroupId,
      this.component.id
    );
    return ['OpenResponse', 'Discussion'].includes(this.component.type)
      ? service.isCompletedV2(this.node, this.component, {
          componentStates: workgroupComponentStates
        })
      : service.isCompleted(
          this.component,
          workgroupComponentStates,
          this.dataService.getEventsByNodeId(this.node.id),
          this.node
        );
  }
}
