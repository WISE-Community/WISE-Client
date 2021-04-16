import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-component-exclude-from-total-score',
  templateUrl: 'edit-component-exclude-from-total-score.component.html'
})
export class EditComponentExcludeFromTotalScoreComponent {
  @Input()
  authoringComponentContent: any;
  excludeFromTotalScoreChanged: Subject<string> = new Subject<string>();
  excludeFromTotalScoreChangedSubscription: Subscription;

  constructor(private ProjectService: TeacherProjectService) {}

  ngOnInit() {
    this.excludeFromTotalScoreChangedSubscription = this.excludeFromTotalScoreChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.ProjectService.componentChanged();
      });
  }

  ngOnDestroy() {
    this.excludeFromTotalScoreChangedSubscription.unsubscribe();
  }
}
