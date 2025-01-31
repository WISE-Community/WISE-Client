import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, OnInit } from '@angular/core';
import { ComponentContent } from '../../../../common/ComponentContent';
import { CRaterIdea } from '../CRaterIdea';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, Subscription } from 'rxjs';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  imports: [
    CdkTextareaAutosize,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule
  ],
  selector: 'edit-crater-idea-descriptions',
  standalone: true,
  templateUrl: './edit-crater-idea-descriptions.component.html',
  styleUrl: './edit-crater-idea-descriptions.component.scss'
})
export class EditCRaterIdeaDescriptionsComponent implements OnInit {
  @Input() componentContent: ComponentContent;
  @Input() ideaDescriptions: CRaterIdea[] = [];
  inputChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();

  constructor(protected teacherProjectService: TeacherProjectService) {}

  ngOnInit(): void {
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
    setTimeout(() => {
      const button = document.getElementById('add-new-idea-description-bottom-button');
      if (button) {
        button.scrollIntoView();
      }
    }, 0);
  }

  private createNewIdea(): CRaterIdea {
    const idea = new CRaterIdea('', null);
    idea.studentText = '';
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
