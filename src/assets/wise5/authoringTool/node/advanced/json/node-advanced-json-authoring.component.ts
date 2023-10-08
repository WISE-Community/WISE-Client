import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NotificationService } from '../../../../services/notificationService';
import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'node-advanced-json-authoring',
  templateUrl: './node-advanced-json-authoring.component.html'
})
export class NodeAdvancedJsonAuthoringComponent implements OnInit {
  protected node: any;
  protected nodeContentJSONString: string;
  protected nodeContentChanged: Subject<string> = new Subject<string>();
  protected nodeContentChangedSubscription: Subscription;
  protected nodeId: string;

  constructor(
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.parent.parent.params.subscribe((params) => {
      this.nodeId = params.nodeId;
      this.node = this.projectService.getNodeById(this.nodeId);
      this.nodeContentJSONString = JSON.stringify(this.node, null, 4);
      this.notificationService.showJSONValidMessage();
      this.nodeContentChangedSubscription = this.nodeContentChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe((newText) => {
          this.nodeContentJSONString = newText;
          this.autoSaveJSON();
        });
    });
  }

  ngOnDestroy() {
    this.nodeContentChangedSubscription.unsubscribe();
  }

  protected autoSaveJSON(): void {
    try {
      const updatedNode = JSON.parse(this.nodeContentJSONString);
      this.node = updatedNode;
      this.projectService.setNode(this.nodeId, updatedNode);
      this.projectService.saveProject().then(() => {
        this.projectService.refreshProject();
      });
      this.notificationService.showJSONValidMessage();
    } catch (e) {
      this.notificationService.showJSONInvalidMessage();
    }
  }
}
