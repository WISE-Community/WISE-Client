import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-component-tags',
  templateUrl: 'edit-component-tags.component.html',
  styleUrls: ['edit-component-tags.component.scss']
})
export class EditComponentTagsComponent {
  @Input()
  componentContent: any;
  tagChanged: Subject<any> = new Subject<any>();
  tagChangedSubscription: Subscription;

  constructor(private ProjectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.tagChangedSubscription = this.tagChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(({ tagIndex, tag }) => {
        this.componentContent.tags[tagIndex] = tag;
        this.ProjectService.componentChanged();
      });
  }

  ngOnDestroy(): void {
    this.tagChangedSubscription.unsubscribe();
  }

  addTag(): void {
    if (this.componentContent.tags == null) {
      this.componentContent.tags = [];
    }
    this.componentContent.tags.push('');
    this.ProjectService.componentChanged();
  }

  moveTagUp(index: number): void {
    if (index > 0) {
      const tag = this.componentContent.tags[index];
      this.componentContent.tags.splice(index, 1);
      this.componentContent.tags.splice(index - 1, 0, tag);
      this.ProjectService.componentChanged();
    }
  }

  moveTagDown(index: number): void {
    if (index < this.componentContent.tags.length - 1) {
      const tag = this.componentContent.tags[index];
      this.componentContent.tags.splice(index, 1);
      this.componentContent.tags.splice(index + 1, 0, tag);
      this.ProjectService.componentChanged();
    }
  }

  deleteTag(indexOfTagToDelete: number): void {
    if (confirm($localize`Are you sure you want to delete this tag?`)) {
      this.componentContent.tags.splice(indexOfTagToDelete, 1);
      this.ProjectService.componentChanged();
    }
  }
}
