import { Component } from '@angular/core';
import { NewNodeTemplate } from '../NewNodeTemplate';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    RouterModule
  ],
  standalone: true,
  styleUrls: ['choose-new-node-template.component.scss', '../../add-content.scss'],
  templateUrl: 'choose-new-node-template.component.html'
})
export class ChooseNewNodeTemplateComponent {
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
        targetId: history.state.targetId
      }
    });
  }
}
