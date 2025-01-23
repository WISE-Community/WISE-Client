import { Component, Input } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { CRaterIdea } from '../../common/cRater/CRaterIdea';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { NotebookService } from '../../../services/notebookService';

@Component({
  selector: 'edit-dialog-guidance-advanced',
  styleUrl: 'edit-dialog-guidance-advanced.scss',
  templateUrl: 'edit-dialog-guidance-advanced.component.html'
})
export class EditDialogGuidanceAdvancedComponent extends EditAdvancedComponentComponent {
  @Input() ideaDescriptions: CRaterIdea[] = [];
  private ideaIndex = 0;
  // protected showSecondAddButton = false;

  constructor(
    protected nodeService: TeacherNodeService,
    protected notebookService: NotebookService,
    protected teacherProjectService: TeacherProjectService
  ) {
    super(nodeService, notebookService, teacherProjectService);
  }

  protected addNewIdeaDescription(): void {
    const newFeedbackRule = this.createNewFeedbackRule();
    this.ideaDescriptions.splice(this.ideaIndex, 0, newFeedbackRule);
    this.teacherProjectService.nodeChanged();
    this.ideaIndex++;
    // this.showSecondAddButton = true;
  }

  private createNewFeedbackRule(): CRaterIdea {
    return { name: '', detected: true, characterOffsets: [], description: '' };
  }

  protected getIdeaIndex(): number {
    return this.ideaIndex;
  }

  deleteIdeaDescription(ideaIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this feedback rule?`)) {
      this.ideaDescriptions.splice(ideaIndex, 1);
      this.teacherProjectService.nodeChanged();
      this.ideaIndex--;
    }
  }
}
