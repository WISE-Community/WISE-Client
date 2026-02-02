import { Component, Input, inject } from '@angular/core';
import { ProjectService } from '../../assets/wise5/services/projectService';

@Component({
  selector: 'possible-score',
  templateUrl: 'possible-score.component.html'
})
export class PossibleScoreComponent {
  private projectService = inject(ProjectService);

  protected hidePossibleScores: boolean;
  @Input() maxScore: number;

  ngOnInit(): void {
    this.hidePossibleScores = this.projectService.getThemeSettings().hidePossibleScores;
  }
}
