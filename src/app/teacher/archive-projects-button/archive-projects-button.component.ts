import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'archive-projects-button',
  styleUrl: './archive-projects-button.component.scss',
  templateUrl: './archive-projects-button.component.html'
})
export class ArchiveProjectsButtonComponent {
  readonly archiveProjectsEvent = output<boolean>();
  readonly showArchive = input<boolean>(false);
}

