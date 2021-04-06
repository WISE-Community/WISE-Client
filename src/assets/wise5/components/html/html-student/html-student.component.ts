import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NodeService } from '../../../services/nodeService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';

@Component({
  selector: 'html-student',
  templateUrl: 'html-student.component.html'
})
export class HtmlStudent extends ComponentStudent {
  html: SafeHtml = '';

  constructor(
    protected NodeService: NodeService,
    private sanitizer: DomSanitizer,
    protected UtilService: UtilService
  ) {
    super(NodeService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.html = this.sanitizer.bypassSecurityTrustHtml(
      this.UtilService.replaceWISELinks(this.componentContent.html)
    );
    this.broadcastDoneRenderingComponent();
  }
}
