import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { Component as WISEComponent } from '../../../common/Component';

@Component({
  selector: 'save-starter-state',
  templateUrl: 'save-starter-state.component.html'
})
export class SaveStarterStateComponent implements OnInit {
  @Input() private component: WISEComponent;
  protected isDirty: boolean;
  @Input() private starterState: any;

  constructor(private matDialog: MatDialog, private nodeService: TeacherNodeService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.isDirty = !changes.starterState.isFirstChange();
  }

  protected confirmSave(): void {
    if (confirm($localize`Are you sure you want to save the starter state?`)) {
      this.nodeService.respondStarterState({
        nodeId: this.component.nodeId,
        componentId: this.component.id,
        starterState: this.starterState
      });
      this.isDirty = false;
    }
  }

  protected confirmDelete(): void {
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
