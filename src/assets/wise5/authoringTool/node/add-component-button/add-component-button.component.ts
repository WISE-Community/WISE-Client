import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateComponentService } from '../../../services/createComponentService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatDialog } from '@angular/material/dialog';
import { ChooseNewComponent } from '../../../../../app/authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { filter } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Node } from '../../../common/Node';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  selector: 'add-component-button',
  standalone: true,
  styles: [
    `
      .rotate-180 {
        transform: rotate(180deg);
      }
      .flip-vertical {
        transform: scaleY(-1);
      }
    `
  ],
  templateUrl: './add-component-button.component.html'
})
export class AddComponentButtonComponent {
  protected firstComponent = false;
  @Input() insertAfterComponentId: string = null;
  @Input() node: Node;
  @Output() newComponentsEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private createComponentService: CreateComponentService,
    private dialog: MatDialog,
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setFirstComponent();
  }

  private setFirstComponent(): void {
    this.firstComponent = this.node.getComponentPosition(this.insertAfterComponentId) === 0;
  }

  protected addFirstComponent(): void {
    this.addComponent(null);
  }

  protected addComponent(afterComponent = this.insertAfterComponentId): void {
    this.dialog
      .open(ChooseNewComponent, {
        data: afterComponent,
        width: '80%'
      })
      .afterClosed()
      .pipe(filter((componentType) => componentType != null))
      .subscribe(({ action, componentType }) => {
        if (action === 'import') {
          this.router.navigate(['import-component/choose-component'], {
            relativeTo: this.route,
            state: {
              insertAfterComponentId: afterComponent
            }
          });
        } else {
          const component = this.createComponentService.create(
            this.node.id,
            componentType,
            afterComponent
          );
          this.projectService.saveProject();
          this.newComponentsEvent.emit([component]);
          this.setFirstComponent();
        }
      });
  }
}
