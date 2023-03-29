import { Component } from '@angular/core';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { temporarilyHighlightElement } from '../../../../common/dom/dom';
import { ConstraintsAuthoringComponent } from '../../../constraint/constraints-authoring/constraints-authoring.component';

@Component({
  selector: 'node-advanced-constraint-authoring',
  templateUrl: 'node-advanced-constraint-authoring.component.html',
  styleUrls: ['node-advanced-constraint-authoring.component.scss']
})
export class NodeAdvancedConstraintAuthoringComponent extends ConstraintsAuthoringComponent {
  constructor(
    private dataService: TeacherDataService,
    protected projectService: TeacherProjectService
  ) {
    super(projectService);
  }

  ngOnInit() {
    const node = this.projectService.getNodeById(this.dataService.getCurrentNodeId());
    if (node.constraints == null) {
      node.constraints = [];
    }
    this.content = node;
  }

  protected addConstraintAndScrollToBottom(): void {
    const newNodeConstraintId = this.addConstraint();
    setTimeout(() => {
      this.projectService.scrollToBottomOfPage();
      temporarilyHighlightElement(newNodeConstraintId);
    });
  }
}
