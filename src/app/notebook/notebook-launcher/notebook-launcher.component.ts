import { Component, inject, Input } from '@angular/core';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { NotebookNotesComponent } from '../notebook-notes/notebook-notes.component';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'notebook-launcher',
  templateUrl: 'notebook-launcher.component.html'
})
export class NotebookLauncherComponent {
  private dialog = inject(MatDialog);
  private projectService = inject(ProjectService);

  protected label: string = '';
  @Input() notebookConfig: any;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.setLabel();
    this.subscription.add(this.projectService.projectParsed$.subscribe(() => this.setLabel()));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setLabel(): void {
    this.label = this.notebookConfig.itemTypes.note.label.link;
  }

  protected showNotes(): void {
    this.dialog.open(NotebookNotesComponent, {
      panelClass: 'dialog-lg'
    });
  }
}
