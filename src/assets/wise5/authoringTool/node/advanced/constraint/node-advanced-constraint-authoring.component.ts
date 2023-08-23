import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { temporarilyHighlightElement } from '../../../../common/dom/dom';
import { ConstraintsAuthoringComponent } from '../../../constraint/constraints-authoring/constraints-authoring.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'node-advanced-constraint-authoring',
  templateUrl: 'node-advanced-constraint-authoring.component.html',
  styleUrls: ['node-advanced-constraint-authoring.component.scss']
})
export class NodeAdvancedConstraintAuthoringComponent extends ConstraintsAuthoringComponent {
  constructor(protected projectService: TeacherProjectService, private route: ActivatedRoute) {
    super(projectService);
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params) => {
      const node = this.projectService.getNodeById(params.nodeId);
      if (node.constraints == null) {
        node.constraints = [];
      }
      this.content = node;
    });
  }

  protected addConstraintAndScrollToBottom(): void {
    const constraint = this.addConstraint();
    constraint.targetId = this.content.id;
    setTimeout(() => {
      this.projectService.scrollToBottomOfPage();
      temporarilyHighlightElement(constraint.id);
    });
  }
}
