import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
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
  protected idToNode: any = {};
  @Input() lesson: any;
  protected nodeTypeSelected: Signal<NodeTypeSelected>;
  @Input() projectId: number;
  @Output() selectNodeEvent: EventEmitter<SelectNodeEvent> = new EventEmitter<SelectNodeEvent>();
  @Input() showPosition: boolean;

  constructor(
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.idToNode = this.projectService.idToNode;
    this.nodeTypeSelected = this.projectService.getNodeTypeSelected();
  }

  protected selectNode(checked: boolean): void {
    this.projectService.setNodeTypeSelected(checked ? NodeTypeSelected.lesson : null);
    this.selectNodeEvent.emit({ id: this.lesson.id, checked: checked });
  }

  protected setCurrentNode(nodeId: string): void {
    this.dataService.setCurrentNodeByNodeId(nodeId);
  }
}
