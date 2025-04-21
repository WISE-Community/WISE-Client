import { Component, Input } from '@angular/core';
import { TagComponent } from '../tag/tag.component';
import { Tag } from '../../domain/tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'unit-tags',
  imports: [CommonModule, TagComponent],
  templateUrl: './unit-tags.component.html',
  styleUrl: './unit-tags.component.scss'
})
export class UnitTagsComponent {
  @Input() tags: Tag[];
}
