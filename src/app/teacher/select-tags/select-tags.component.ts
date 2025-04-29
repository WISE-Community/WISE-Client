import { AbstractTagsMenuComponent } from '../abstract-tags-menu/abstract-tags-menu.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchBarComponent } from '../../modules/shared/search-bar/search-bar.component';
import { Tag } from '../../domain/tag';
import { TagComponent } from '../tag/tag.component';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    NgSelectModule,
    SearchBarComponent,
    TagComponent
  ],
  encapsulation: ViewEncapsulation.None,
  selector: 'select-tags',
  styleUrl: './select-tags.component.scss',
  templateUrl: './select-tags.component.html'
})
export class SelectTagsComponent extends AbstractTagsMenuComponent {
  @Input() selectedTags: Tag[] = [];
  @Output() selectTagEvent: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

  protected tagSearch(term: string, item: Tag): boolean {
    return item.text.toLowerCase().includes(term.toLowerCase());
  }

  protected isSelected(tag: Tag): boolean {
    return this.selectedTags.some((selectedTag) => selectedTag.text === tag.text);
  }
}
