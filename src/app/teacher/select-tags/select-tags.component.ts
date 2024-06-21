import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Tag } from '../../domain/tag';
import { AbstractTagsMenuComponent } from '../abstract-tags-menu/abstract-tags-menu.component';
import { SearchBarComponent } from '../../modules/shared/search-bar/search-bar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagComponent } from '../tag/tag.component';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    NgSelectModule,
    SearchBarComponent,
    TagComponent
  ],
  encapsulation: ViewEncapsulation.None,
  selector: 'select-tags',
  standalone: true,
  styleUrl: './select-tags.component.scss',
  templateUrl: './select-tags.component.html'
})
export class SelectTagsComponent extends AbstractTagsMenuComponent {
  @Input() selectedTags: Tag[] = [];
  @Output() selectTagEvent: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

  tagSearch(term: string, item: Tag): boolean {
    return item.text.toLowerCase().includes(term.toLowerCase());
  }
}
