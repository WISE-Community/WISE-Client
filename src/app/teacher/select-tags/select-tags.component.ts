import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../../modules/shared/shared.module';
import { Tag } from '../../domain/tag';
import { AbstractTagsMenuComponent } from '../abstract-tags-menu/abstract-tags-menu.component';

@Component({
  selector: 'select-tags',
  templateUrl: './select-tags.component.html',
  styleUrls: ['./select-tags.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDividerModule, SharedModule]
})
export class SelectTagsComponent extends AbstractTagsMenuComponent {
  protected selectedTags: Tag[] = [];
  @Output() selectTagEvent: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();
}
