'use strict';

import { Input, Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [FlexLayoutModule],
  selector: 'workgroup-node-score',
  standalone: true,
  styleUrl: 'workgroup-node-score.component.scss',
  templateUrl: 'workgroup-node-score.component.html'
})
export class WorkgroupNodeScoreComponent {
  @Input() maxScore: number;
  @Input() score: number;
}
