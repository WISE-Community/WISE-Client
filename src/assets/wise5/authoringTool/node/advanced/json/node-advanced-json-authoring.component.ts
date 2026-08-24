import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NotificationService } from '../../../../services/notificationService';
import { Component, Input, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CdkTextareaAutosize, FormsModule, MatFormFieldModule, MatIconModule, MatInputModule],
  selector: 'node-advanced-json-authoring',
  template: `<div class="mb-2">
      <mat-icon color="warn" class="align-bottom">warning</mat-icon>
      <span i18n class="warn">
        Editing the JSON directly is generally not recommended, as errors can break the unit. If you
        need assistance, please contact WISE staff.
      </span>
    </div>
    <mat-form-field class="w-full" appearance="outline">
      <mat-label i18n>Edit Step JSON</mat-label>
      <textarea
        class="mat-body-2"
        matInput
        cdkTextareaAutosize
        [(ngModel)]="nodeContentJSONString"
        (ngModelChange)="nodeContentChanged.next($event)"
      ></textarea>
    </mat-form-field>`
})
export class NodeAdvancedJsonAuthoringComponent implements OnInit {
  @Input() node: any;
  protected nodeContentJSONString: string;
  protected nodeContentChanged: Subject<string> = new Subject<string>();
  protected nodeContentChangedSubscription: Subscription;

  constructor(
    private notificationService: NotificationService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.nodeContentJSONString = JSON.stringify(this.node, null, 4);
    this.notificationService.showJSONValidMessage();
    this.nodeContentChangedSubscription = this.nodeContentChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((newText) => {
        this.nodeContentJSONString = newText;
        this.saveJSON();
      });
  }

  ngOnDestroy(): void {
    this.nodeContentChangedSubscription.unsubscribe();
  }

  protected saveJSON(): void {
    try {
      const updatedNode = JSON.parse(this.nodeContentJSONString);
      this.node = updatedNode;
      this.projectService.setNode(this.node.id, updatedNode);
      this.projectService.saveProject().then(() => {
        this.projectService.refreshProject();
      });
      this.notificationService.showJSONValidMessage();
    } catch (e) {
      this.notificationService.showJSONInvalidMessage();
    }
  }
}
