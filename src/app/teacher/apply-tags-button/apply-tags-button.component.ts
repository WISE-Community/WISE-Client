import { Component, Input } from '@angular/core';
import { Project } from '../../domain/project';
import { Tag } from '../../domain/tag';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../modules/shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { SelectAllItemsCheckboxComponent } from '../../modules/library/select-all-items-checkbox/select-all-items-checkbox.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AbstractTagsMenuComponent } from '../abstract-tags-menu/abstract-tags-menu.component';

@Component({
  selector: 'apply-tags-button',
  templateUrl: './apply-tags-button.component.html',
  styleUrls: ['./apply-tags-button.component.scss'],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    SelectAllItemsCheckboxComponent,
    SharedModule
  ]
})
export class ApplyTagsButtonComponent extends AbstractTagsMenuComponent {
  @Input() selectedProjects: Project[] = [];

  ngOnChanges(): void {
    this.updateAllTagsCheckedValues();
  }

  protected afterRetrieveUserTags(): void {
    this.updateAllTagsCheckedValues();
  }

  private updateAllTagsCheckedValues(): void {
    for (const tag of this.tags) {
      this.updateTagCheckedValue(tag);
    }
  }

  protected afterNewTag(tag: Tag): void {
    this.updateTagCheckedValue(tag);
  }

  private updateTagCheckedValue(tag: Tag): void {
    tag.numProjectsWithTag = this.selectedProjects.filter((project) =>
      project.tags.some((projectTag) => projectTag.id === tag.id)
    ).length;
  }

  protected addTagToProjects(tag: Tag): void {
    this.projectTagService.applyTagToProjects(tag, this.selectedProjects).subscribe(() => {
      for (const project of this.selectedProjects) {
        project.addTag(tag);
      }
      this.updateTagCheckedValue(tag);
    });
  }

  protected removeTagFromProjects(tag: Tag): void {
    this.projectTagService.removeTagFromProjects(tag, this.selectedProjects).subscribe(() => {
      for (const project of this.selectedProjects) {
        project.tags = project.tags.filter((projectTag: Tag) => projectTag.id !== tag.id);
      }
      this.updateTagCheckedValue(tag);
    });
  }
}
