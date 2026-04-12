import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { NodeIconComponent } from '../../../vle/node-icon/node-icon.component';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { Subscription } from 'rxjs';

@Component({
  imports: [NodeIconComponent],
  selector: 'node-icon-and-title',
  styles: ['.step-number,.step-title {color:rgba(0,0,0,.87)}'],
  templateUrl: './node-icon-and-title.component.html'
})
export class NodeIconAndTitleComponent {
  @Input() protected nodeId: string;
  protected nodePosition: string;
  protected nodeTitle: string;
  @Input() protected showPosition: boolean;
  private subscriptions: Subscription;

  constructor(
    private projectService: TeacherProjectService,
    private projectTranslationService: TeacherProjectTranslationService
  ) {}

  ngOnInit(): void {
    this.nodePosition = this.getNodePosition(this.nodeId);
    this.nodeTitle = this.getNodeTitle(this.nodeId);
    this.subscriptions = this.projectService.projectParsed$.subscribe(() => {
      this.nodePosition = this.getNodePosition(this.nodeId);
      this.nodeTitle = this.getNodeTitle(this.nodeId);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getNodePosition(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  private getNodeTitle(nodeId: string): string {
    return this.projectService.isDefaultLocale()
      ? this.projectService.getNodeTitle(nodeId)
      : this.translateNodeTitle(nodeId);
  }

  private translateNodeTitle(nodeId: string): string {
    const node = this.projectService.getNode(nodeId);
    const translatedTitle =
      this.projectTranslationService.currentTranslations()[node['title.i18n']?.id]?.value;
    return translatedTitle ? translatedTitle : node['title'];
  }
}
