import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../../modules/shared/shared.module';
import { Tag } from '../../domain/tag';
import { AbstractTagsMenuComponent } from '../abstract-tags-menu/abstract-tags-menu.component';

@Component({
  selector: 'tags-filter',
  templateUrl: './tags-filter.component.html',
  styleUrls: ['./tags-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDividerModule, SharedModule]
})
export class TagsFilterComponent extends AbstractTagsMenuComponent {
  protected selectedTags: Tag[] = [];
  @Output() tagsFilterChanged: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();
}
