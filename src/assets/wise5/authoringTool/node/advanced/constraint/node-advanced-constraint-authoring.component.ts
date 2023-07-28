import { Component } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { temporarilyHighlightElement } from '../../../../common/dom/dom';
import { ConstraintsAuthoringComponent } from '../../../constraint/constraints-authoring/constraints-authoring.component';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'node-advanced-constraint-authoring',
  templateUrl: 'node-advanced-constraint-authoring.component.html',
  styleUrls: ['node-advanced-constraint-authoring.component.scss']
})
export class NodeAdvancedConstraintAuthoringComponent extends ConstraintsAuthoringComponent {
  constructor(protected projectService: TeacherProjectService, private upgrade: UpgradeModule) {
    super(projectService);
  }

  ngOnInit() {
    const node = this.projectService.getNodeById(this.upgrade.$injector.get('$stateParams').nodeId);
    if (node.constraints == null) {
      node.constraints = [];
    }
    this.content = node;
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
