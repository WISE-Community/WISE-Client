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

  wiseLinkClickedEventName: string = 'wiselinkclicked';
  wiseLinkClickedHandler: any;
  wiseLinkCommunicatorId: string = 'wise-link-communicator';

  addWiseLinkClickedListener(): void {
    this.wiseLinkClickedHandler = this.createWiseLinkClickedHandler();
    this.getWiseLinkCommunicator().addEventListener(
      this.wiseLinkClickedEventName,
      this.wiseLinkClickedHandler
    );
  }

  private createWiseLinkClickedHandler(): any {
    const thisStudentDataService = this.StudentDataService;
    return (event: CustomEvent) => {
      const currentNodeId = thisStudentDataService.getCurrentNodeId();
      this.followLink(currentNodeId, event.detail.nodeId, event.detail.componentId);
    };
  }

  removeWiseLinkClickedListener(): void {
    this.getWiseLinkCommunicator().removeEventListener(
      this.wiseLinkClickedEventName,
      this.wiseLinkClickedHandler
    );
  }

  private getWiseLinkCommunicator(): any {
    return document.getElementById(this.wiseLinkCommunicatorId);
  }

  private followLink(currentNodeId: string, nodeId: string, componentId: string): void {
    if (nodeId === currentNodeId) {
      this.NodeService.scrollToComponentAndHighlight(componentId);
    } else {
      this.goToNode(nodeId, componentId);
    }
  }

  private goToNode(nodeId: string, componentId: string): void {
    if (componentId !== '') {
      this.NodeService.registerScrollToComponent(componentId);
    }
    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nodeId);
  }

  generateHtmlWithWiseLink(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.UtilService.replaceDivReference(
        this.UtilService.replaceWISELinks(html),
        this.wiseLinkCommunicatorId
      )
    );
  }
}
