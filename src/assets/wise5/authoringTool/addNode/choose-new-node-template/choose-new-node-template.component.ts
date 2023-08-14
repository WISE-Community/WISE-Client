import { Component } from '@angular/core';
import { NewNodeTemplate } from '../NewNodeTemplate';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'choose-new-node-template',
  templateUrl: 'choose-new-node-template.component.html',
  styleUrls: ['choose-new-node-template.component.scss']
})
export class ChooseNewNodeTemplate {
  protected templates: NewNodeTemplate[] = [
    {
      label: $localize`Create Your Own`,
      description: $localize`Create Your Own Description`,
      icon: 'mode_edit',
      route: 'add-your-own'
    },
    {
      label: $localize`Automated Assessment`,
      description: $localize`Automated Assessment Description`,
      icon: 'fact_check',
      route: 'automated-assessment/choose-item'
    },
    {
      label: $localize`Interactive Simulation`,
      description: $localize`Add an existing interactive simulation`,
      icon: 'video_settings',
      route: 'simulation/choose-item'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  protected chooseTemplate(template: NewNodeTemplate) {
    this.router.navigate(['..', ...template.route.split('/')], { relativeTo: this.route });
  }
}
