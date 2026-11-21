import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CRaterIdea } from '../CRaterIdea';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, Subscription } from 'rxjs';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

@Component({
  imports: [
    CdkTextareaAutosize,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  selector: 'edit-crater-idea-descriptions',
  templateUrl: './edit-crater-idea-descriptions.component.html',
  styleUrl: './edit-crater-idea-descriptions.component.scss'
})
export class EditCRaterIdeaDescriptionsComponent implements OnInit, OnChanges {
  @Input() ideaDescriptions: CRaterIdea[] = [];
  @Input() enableAutoscrolling: boolean = true;
  protected inputChanged: Subject<string> = new Subject<string>();
  private subscriptions: Subscription = new Subscription();

  constructor(protected projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.inputChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.projectService.nodeChanged();
      })
    );
  }

  ngOnChanges(): void {
    this.ideaDescriptions?.forEach((idea) => {
      if (!idea.sampleResponses?.length) {
        idea.sampleResponses = [''];
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected addNewSampleResponse(idea: CRaterIdea): void {
    idea.sampleResponses.push('');
    this.projectService.nodeChanged();
  }

  protected deleteSampleResponse(idea: CRaterIdea, responseIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this sample response?`)) {
      idea.sampleResponses.splice(responseIndex, 1);
      this.projectService.nodeChanged();
    }
  }

  protected addNewIdeaDescription(addToTop: boolean): void {
    const newIdeaDescription = this.createNewIdea();
    this.ideaDescriptions.splice(
      addToTop ? 0 : this.getNumIdeaDescriptions(),
      0,
      newIdeaDescription
    );
    this.projectService.nodeChanged();
    if (!addToTop && this.enableAutoscrolling) {
      this.scrollToBottomOfList();
    }
  }

  private createNewIdea(): CRaterIdea {
    const idea = new CRaterIdea('');
    idea.text = '';
    idea.sampleResponses = [''];
    return idea;
  }

  protected getNumIdeaDescriptions(): number {
    return this.ideaDescriptions.length;
  }

  private scrollToBottomOfList(): void {
    setTimeout(() => {
      const button = document.getElementById('add-new-idea-description-bottom-button');
      if (button) {
        button.scrollIntoView();
      }
    }, 0);
  }

  protected deleteIdeaDescription(ideaIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this idea description?`)) {
      this.ideaDescriptions.splice(ideaIndex, 1);
      this.projectService.nodeChanged();
    }
  }
}
