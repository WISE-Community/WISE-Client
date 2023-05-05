import { Component, OnInit } from '@angular/core';
import { Node } from '../../../../common/Node';
import { UpgradeModule } from '@angular/upgrade/static';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  selector: 'node-advanced-authoring',
  templateUrl: './node-advanced-authoring.component.html',
  styleUrls: ['./node-advanced-authoring.component.scss']
})
export class NodeAdvancedAuthoringComponent implements OnInit {
  isGroupNode: boolean;
  node: Node;
  $state: any;

  constructor(private projectService: TeacherProjectService, private upgrade: UpgradeModule) {}

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
    this.node = this.projectService.getNode(this.upgrade.$injector.get('$stateParams').nodeId);
    this.isGroupNode = this.node.isGroup();
  }

  goBack(): void {
    this.$state.go('root.at.project.node', { nodeId: this.node.id });
  }

  showCreateBranchView(): void {
    this.$state.go('root.at.project.node.advanced.branch');
  }

  showEditTransitionsView(): void {
    this.$state.go('root.at.project.node.advanced.path');
  }

  showEditConstraintsView(): void {
    this.$state.go('root.at.project.node.advanced.constraint');
  }

  showGeneralAdvancedView(): void {
    this.$state.go('root.at.project.node.advanced.general');
  }

  showJSONView(): void {
    this.$state.go('root.at.project.node.advanced.json');
  }
}
