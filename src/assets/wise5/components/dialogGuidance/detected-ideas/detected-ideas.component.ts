import { Component, Input } from '@angular/core';
import { getUniqueIdeas } from '../../common/cRater/CRaterRubric';
import { CRaterService } from '../../../services/cRaterService';
import { CRaterIdea } from '../../common/cRater/CRaterIdea';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'detected-ideas',
  standalone: true,
  styleUrl: './detected-ideas.component.scss',
  templateUrl: './detected-ideas.component.html'
})
export class DetectedIdeasComponent {
  @Input() componentState: any;
  protected ideas: CRaterIdea[];

  constructor(private cRaterService: CRaterService) {}

  ngOnInit(): void {
    this.ideas = getUniqueIdeas(
      this.componentState.studentData.responses,
      this.cRaterService.getCRaterRubric(
        this.componentState.nodeId,
        this.componentState.componentId
      )
    );
  }
}
