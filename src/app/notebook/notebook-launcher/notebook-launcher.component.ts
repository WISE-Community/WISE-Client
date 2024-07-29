import { Component, Input } from '@angular/core';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'notebook-launcher',
  standalone: true,
  templateUrl: 'notebook-launcher.component.html'
})
export class NotebookLauncherComponent {
  protected label: string = '';
  @Input() notebookConfig: any;

  constructor(private notebookService: NotebookService) {}

  ngOnInit(): void {
    this.label = this.notebookConfig.itemTypes.note.label.link;
  }

  protected showNotes(): void {
    this.notebookService.setNotesVisible(true);
  }
}
