import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'archive-projects-button',
  templateUrl: './archive-projects-button.component.html',
  styleUrls: ['./archive-projects-button.component.scss']
})
export class ArchiveProjectsButtonComponent {
  @Output() archiveProjectsEvent = new EventEmitter<boolean>();
  @Input() showArchive: boolean = false;
}
