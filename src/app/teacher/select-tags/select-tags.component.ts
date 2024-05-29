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
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    SearchBarComponent
  ],
  selector: 'select-tags',
  standalone: true,
  styleUrl: './select-tags.component.scss',
  templateUrl: './select-tags.component.html'
})
export class SelectTagsComponent extends AbstractTagsMenuComponent {
  @Input() selectedTags: Tag[] = [];
  @Output() selectTagEvent: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();
}
