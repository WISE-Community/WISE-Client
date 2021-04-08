import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { NewNodeTemplate } from '../NewNodeTemplate';

@Component({
  templateUrl: 'choose-new-node-template.component.html'
})
export class ChooseNewNodeTemplate {
  templates: NewNodeTemplate[] = [
    {
      label: $localize`Automated Assessment`,
      description: $localize`Automated Assessment Description`,
      icon: 'fact_check',
      route: 'root.at.project.add-node.automated-assessment.choose-item'
    },
    {
      label: $localize`Create Your Own`,
      description: $localize`Create Your Own Description`,
      icon: 'mode_edit',
      route: 'root.at.project.add-node.add-your-own'
    }
  ];

  constructor(private upgrade: UpgradeModule) {}

  chooseTemplate(template: NewNodeTemplate) {
    this.upgrade.$injector.get('$state').go(template.route, {});
  }

  cancel() {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }
}
