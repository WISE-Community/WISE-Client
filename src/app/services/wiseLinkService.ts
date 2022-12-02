import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NodeService } from '../../assets/wise5/services/nodeService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { UtilService } from '../../assets/wise5/services/utilService';

@Injectable()
export class WiseLinkService {
  constructor(
    private nodeService: NodeService,
    private sanitizer: DomSanitizer,
    private studentDataService: StudentDataService,
    private utilService: UtilService
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
    return (event: CustomEvent) => {
      this.followLink(event.detail.nodeId, event.detail.componentId);
    };
  }

  removeWiseLinkClickedListener(): void {
    this.getWiseLinkCommunicator().removeEventListener(
      this.wiseLinkClickedEventName,
      this.wiseLinkClickedHandler
    );
  }

  private getWiseLinkCommunicator(): HTMLElement {
    return document.getElementById(this.wiseLinkCommunicatorId);
  }

  private followLink(nodeId: string, componentId: string): void {
    if (nodeId === this.studentDataService.getCurrentNodeId()) {
      this.nodeService.scrollToComponentAndHighlight(componentId);
    } else {
      this.goToNode(nodeId, componentId);
    }
  }

  private goToNode(nodeId: string, componentId: string): void {
    if (componentId !== '') {
      this.nodeService.registerScrollToComponent(componentId);
    }
    this.studentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nodeId);
  }

  generateHtmlWithWiseLink(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.utilService.replaceDivReference(
        this.utilService.replaceWISELinks(html),
        this.wiseLinkCommunicatorId
      )
    );
  }
}
