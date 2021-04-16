import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';

@Component({
  selector: 'html-student',
  templateUrl: 'html-student.component.html'
})
export class HtmlStudent extends ComponentStudent {
  html: SafeHtml = '';
  wiseLinkClickedHandler: any;
  currentNodeChangedSubscription: Subscription;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    private sanitizer: DomSanitizer,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      NodeService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.html = this.sanitizer.bypassSecurityTrustHtml(
      this.UtilService.replaceWISELinks(this.componentContent.html)
    );
    if (!this.isAuthoringComponentPreviewMode()) {
      this.setupWiseLinkClickedListener();
    }
    this.broadcastDoneRenderingComponent();
  }

  setupWiseLinkClickedListener(): void {
    // Create the wiseLinkClickedHandler and keep a reference to it so we can remove the event
    // listener in ngOnDestroy. The removeEventListener matches the event name and callback function
    // to remove the listener. If we use an anonymous function, it won't be able to remove the
    // event listener.
    this.wiseLinkClickedHandler = this.createWiseLinkClickedHandler();
    window.addEventListener('wiselinkclicked', this.wiseLinkClickedHandler);
  }

  createWiseLinkClickedHandler(): any {
    return (event: CustomEvent) => {
      this.followLink(event.detail.nodeId, event.detail.componentId);
    };
  }

  ngOnDestroy(): void {
    if (this.currentNodeChangedSubscription != null) {
      this.currentNodeChangedSubscription.unsubscribe();
    }
    if (this.wiseLinkClickedHandler != null) {
      window.removeEventListener('wiselinkclicked', this.wiseLinkClickedHandler);
    }
  }

  followLink(nodeId: string, componentId: string): void {
    if (this.isLinkToComponentInStep(nodeId)) {
      this.scrollToComponentAndHighlight(componentId);
    } else {
      this.goToNode(nodeId, componentId);
    }
  }

  isLinkToComponentInStep(nodeId: string): boolean {
    return nodeId === this.nodeId;
  }

  goToNode(nodeId: string, componentId: string): void {
    this.currentNodeChangedSubscription = this.StudentDataService.currentNodeChanged$.subscribe(
      () => {
        if (componentId != '') {
          this.scrollToComponentAndHighlight(componentId);
        }
      }
    );
    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nodeId);
  }

  scrollToComponentAndHighlight(componentId: string): void {
    setTimeout(() => {
      const componentElement = $('#component_' + componentId);
      const originalBackgroundColor = componentElement.css('backgroundColor');
      componentElement.css('background-color', '#FFFF9C');
      $('#content').animate(
        {
          scrollTop: componentElement.prop('offsetTop')
        },
        1000
      );
      componentElement.css({
        transition: 'background-color 3s ease-in-out',
        'background-color': originalBackgroundColor
      });

      // we need this to remove the transition animation so the highlight works again next time
      setTimeout(() => {
        componentElement.css('transition', '');
      }, 4000);
    }, 500);
  }
}
