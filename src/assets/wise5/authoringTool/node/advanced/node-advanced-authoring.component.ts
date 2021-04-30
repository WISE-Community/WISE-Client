import { Node } from '../../../common/Node';

class NodeAdvancedAuthoringController {
  node: Node;
  isGroupNode: boolean;

  static $inject = ['$state'];

  constructor(private $state: any) {}

  $onInit() {
    this.isGroupNode = this.node.isGroup();
  }

  goBack() {
    this.$state.go('root.at.project.node', { nodeId: this.node.id });
  }

  showCreateBranchView() {
    this.$state.go('root.at.project.node.advanced.branch');
  }

  showEditTransitionsView() {
    this.$state.go('root.at.project.node.advanced.path');
  }

  showEditConstraintsView() {
    this.$state.go('root.at.project.node.advanced.constraint');
  }

  showGeneralAdvancedView() {
    this.$state.go('root.at.project.node.advanced.general');
  }

  showJSONView() {
    this.$state.go('root.at.project.node.advanced.json');
  }
}

export const NodeAdvancedAuthoringComponent = {
  templateUrl: `/assets/wise5/authoringTool/node/advanced/node-advanced-authoring.component.html`,
  controller: NodeAdvancedAuthoringController,
  bindings: {
    node: '<'
  }
};
