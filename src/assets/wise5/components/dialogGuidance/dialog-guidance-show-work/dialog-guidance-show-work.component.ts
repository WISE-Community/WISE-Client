import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { DialogResponse } from '../DialogResponse';

@Component({
  selector: 'dialog-guidance-show-work',
  templateUrl: './dialog-guidance-show-work.component.html',
  styleUrls: ['./dialog-guidance-show-work.component.scss']
})
export class DialogGuidanceShowWorkComponent extends ComponentShowWorkDirective {
  responses: DialogResponse[];

  ngOnInit(): void {
    this.responses = this.componentState.studentData.responses;
  }
}
