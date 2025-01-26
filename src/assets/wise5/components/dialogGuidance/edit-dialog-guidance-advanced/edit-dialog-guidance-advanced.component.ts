import { Component, Input, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { CRaterIdea } from '../../common/cRater/CRaterIdea';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { NotebookService } from '../../../services/notebookService';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'edit-dialog-guidance-advanced',
  styleUrl: 'edit-dialog-guidance-advanced.scss',
  templateUrl: 'edit-dialog-guidance-advanced.component.html'
})
export class EditDialogGuidanceAdvancedComponent
  extends EditAdvancedComponentComponent
  implements OnInit
{
  @Input() ideaDescriptions: CRaterIdea[] = [];
  inputChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();

  constructor(
    protected nodeService: TeacherNodeService,
    protected notebookService: NotebookService,
    protected teacherProjectService: TeacherProjectService
  ) {
    super(nodeService, notebookService, teacherProjectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.add(
      this.inputChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.teacherProjectService.nodeChanged();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected addNewIdeaDescription(): void {
    const newIdeaDescription = this.createNewIdea();
    this.ideaDescriptions.splice(this.getIdeaIndex(), 0, newIdeaDescription);
    this.teacherProjectService.nodeChanged();
  }

  private createNewIdea(): CRaterIdea {
    const idea = new CRaterIdea('', null);
    idea.description = '';
    return idea;
  }

  protected getIdeaIndex(): number {
    return this.ideaDescriptions.length;
  }

  deleteIdeaDescription(ideaIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this feedback rule?`)) {
      this.ideaDescriptions.splice(ideaIndex, 1);
      this.teacherProjectService.nodeChanged();
    }
  }
}
