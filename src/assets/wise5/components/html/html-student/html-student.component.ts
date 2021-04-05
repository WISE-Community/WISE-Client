import { Component } from '@angular/core';
import { NodeService } from '../../../services/nodeService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';

@Component({
  selector: 'html-student',
  templateUrl: 'html-student.component.html'
})
export class HtmlStudent extends ComponentStudent {
  html: string = '';

  constructor(protected NodeService: NodeService, protected UtilService: UtilService) {
    super(NodeService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.html = this.UtilService.replaceWISELinks(this.componentContent.html);
    this.broadcastDoneRenderingComponent();
  }
}
