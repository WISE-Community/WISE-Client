import { Component, Input } from '@angular/core';
import { CRaterRubric, getUniqueIdeas } from '../../common/cRater/CRaterRubric';
import { CRaterIdea } from '../../common/cRater/CRaterIdea';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'detected-ideas',
  standalone: true,
  styleUrls: ['./detected-ideas.component.scss'],
  templateUrl: './detected-ideas.component.html'
})
export class DetectedIdeasComponent {
  @Input() cRaterRubric: CRaterRubric;
  protected ideas: CRaterIdea[];
  @Input() responses: any;

  ngOnInit(): void {
    this.ideas = getUniqueIdeas(this.responses, this.cRaterRubric);
  }
}
