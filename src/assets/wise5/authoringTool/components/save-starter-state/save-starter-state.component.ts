import { Component, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { Component as WISEComponent } from '../../../common/Component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [FlexLayoutModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'save-starter-state',
  standalone: true,
  templateUrl: 'save-starter-state.component.html'
})
export class SaveStarterStateComponent {
  @Input() private component: WISEComponent;
  protected dirty: boolean;
  @Input() private starterState: any;

  constructor(private matDialog: MatDialog, private nodeService: TeacherNodeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dirty = !changes.starterState.isFirstChange();
  }

  protected save(): void {
    if (confirm($localize`Are you sure you want to save the starter state?`)) {
      this.nodeService.respondStarterState({
        nodeId: this.component.nodeId,
        componentId: this.component.id,
        starterState: this.starterState
      });
      this.dirty = false;
    }
  }

  protected delete(): void {
    if (
      confirm(
        $localize`Are you sure you want to delete the starter state? This will also close this preview window.`
      )
    ) {
      this.nodeService.deleteStarterState({
        nodeId: this.component.nodeId,
        componentId: this.component.id
      });
      this.matDialog.closeAll();
    }
  }
}
