import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatDialog } from '@angular/material/dialog';
import { ChooseNewComponent } from '../../../../../app/authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { filter } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Node } from '../../../common/Node';

@Component({
  selector: 'add-component-button',
  templateUrl: './add-component-button.component.html'
})
export class AddComponentButtonComponent {
  @Input() insertAfterComponentId: string = null;
  @Input() node: Node;
  @Output() newComponentsEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected addComponent(): void {
    this.dialog
      .open(ChooseNewComponent, {
        data: this.insertAfterComponentId,
        width: '80%'
      })
      .afterClosed()
      .pipe(filter((componentType) => componentType != null))
      .subscribe(({ action, componentType }) => {
        if (action === 'import') {
          this.router.navigate(['import-component/choose-component'], {
            relativeTo: this.route,
            state: {
              insertAfterComponentId: this.insertAfterComponentId
            }
          });
        } else {
          const component = this.projectService.createComponent(
            this.node.id,
            componentType,
            this.insertAfterComponentId
          );
          this.projectService.saveProject();
          this.newComponentsEvent.emit([component]);
        }
      });
  }
}
