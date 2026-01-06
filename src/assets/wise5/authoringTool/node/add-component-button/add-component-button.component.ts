import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
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

@Component({
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  selector: 'add-component-button',
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
  private createComponentService = inject(CreateComponentService);
  private dialog = inject(MatDialog);
  private projectService = inject(TeacherProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected firstComponent = false;
  @Input() insertAfterComponentId: string = null;
  @Output() newComponentsEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() node: Node;
  protected tooltipText = $localize`Add component`;

  ngOnInit(): void {
    this.updateUI();
  }

  private updateUI(): void {
    this.firstComponent = this.node.getComponentPosition(this.insertAfterComponentId) === 0;
    if (this.node.components.length > 0 && !this.firstComponent) {
      this.tooltipText = $localize`Add component after`;
    }
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
          this.router.navigate(['import-component/choose-unit'], {
            relativeTo: this.route,
            state: {
              importType: 'component',
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
          this.updateUI();
        }
      });
  }
}
