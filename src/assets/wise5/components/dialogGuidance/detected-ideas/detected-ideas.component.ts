import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CRaterRubric, getUniqueIdeas } from '../../common/cRater/CRaterRubric';
import { CRaterIdea } from '../../common/cRater/CRaterIdea';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'detected-ideas',
  styleUrl: './detected-ideas.component.scss',
  templateUrl: './detected-ideas.component.html'
})
export class DetectedIdeasComponent {
  @Input() alignEnd: boolean = false;
  @Input() cRaterRubric: CRaterRubric;
  protected ideas: CRaterIdea[];
  @Input() responses: any;

  ngOnInit(): void {
    this.ideas = getUniqueIdeas(this.responses, this.cRaterRubric);
  }
}
