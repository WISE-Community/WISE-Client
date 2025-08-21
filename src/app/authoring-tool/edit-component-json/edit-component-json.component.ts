import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { Component as WISEComponent } from '../../../assets/wise5/common/Component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [
    CdkTextareaAutosize,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  selector: 'edit-component-json',
  styles: ['div { margin-top: 10px; margin-bottom: 10px; } .mat-icon { margin: 0px; }'],
  templateUrl: 'edit-component-json.component.html'
})
export class EditComponentJsonComponent {
  @Input() component: WISEComponent;
  protected componentContentJSONString: string;
  protected jsonChanged: Subject<string> = new Subject<string>();
  protected showJSONAuthoring: boolean = false;
  private subscriptions: Subscription = new Subscription();
  private validComponentContentJSONString: string;

  constructor(
    private notificationService: NotificationService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.setComponentContentJsonString();
    this.subscriptions.add(
      this.jsonChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        if (this.isJSONValid()) {
          this.rememberRecentValidJSON();
          this.notificationService.showJSONValidMessage();
        } else {
          this.notificationService.showJSONInvalidMessage();
        }
      })
    );
    this.subscriptions.add(
      this.projectService.nodeChanged$.subscribe(() => {
        this.setComponentContentJsonString();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setComponentContentJsonString(): void {
    this.componentContentJSONString = JSON.stringify(this.component.content, null, 4);
  }

  protected toggleJSONView(): void {
    if (this.showJSONAuthoring) {
      if (this.isJSONValid()) {
        this.saveChanges();
        this.showJSONAuthoring = false;
      } else {
        const doRollback = confirm(
          $localize`The JSON is invalid. Invalid JSON will not be saved.\nClick "OK" to revert back to the last valid JSON.\nClick "Cancel" to keep the invalid JSON open so you can fix it.`
        );
        if (doRollback) {
          this.rollbackToRecentValidJSON();
          this.saveChanges();
        }
      }
    } else {
      this.showJSONAuthoring = true;
      this.rememberRecentValidJSON();
    }
  }

  private isJSONValid(): boolean {
    try {
      JSON.parse(this.componentContentJSONString);
      return true;
    } catch (e) {
      return false;
    }
  }

  private saveChanges(): void {
    try {
      this.projectService
        .getNode(this.component.nodeId)
        .replaceComponent(this.component.id, JSON.parse(this.componentContentJSONString));
      this.projectService.componentChanged();
    } catch (e) {
      this.notificationService.showJSONInvalidMessage();
    }
  }

  private rememberRecentValidJSON(): void {
    this.validComponentContentJSONString = this.componentContentJSONString;
  }

  private rollbackToRecentValidJSON(): void {
    this.componentContentJSONString = this.validComponentContentJSONString;
  }
}
