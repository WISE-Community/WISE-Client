import { Input, Component } from '@angular/core';

@Component({
  selector: 'workgroup-node-score',
  styles: ['.mat-headline-5 { margin: 0; }'],
  template: `
    <div class="flex justify-center items-center">
      <span class="mat-headline-5">{{ score }}</span
      >&nbsp;<span class="text-secondary mat-body-2">/{{ maxScore }}</span>
    </div>
  `
})
export class WorkgroupNodeScoreComponent {
  @Input() maxScore: number;
  @Input() score: number;
}
