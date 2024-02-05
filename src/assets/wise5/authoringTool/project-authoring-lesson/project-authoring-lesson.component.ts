import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';

@Component({
  selector: 'project-authoring-lesson',
  templateUrl: './project-authoring-lesson.component.html',
  styleUrls: ['./project-authoring-lesson.component.scss']
})
export class ProjectAuthoringLessonComponent {
  checked: boolean = false;
  idToNode: any = {};
  @Input() lesson: any;
  @Input() nodeTypeSelected: NodeTypeSelected;
  @Input() projectId: number;
  @Output() selectNodeEvent: EventEmitter<SelectNodeEvent> = new EventEmitter<SelectNodeEvent>();
  @Input() showPosition: boolean;

  constructor(
    private dataService: TeacherDataService,
    private teacherProjectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.idToNode = this.teacherProjectService.idToNode;
  }

  protected setCurrentNode(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
  }
}
