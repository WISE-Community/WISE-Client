import * as angular from 'angular';
import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { Component as WISEComponent } from '../../../assets/wise5/common/Component';

@Component({
  selector: 'edit-component-json',
  templateUrl: 'edit-component-json.component.html',
  styleUrls: ['edit-component-json.component.scss']
})
export class EditComponentJsonComponent {
  validComponentContentJSONString: string;
  componentContentJSONString: string;
  @Input() component: WISEComponent;
  showJSONAuthoring: boolean = false;
  jsonChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit() {
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setComponentContentJsonString() {
    this.componentContentJSONString = angular.toJson(this.component.content, 4);
  }

  toggleJSONView(): void {
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

  isJSONValid(): boolean {
    try {
      JSON.parse(this.componentContentJSONString);
      return true;
    } catch (e) {
      return false;
    }
  }

  saveChanges(): void {
    try {
      const editedComponentContent = angular.fromJson(this.componentContentJSONString);
      this.projectService.replaceComponent(
        this.component.nodeId,
        this.component.id,
        editedComponentContent
      );
      this.projectService.componentChanged();
    } catch (e) {
      this.notificationService.showJSONInvalidMessage();
    }
  }

  rememberRecentValidJSON(): void {
    this.validComponentContentJSONString = this.componentContentJSONString;
  }

  rollbackToRecentValidJSON(): void {
    this.componentContentJSONString = this.validComponentContentJSONString;
  }
}
