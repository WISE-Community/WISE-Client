import { Directive, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';

@Directive()
export abstract class EditComponentFieldComponent {
  @Input() componentContent: any;
  protected inputChanged: Subject<any> = new Subject<any>();
  protected inputChangedSubscription: Subscription;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.inputChangedSubscription = this.inputChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.projectService.saveProject();
      });
  }

  ngOnDestroy(): void {
    this.inputChangedSubscription.unsubscribe();
  }
}
