import { Directive, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';

@Directive()
export abstract class EditComponentFieldComponent {
  @Input()
  componentContent: any;
  inputChanged: Subject<string> = new Subject<string>();
  inputChangedSubscription: Subscription;

  constructor(private ProjectService: TeacherProjectService) {}

  ngOnInit() {
    this.inputChangedSubscription = this.inputChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.ProjectService.componentChanged();
      });
  }

  ngOnDestroy() {
    this.inputChangedSubscription.unsubscribe();
  }
}
