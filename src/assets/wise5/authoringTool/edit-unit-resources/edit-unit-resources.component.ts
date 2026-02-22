import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherProjectService } from '../../services/teacherProjectService';

class UnitResource {
  name: string;
  url: string;
  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}

@Component({
  imports: [
    CommonModule,
    CdkTextareaAutosize,
    DragDropModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  selector: 'edit-unit-resources',
  styleUrl: './edit-unit-resources.component.scss',
  templateUrl: './edit-unit-resources.component.html'
})
export class EditUnitResourcesComponent {
  protected inputChanged: Subject<string> = new Subject<string>();
  @Input() resources: UnitResource[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.inputChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(() => this.projectService.saveProject())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected drop(event: CdkDragDrop<string[]>): void {
    this.moveRuleItem(event.previousIndex, event.currentIndex);
  }

  protected moveUp(ruleIndex: number): void {
    this.moveRuleItem(ruleIndex, ruleIndex - 1);
  }

  protected moveDown(ruleIndex: number): void {
    this.moveRuleItem(ruleIndex, ruleIndex + 1);
  }

  protected moveRuleItem(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.resources, previousIndex, currentIndex);
    this.projectService.saveProject();
  }

  protected addNewResource(addToTop: boolean): void {
    const location = addToTop ? 0 : this.resources.length;
    this.resources.splice(location, 0, new UnitResource('', ''));
    this.projectService.saveProject();
    if (!addToTop) {
      this.scrollToBottomOfList();
    }
  }

  private scrollToBottomOfList(): void {
    setTimeout(() => {
      const button = document.getElementById('add-new-resource-bottom-button');
      if (button) {
        button.scrollIntoView();
      }
    }, 0);
  }

  protected deleteResource(resourceIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this resource?`)) {
      this.resources.splice(resourceIndex, 1);
      this.projectService.saveProject();
    }
  }
}
