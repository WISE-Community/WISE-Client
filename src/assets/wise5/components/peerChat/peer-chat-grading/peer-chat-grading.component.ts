import { Component, Input } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'peer-chat-grading',
  templateUrl: './peer-chat-grading.component.html',
  styleUrls: ['./peer-chat-grading.component.scss']
})
export class PeerChatGradingComponent extends ComponentShowWorkDirective {
  @Input()
  workgroupId: any;
}
