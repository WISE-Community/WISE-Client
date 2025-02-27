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
  selector: 'component-class-responses',
  templateUrl: './component-class-responses.component.html'
})
export class ComponentClassResponsesComponent extends AbstractClassResponsesComponent {
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
        ?.data.value ?? null
    );
  }

  protected hasWork(): boolean {
    return this.projectService.componentHasWork(this.component);
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

  protected isCompleted(workgroupId: number, nodeStatus: any): boolean {
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
