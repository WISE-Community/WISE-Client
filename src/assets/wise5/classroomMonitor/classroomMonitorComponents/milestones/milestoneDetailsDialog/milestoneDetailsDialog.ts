export class MilestoneDetailsDialog {
  title: string;

  static $inject = ['$state', '$mdDialog', '$event', 'milestone', 'TeacherDataService'];

  constructor(
    private $state,
    private $mdDialog,
    private $event,
    private milestone,
    private TeacherDataService
  ) {}

  $onInit() {
    this.saveMilestoneOpenedEvent();
  }

  close() {
    this.saveMilestoneClosedEvent();
    this.$mdDialog.hide();
  }

  edit() {
    this.$mdDialog.hide({
      milestone: this.milestone,
      action: 'edit',
      $event: this.$event
    });
  }

  onVisitNodeGrading(nodeId: string): void {
    this.$mdDialog.hide();
    this.$state.go('root.cm.node', { nodeId: nodeId });
  }

  saveMilestoneOpenedEvent() {
    this.saveMilestoneEvent('MilestoneOpened');
  }

  saveMilestoneClosedEvent() {
    this.saveMilestoneEvent('MilestoneClosed');
  }

  saveMilestoneEvent(event: any) {
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.milestone.id },
      projectId = null;
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data,
      projectId
    );
  }
}
