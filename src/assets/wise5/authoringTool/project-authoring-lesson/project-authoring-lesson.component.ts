import {
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { ProjectAuthoringStepComponent } from '../project-authoring-step/project-authoring-step.component';
import { AddStepButtonComponent } from '../add-step-button/add-step-button.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { SelectNodeEvent } from '../domain/select-node-event';
import { NodeTypeSelected } from '../domain/node-type-selected';
import { ExpandEvent } from '../domain/expand-event';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { AddStepTarget } from '../../../../app/domain/addStepTarget';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    NodeIconAndTitleComponent,
    ProjectAuthoringStepComponent,
    AddStepButtonComponent
  ],
  selector: 'project-authoring-lesson',
  styleUrl: './project-authoring-lesson.component.scss',
  templateUrl: './project-authoring-lesson.component.html'
})
export class ProjectAuthoringLessonComponent {
  private dataService = inject(TeacherDataService);
  private deleteNodeService = inject(DeleteNodeService);
  private deleteTranslationsService = inject(DeleteTranslationsService);
  private projectService = inject(TeacherProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @Input() expanded: boolean = true;
  @Output() onExpandedChanged: EventEmitter<ExpandEvent> = new EventEmitter<ExpandEvent>();
  protected idToNode: any = {};
  @Input() lesson: any;
  protected nodeTypeSelected: Signal<NodeTypeSelected>;
  @Input() projectId: number;
  @Output() selectNodeEvent: EventEmitter<SelectNodeEvent> = new EventEmitter<SelectNodeEvent>();
  @Input() showPosition: boolean;

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

  protected toggleExpanded(opened: boolean = true): void {
    this.expanded = opened;
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
      const components = this.projectService.getComponentsFromLesson(this.lesson.id);
      this.deleteNodeService.deleteNode(this.lesson.id);
      this.saveAndRefreshProject();
      this.deleteTranslationsService.tryDeleteComponents(components);
    }
  }

  protected addStepInside(groupId: string): void {
    this.router.navigate(['add-node', 'choose-template'], {
      relativeTo: this.route,
      state: new AddStepTarget('in', groupId)
    });
  }

  private saveAndRefreshProject(): void {
    this.projectService.saveProject();
    this.projectService.refreshProject();
  }
}
