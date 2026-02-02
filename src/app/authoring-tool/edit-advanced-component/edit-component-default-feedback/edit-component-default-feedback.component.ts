import { Component, Input, inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { moveObjectDown, moveObjectUp } from '../../../../assets/wise5/common/array/array';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  selector: 'edit-component-default-feedback',
  styleUrl: 'edit-component-default-feedback.component.scss',
  templateUrl: 'edit-component-default-feedback.component.html'
})
export class EditComponentDefaultFeedback {
  private projectService = inject(TeacherProjectService);

  @Input() componentContent: any;
  protected feedbackChanged: Subject<string> = new Subject<string>();
  private feedbackChangedSubscription: Subscription;

  ngOnInit(): void {
    this.feedbackChangedSubscription = this.feedbackChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => this.componentChanged());
  }

  ngOnDestroy(): void {
    this.feedbackChangedSubscription.unsubscribe();
  }

  addDefaultFeedback(): void {
    if (this.componentContent.defaultFeedback == null) {
      this.componentContent.defaultFeedback = [];
    }
    this.componentContent.defaultFeedback.push('');
    this.componentContent.showSubmitButton = true;
    this.componentChanged();
  }

  moveDefaultFeedbackUp(index: number): void {
    moveObjectUp(this.componentContent.defaultFeedback, index);
    this.componentChanged();
  }

  moveDefaultFeedbackDown(index: number): void {
    moveObjectDown(this.componentContent.defaultFeedback, index);
    this.componentChanged();
  }

  deleteDefaultFeedback(index: number): void {
    if (confirm($localize`Are you sure you want to delete this default feedback?`)) {
      this.componentContent.defaultFeedback.splice(index, 1);
      this.componentChanged();
    }
  }

  customTrackBy(index: number): any {
    return index;
  }

  componentChanged(): void {
    this.projectService.nodeChanged();
  }
}
