import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag } from '../../domain/tag';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'selected-tags-list',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './selected-tags-list.component.html'
})
export class SelectedTagsListComponent {
  @Output() removeTagEvent: EventEmitter<Tag> = new EventEmitter<Tag>();
  @Input() tags: Tag[] = [];

  protected removeTags(): void {
    this.tags.forEach((tag: Tag) => {
      this.removeTagEvent.emit(tag);
    });
  }
}
