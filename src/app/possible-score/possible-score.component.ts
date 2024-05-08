import { Component, Input } from '@angular/core';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'possible-score',
  standalone: true,
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
