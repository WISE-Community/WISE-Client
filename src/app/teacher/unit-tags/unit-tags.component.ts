import { Component, Input } from '@angular/core';
import { TagComponent } from '../tag/tag.component';
import { Tag } from '../../domain/tag';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'unit-tags',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, TagComponent],
  templateUrl: './unit-tags.component.html',
  styleUrl: './unit-tags.component.scss'
})
export class UnitTagsComponent {
  @Input() tags: Tag[];
}
