import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../../../assets/wise5/services/utilService';

@Component({
  selector: 'edit-component-default-feedback',
  templateUrl: 'edit-component-default-feedback.component.html',
  styleUrls: ['edit-component-default-feedback.component.scss']
})
export class EditComponentDefaultFeedback {
  @Input()
  authoringComponentContent: any;
  feedbackChanged: Subject<string> = new Subject<string>();
  feedbackChangedSubscription: Subscription;

  constructor(private ProjectService: TeacherProjectService, private UtilService: UtilService) {}

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
    if (this.authoringComponentContent.defaultFeedback == null) {
      this.authoringComponentContent.defaultFeedback = [];
    }
    this.authoringComponentContent.defaultFeedback.push('');
    this.componentChanged();
  }

  moveDefaultFeedbackUp(index: number): void {
    this.UtilService.moveObjectUp(this.authoringComponentContent.defaultFeedback, index);
    this.componentChanged();
  }

  moveDefaultFeedbackDown(index: number): void {
    this.UtilService.moveObjectDown(this.authoringComponentContent.defaultFeedback, index);
    this.componentChanged();
  }

  deleteDefaultFeedback(index: number): void {
    if (confirm($localize`Are you sure you want to delete this default feedback?`)) {
      this.authoringComponentContent.defaultFeedback.splice(index, 1);
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
