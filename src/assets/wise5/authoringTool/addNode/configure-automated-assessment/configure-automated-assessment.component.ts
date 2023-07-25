import { Component } from '@angular/core';
import { ConfigureStructureComponent } from '../../structure/configure-structure.component';
import { HttpClient } from '@angular/common/http';
import { UpgradeModule } from '@angular/upgrade/static';

@Component({
  selector: 'configure-automated-assessment',
  templateUrl: './configure-automated-assessment.component.html',
  styleUrls: ['./configure-automated-assessment.component.scss']
})
export class ConfigureAutomatedAssessmentComponent extends ConfigureStructureComponent {
  hasCustomization: boolean;
  importFromProjectId: number;
  node: any;
  stateParams: any;

  constructor(http: HttpClient, protected upgrade: UpgradeModule) {
    super(http, upgrade);
  }

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
    this.stateParams = this.upgrade.$injector.get('$stateParams');
    this.node = this.stateParams.node;
    if (this.node == null) {
      this.$state.go('root.at.project.add-node.automated-assessment.choose-item');
    }
    this.hasCustomization = this.node.components.some((component: any) => component.enableCRater);
    this.importFromProjectId = this.stateParams.importFromProjectId;
  }

  protected back(): void {
    window.history.back();
  }

  protected next(): void {
    this.$state.go('root.at.project.import-step.choose-location', {
      importFromProjectId: this.importFromProjectId,
      selectedNodes: [this.node]
    });
  }
}
