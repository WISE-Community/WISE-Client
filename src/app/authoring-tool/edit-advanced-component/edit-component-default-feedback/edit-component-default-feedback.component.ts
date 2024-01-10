import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-component-default-feedback',
  templateUrl: 'edit-component-default-feedback.component.html',
  styleUrls: ['edit-component-default-feedback.component.scss']
})
export class EditComponentDefaultFeedback {
  @Input() componentContent: any;
  feedbackChanged: Subject<string> = new Subject<string>();
  feedbackChangedSubscription: Subscription;

  constructor(private ProjectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.feedbackChangedSubscription = this.feedbackChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.componentChanged();
      });
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
    this.ProjectService.moveObjectUp(this.componentContent.defaultFeedback, index);
    this.componentChanged();
  }

  moveDefaultFeedbackDown(index: number): void {
    this.ProjectService.moveObjectDown(this.componentContent.defaultFeedback, index);
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

  componentChanged() {
    this.ProjectService.nodeChanged();
  }
}
