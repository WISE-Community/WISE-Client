import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
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
  selector: 'edit-component-tags',
  styles: [
    `
      label {
        margin-right: 10px;
      }
      div {
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .mat-icon {
        margin: 0px;
      }
    `
  ],
  templateUrl: 'edit-component-tags.component.html'
})
export class EditComponentTagsComponent {
  @Input() componentContent: any;
  protected tagChanged: Subject<any> = new Subject<any>();
  private tagChangedSubscription: Subscription;

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.tagChangedSubscription = this.tagChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(({ tagIndex, tag }) => {
        this.componentContent.tags[tagIndex] = tag;
        this.projectService.saveProject();
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
    this.projectService.saveProject();
  }

  moveTagUp(index: number): void {
    if (index > 0) {
      const tag = this.componentContent.tags[index];
      this.componentContent.tags.splice(index, 1);
      this.componentContent.tags.splice(index - 1, 0, tag);
      this.projectService.saveProject();
    }
  }

  moveTagDown(index: number): void {
    if (index < this.componentContent.tags.length - 1) {
      const tag = this.componentContent.tags[index];
      this.componentContent.tags.splice(index, 1);
      this.componentContent.tags.splice(index + 1, 0, tag);
      this.projectService.saveProject();
    }
  }

  deleteTag(indexOfTagToDelete: number): void {
    if (confirm($localize`Are you sure you want to delete this tag?`)) {
      this.componentContent.tags.splice(indexOfTagToDelete, 1);
      this.projectService.saveProject();
    }
  }
}
