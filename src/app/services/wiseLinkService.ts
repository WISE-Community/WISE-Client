import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { replaceWiseLinks } from '../../assets/wise5/common/wise-link/wise-link';
import { NodeService } from '../../assets/wise5/services/nodeService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { scrollToElement, temporarilyHighlightElement } from '../../assets/wise5/common/dom/dom';

@Injectable()
export class WiseLinkService {
  constructor(
    private nodeService: NodeService,
    private sanitizer: DomSanitizer,
    private studentDataService: StudentDataService
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
    this.getWiseLinkCommunicator()?.removeEventListener(
      this.wiseLinkClickedEventName,
      this.wiseLinkClickedHandler
    );
  }

  private getWiseLinkCommunicator(): HTMLElement {
    return document.getElementById(this.wiseLinkCommunicatorId);
  }

  private followLink(nodeId: string, componentId: string): void {
    if (nodeId === this.studentDataService.getCurrentNodeId()) {
      this.scrollToComponentAndHighlight(componentId);
    } else {
      this.goToNode(nodeId, componentId);
    }
  }

  private scrollToComponentAndHighlight(componentId: string): void {
    const elementId = `component_${componentId}`;
    scrollToElement(elementId);
    temporarilyHighlightElement(elementId);
  }

  private goToNode(nodeId: string, componentId: string): void {
    if (componentId !== '') {
      const subscription = this.studentDataService.currentNodeChanged$.subscribe(() => {
        setTimeout(() => {
          this.scrollToComponentAndHighlight(componentId);
          subscription.unsubscribe();
        }, 500); // timeout attempts to ensure that new node has loaded before scroll+highlight
      });
    }
    this.nodeService.setCurrentNode(nodeId);
  }

  generateHtmlWithWiseLink(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.replaceDivReference(replaceWiseLinks(html), this.wiseLinkCommunicatorId)
    );
  }

  private replaceDivReference(html: string, newString: string): string {
    return html.replace(
      /document\.getElementById\('replace-with-unique-id'\)/g,
      `document.getElementById('${newString}')`
    );
  }
}
