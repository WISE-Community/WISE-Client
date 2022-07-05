import { Component } from '@angular/core';
import { ComponentShowWorkDirective } from '../../component-show-work.directive';

@Component({
  selector: 'open-response-show-work',
  templateUrl: 'open-response-show-work.component.html'
})
export class OpenResponseShowWorkComponent extends ComponentShowWorkDirective {
  studentResponse: string = '';
  attachments: any[] = [];
  audioAttachments: any[] = [];
  otherAttachments: any[] = [];

  ngOnInit(): void {
    if (this.componentState != null && this.componentState !== '') {
      this.studentResponse = this.getStudentResponse(this.componentState);
      this.attachments = this.getAttachments(this.componentState);
      this.processAttachments(this.attachments);
    }
  }

  getStudentResponse(componentState: any): string {
    return componentState.studentData.response;
  }

  getAttachments(componentState: any): any[] {
    return componentState.studentData.attachments;
  }

  processAttachments(attachments: any[]): void {
    for (const attachment of attachments) {
      if (attachment.type === 'audio') {
        this.audioAttachments.push(attachment);
      } else {
        this.otherAttachments.push(attachment);
      }
    }
  }
}
