import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentContent } from '../../../common/ComponentContent';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TranslatableInputComponent } from '../translatable-input/translatable-input.component';
import { debounceTime, distinctUntilChanged, Subscription, Subject } from 'rxjs';

@Component({
  imports: [FormsModule, TranslatableInputComponent],
  selector: 'edit-component-title',
  template: `
    <translatable-input
      [content]="componentContent"
      [hasClearButton]="true"
      key="title"
      label="Activity Title"
      i18n-label
      (defaultLanguageTextChanged)="titleChanged.next($event)"
    />
  `
})
export class EditComponentTitleComponent {
  @Input() componentContent: ComponentContent;
  private projectService = inject(TeacherProjectService);
  private subscriptions: Subscription = new Subscription();
  protected titleChanged: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.subscriptions.add(
      this.titleChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((title) => {
        this.componentContent.title = title;
        this.projectService.saveProject();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
