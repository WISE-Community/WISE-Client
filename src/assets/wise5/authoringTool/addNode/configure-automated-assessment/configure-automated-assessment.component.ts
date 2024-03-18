import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'configure-automated-assessment',
  templateUrl: './configure-automated-assessment.component.html',
  styleUrls: ['./configure-automated-assessment.component.scss', '../../add-content.scss']
})
export class ConfigureAutomatedAssessmentComponent {
  protected hasCustomization: boolean;
  private importFromProjectId: number;
  protected node: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.node = history.state.node;
    this.hasCustomization = this.node.components.some((component: any) => component.enableCRater);
    this.importFromProjectId = history.state.importFromProjectId;
  }

  protected next(): void {
    this.router.navigate(['../../import-step/choose-location'], {
      relativeTo: this.route,
      state: {
        importFromProjectId: this.importFromProjectId,
        selectedNodes: [this.node]
      }
    });
  }
}
