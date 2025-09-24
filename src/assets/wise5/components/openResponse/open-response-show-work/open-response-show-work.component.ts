import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'open-response-show-work',
  templateUrl: 'open-response-show-work.component.html'
})
export class OpenResponseShowWorkComponent extends ComponentShowWorkDirective {
  protected audioAttachments: any[] = [];
  protected otherAttachments: any[] = [];
  protected studentResponse: string = '';

  ngOnInit(): void {
    if (this.componentState != null && this.componentState !== '') {
      this.studentResponse = this.componentState.studentData.response;
      this.processAttachments();
    }
  }

  private processAttachments(): void {
    this.componentState.studentData.attachments.forEach((attachment: any) => {
      if (attachment.type === 'audio') {
        this.audioAttachments.push(attachment);
      } else {
        this.otherAttachments.push(attachment);
      }
    });
  }
}
