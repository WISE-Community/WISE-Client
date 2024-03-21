import { Component, Input } from '@angular/core';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'notebook-launcher',
  templateUrl: 'notebook-launcher.component.html'
})
export class NotebookLauncherComponent {
  @Input()
  notebookConfig: any;

  label: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private NotebookService: NotebookService, private projectService: ProjectService) {}

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

  showNotes(): void {
    this.NotebookService.setNotesVisible(true);
  }
}
