import { Component, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { WiseLinkService } from '../../../../../app/services/wiseLinkService';
import { ComponentStudent } from '../../component-student.component';

@Component({
  selector: 'html-student',
  styleUrl: 'html-student.component.scss',
  templateUrl: 'html-student.component.html'
})
export class HtmlStudentComponent extends ComponentStudent {
  protected html: SafeHtml = '';
  private wiseLinkService = inject(WiseLinkService);

  ngOnInit(): void {
    super.ngOnInit();
    this.html = this.wiseLinkService.generateHtmlWithWiseLink(this.componentContent.html);
    this.broadcastDoneRenderingComponent();
  }
}
