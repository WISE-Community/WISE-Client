import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { scrollToElement, temporarilyHighlightElement } from '../../../../common/dom/dom';
import { ConstraintsAuthoringComponent } from '../../../constraint/constraints-authoring/constraints-authoring.component';
import { ActivatedRoute } from '@angular/router';
import { Constraint } from '../../../../../../app/domain/constraint';

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
    this.route.parent.parent.params.subscribe((params) => {
      const node = this.projectService.getNodeById(params.nodeId);
      if (node.constraints == null) {
        node.constraints = [];
      }
      this.content = node;
    });
  }

  protected addConstraint(): Constraint {
    const constraint = super.addConstraint();
    constraint.targetId = this.content.id;
    setTimeout(() => {
      scrollToElement('bottom');
      temporarilyHighlightElement(constraint.id);
    });
    return constraint;
  }
}
