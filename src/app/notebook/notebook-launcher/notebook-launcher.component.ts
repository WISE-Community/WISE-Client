import { Component, Input, inject } from '@angular/core';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'notebook-launcher',
  templateUrl: 'notebook-launcher.component.html'
})
export class NotebookLauncherComponent {
  private notebookService = inject(NotebookService);
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
    this.notebookService.setNotesVisible(true);
  }
}
