import { Component, Input } from '@angular/core';
import { TagComponent } from '../tag/tag.component';
import { Tag } from '../../domain/tag';

@Component({
  imports: [TagComponent],
  selector: 'unit-tags',
  styles: ['tag { display: inline-block; margin-top: 8px; }'],
  template: `<div
    class="flex flex-wrap gap-2"
    role="presentation"
    aria-label="Unit tags"
    i18n-aria-label
  >
    @for (tag of tags; track tag) {
      @if (tag.text !== 'archived') {
        <tag [color]="tag.color" [text]="tag.text" />
      }
    }
  </div>`
})
export class UnitTagsComponent {
  @Input() tags: Tag[];
}
