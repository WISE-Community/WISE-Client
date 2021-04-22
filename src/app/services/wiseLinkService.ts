import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NodeService } from '../../assets/wise5/services/nodeService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { UtilService } from '../../assets/wise5/services/utilService';

@Injectable()
export class WiseLinkService {
  constructor(
    private NodeService: NodeService,
    private sanitizer: DomSanitizer,
    private StudentDataService: StudentDataService,
    private UtilService: UtilService
  ) {}

  createWiseLinkClickedHandler(currentNodeId: string): any {
    return (event: CustomEvent) => {
      this.followLink(currentNodeId, event.detail.nodeId, event.detail.componentId);
    };
  }

  addWiseLinkClickedListener(wiseLinkCommunicator: any, wiseLinkClickedHandler: any): void {
    wiseLinkCommunicator.addEventListener('wiselinkclicked', wiseLinkClickedHandler);
  }

  followLink(currentNodeId: string, nodeId: string, componentId: string): void {
    if (nodeId === currentNodeId) {
      this.NodeService.scrollToComponentAndHighlight(componentId);
    } else {
      this.goToNode(nodeId, componentId);
    }
  }

  goToNode(nodeId: string, componentId: string): void {
    if (componentId !== '') {
      this.NodeService.registerScrollToComponent(componentId);
    }
    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nodeId);
  }

  generateHtmlWithWiseLink(html: string, wiseLinkCommunicatorId: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.UtilService.replaceDivReference(
        this.UtilService.replaceWISELinks(html),
        wiseLinkCommunicatorId
      )
    );
  }
}
