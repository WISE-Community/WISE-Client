import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';
import { generateRandomKey } from '../../../assets/wise5/common/string/string';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-component-teacher-reflections',
  imports: [
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: 'edit-component-teacher-reflections.component.html'
})
export class EditComponentTeacherReflectionsComponent implements OnInit, OnDestroy {
  @Input() componentContent!: ComponentContent;
  @Output() componentChangedEvent = new EventEmitter<void>();

  protected questionTextChanged = new Subject<void>();
  private projectService = inject(TeacherProjectService);
  private subscriptions = new Subscription();

  ngOnInit(): void {
    if (!this.componentContent.teacher) {
      this.componentContent.teacher = { reflectionQuestions: [] };
    }
    this.subscriptions.add(
      this.questionTextChanged.pipe(debounceTime(1000)).subscribe(() => {
        this.notifyChanged();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addReflectionQuestion(): void {
    this.componentContent.teacher.reflectionQuestions.push({
      id: generateRandomKey(),
      text: ''
    });
    this.notifyChanged();
  }

  deleteReflectionQuestion(index: number): void {
    this.componentContent.teacher.reflectionQuestions.splice(index, 1);
    this.notifyChanged();
  }

  protected onQuestionTextChanged(): void {
    this.questionTextChanged.next();
  }

  private notifyChanged(): void {
    this.projectService.nodeChanged();
    this.componentChangedEvent.emit();
  }
}
