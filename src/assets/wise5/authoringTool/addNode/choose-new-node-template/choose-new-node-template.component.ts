import { Component } from '@angular/core';
import { NewNodeTemplate } from '../NewNodeTemplate';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'choose-new-node-template',
  templateUrl: 'choose-new-node-template.component.html',
  styleUrls: ['choose-new-node-template.component.scss', '../../add-content.scss']
})
export class ChooseNewNodeTemplate {
  protected templates: NewNodeTemplate[] = [
    {
      label: $localize`Create Your Own`,
      icon: 'mode_edit',
      route: 'add-your-own'
    },
    {
      label: $localize`Import From Another Unit`,
      icon: 'system_update_alt',
      route: 'import-step/choose-unit'
    },
    {
      label: $localize`Automated Assessment`,
      icon: 'fact_check',
      route: 'automated-assessment/choose-item'
    },
    {
      label: $localize`Interactive Simulation`,
      icon: 'video_settings',
      route: 'simulation/choose-item'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  protected chooseTemplate(template: NewNodeTemplate) {
    this.router.navigate(['..', ...template.route.split('/')], {
      relativeTo: this.route,
      state: {
        targetType: history.state.targetType,
        targetId: history.state.targetId,
        branchNodeId: history.state.branchNodeId,
        firstNodeIdInBranchPath: history.state.firstNodeIdInBranchPath
      }
    });
  }
}
