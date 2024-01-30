import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherDataService } from '../../services/teacherDataService';

@Component({
  selector: 'project-authoring-lesson',
  templateUrl: './project-authoring-lesson.component.html',
  styleUrls: ['./project-authoring-lesson.component.scss']
})
export class ProjectAuthoringLessonComponent {
  @Input() disableSelection: boolean = false;
  @Input() item: any;
  @Output() selectNodeEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() showPosition: boolean;

  constructor(private dataService: TeacherDataService) {}

  protected setCurrentNode(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
  }
}
