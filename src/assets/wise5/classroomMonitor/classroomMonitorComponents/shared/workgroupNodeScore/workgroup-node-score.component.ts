'use strict';

import { Input, Component } from '@angular/core';

@Component({
  selector: 'workgroup-node-score',
  templateUrl: 'workgroup-node-score.component.html',
  styleUrls: ['workgroup-node-score.component.scss']
})
export class WorkgroupNodeScoreComponent {
  @Input()
  score: number;

  @Input()
  maxScore: number;
}
