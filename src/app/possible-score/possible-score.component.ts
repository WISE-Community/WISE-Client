import { Component, Input } from '@angular/core';
import { ProjectService } from '../../assets/wise5/services/projectService';

@Component({
  selector: 'possible-score',
  templateUrl: 'possible-score.component.html'
})
export class PossibleScoreComponent {
  protected hidePossibleScores: boolean;
  @Input() maxScore: number;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.hidePossibleScores = this.projectService.getThemeSettings().hidePossibleScores;
  }
}
