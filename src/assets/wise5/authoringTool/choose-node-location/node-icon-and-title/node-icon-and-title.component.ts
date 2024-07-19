import { Component, Input } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { NodeIconComponent } from '../../../vle/node-icon/node-icon.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';

@Component({
  imports: [CommonModule, FlexLayoutModule, NodeIconComponent],
  selector: 'node-icon-and-title',
  standalone: true,
  templateUrl: './node-icon-and-title.component.html'
})
export class NodeIconAndTitleComponent {
  @Input() protected nodeId: string;
  @Input() protected showPosition: boolean;

  constructor(
    private projectService: TeacherProjectService,
    private projectTranslationService: TeacherProjectTranslationService
  ) {}

  protected getNodePosition(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.isDefaultLocale()
      ? this.projectService.getNodeTitle(nodeId)
      : this.translateNodeTitle(nodeId);
  }

  private translateNodeTitle(nodeId: string): string {
    const node = this.projectService.getNode(nodeId);
    const translatedTitle = this.projectTranslationService.currentTranslations()[
      node['title.i18n']?.id
    ]?.value;
    return translatedTitle ? translatedTitle : node['title'];
  }
}
