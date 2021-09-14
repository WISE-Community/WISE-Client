import { Component } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { NewNodeTemplate } from '../NewNodeTemplate';

@Component({
  templateUrl: 'choose-new-node-template.component.html',
  styleUrls: ['choose-new-node-template.component.scss']
})
export class ChooseNewNodeTemplate {
  templates: NewNodeTemplate[] = [
    {
      label: $localize`Create Your Own`,
      description: $localize`Create Your Own Description`,
      icon: 'mode_edit',
      route: 'root.at.project.add-node.add-your-own'
    },
    {
      label: $localize`Automated Assessment`,
      description: $localize`Automated Assessment Description`,
      icon: 'fact_check',
      route: 'root.at.project.add-node.automated-assessment.choose-item'
    },
    {
      label: $localize`Interactive Simulation`,
      description: $localize`Add an existing interactive simulation`,
      icon: 'video_settings',
      route: 'root.at.project.add-node.simulation.choose-item'
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
