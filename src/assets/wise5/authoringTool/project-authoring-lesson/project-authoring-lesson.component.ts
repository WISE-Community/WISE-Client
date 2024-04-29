import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';
import { ExpandEvent } from '../domain/expand-event';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';

@Component({
  selector: 'project-authoring-lesson',
  templateUrl: './project-authoring-lesson.component.html',
  styleUrls: ['./project-authoring-lesson.component.scss']
})
export class ProjectAuthoringLessonComponent {
  @Input() expanded: boolean = true;
  @Output() onExpandedChanged: EventEmitter<ExpandEvent> = new EventEmitter<ExpandEvent>();
  protected idToNode: any = {};
  @Input() lesson: any;
  protected nodeTypeSelected: Signal<NodeTypeSelected>;
  @Input() projectId: number;
  @Output() selectNodeEvent: EventEmitter<SelectNodeEvent> = new EventEmitter<SelectNodeEvent>();
  @Input() showPosition: boolean;

  constructor(
    private dataService: TeacherDataService,
    private deleteNodeService: DeleteNodeService,
    private deleteTranslationsService: DeleteTranslationsService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
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

  protected toggleExpanded(): void {
    this.expanded = !this.expanded;
    this.onExpandedChanged.emit({ id: this.lesson.id, expanded: this.expanded });
  }

  protected move(): void {
    this.router.navigate(['choose-move-location'], {
      relativeTo: this.route,
      state: { selectedNodeIds: [this.lesson.id] }
    });
  }

  protected delete(): void {
    if (confirm($localize`Are you sure you want to delete this lesson?`)) {
      const components = this.lesson.ids.flatMap(
        (nodeId) => this.projectService.getNodeById(nodeId).components
      ); // get the components before they're removed by the following line
      this.deleteNodeService.deleteNode(this.lesson.id);
      this.saveAndRefreshProject();
      if (this.projectService.getLocale().hasTranslations()) {
        this.deleteTranslationsService.deleteComponents(components);
      }
    }
  }

  protected addStepInside(nodeId: string): void {
    this.router.navigate(['add-node', 'choose-template'], {
      relativeTo: this.route,
      state: {
        targetId: nodeId
      }
    });
  }

  private saveAndRefreshProject(): void {
    this.projectService.saveProject();
    this.projectService.refreshProject();
  }
}
