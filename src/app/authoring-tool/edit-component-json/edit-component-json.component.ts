import * as angular from 'angular';
import { Component, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from '../../../assets/wise5/services/notificationService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'edit-component-json',
  templateUrl: 'edit-component-json.component.html',
  styleUrls: ['edit-component-json.component.scss']
})
export class EditComponentJsonComponent {
  validComponentContentJSONString: string;
  componentContentJSONString: string;
  @Input()
  componentId: string;
  @Input()
  nodeId: string;
  showJSONAuthoring: boolean = false;
  jsonChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();

  constructor(
    private NotificationService: NotificationService,
    private ProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.setComponentContentJsonString();
    this.subscriptions.add(
      this.jsonChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        if (this.isJSONValid()) {
          this.rememberRecentValidJSON();
          this.NotificationService.showJSONValidMessage();
        } else {
          this.NotificationService.showJSONInvalidMessage();
        }
      })
    );
    this.subscriptions.add(
      this.ProjectService.nodeChanged$.subscribe(() => {
        this.setComponentContentJsonString();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setComponentContentJsonString() {
    const componentContent = this.ProjectService.getComponent(this.nodeId, this.componentId);
    this.componentContentJSONString = angular.toJson(componentContent, 4);
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
      this.ProjectService.replaceComponent(this.nodeId, this.componentId, editedComponentContent);
      this.ProjectService.componentChanged();
    } catch (e) {
      this.NotificationService.showJSONInvalidMessage();
    }
  }

  rememberRecentValidJSON(): void {
    this.validComponentContentJSONString = this.componentContentJSONString;
  }

  rollbackToRecentValidJSON(): void {
    this.componentContentJSONString = this.validComponentContentJSONString;
  }
}
