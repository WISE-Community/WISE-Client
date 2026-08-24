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
  styles: ['.mat-icon { margin: 0px; }'],
  templateUrl: 'edit-component-json.component.html'
})
export class EditComponentJsonComponent {
  @Input() component: WISEComponent;
  protected componentContentJSONString: string;
  protected jsonChanged: Subject<string> = new Subject<string>();
  private subscriptions: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.componentContentJSONString = JSON.stringify(this.component.content, null, 4);
    this.subscriptions.add(
      this.jsonChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((newText) => {
        this.componentContentJSONString = newText;
        this.saveChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private saveChanges(): void {
    try {
      this.projectService
        .getNode(this.component.nodeId)
        .replaceComponent(this.component.id, JSON.parse(this.componentContentJSONString));
      this.projectService.saveProject();
      this.notificationService.showJSONValidMessage();
    } catch (e) {
      this.notificationService.showJSONInvalidMessage();
    }
  }
}
