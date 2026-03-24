import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComponentContent } from '../../../common/ComponentContent';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'toggle-component-tag',
  template: `<button
    mat-icon-button
    (click)="toggleTag()"
    [matTooltip]="tooltip"
    matTooltipPosition="above"
  >
    @if (hasTag) {
      <mat-icon style="color: orange">star</mat-icon>
    } @else {
      <mat-icon>star_border</mat-icon>
    }
  </button>`
})
export class ToggleComponentTagComponent {
  private projectService = inject(TeacherProjectService);

  @Input() component: ComponentContent;
  protected hasTag: boolean;
  private tag: string = '!important';
  protected tooltip: string;

  ngOnInit(): void {
    this.hasTag = this.component.tags?.includes(this.tag);
    this.updateTooltip();
  }

  private updateTooltip(): void {
    if (this.hasTag) {
      this.tooltip = $localize`Mark as not important for teachers`;
    } else {
      this.tooltip = $localize`Mark as important for teachers`;
    }
  }

  protected toggleTag(): void {
    if (this.component.tags?.includes(this.tag)) {
      this.component.tags = this.component.tags.filter((t) => t !== this.tag);
      this.hasTag = false;
    } else {
      if (this.component.tags == null) {
        this.component.tags = [];
      }
      this.component.tags.push(this.tag);
      this.hasTag = true;
    }
    this.updateTooltip();
    this.projectService.saveProject();
  }
}
