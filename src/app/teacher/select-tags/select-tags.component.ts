import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Tag } from '../../domain/tag';
import { AbstractTagsMenuComponent } from '../abstract-tags-menu/abstract-tags-menu.component';
import { SearchBarComponent } from '../../modules/shared/search-bar/search-bar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'select-tags',
  templateUrl: './select-tags.component.html',
  styleUrls: ['./select-tags.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    SearchBarComponent
  ]
})
export class SelectTagsComponent extends AbstractTagsMenuComponent {
  @Input() selectedTags: Tag[] = [];
  @Output() selectTagEvent: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();
}
