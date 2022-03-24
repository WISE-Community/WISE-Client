import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodeService } from '../../../services/nodeService';

@Component({
  selector: 'save-starter-state',
  templateUrl: 'save-starter-state.component.html'
})
export class SaveStarterStateComponent implements OnInit {
  @Input()
  componentId: string;

  isDirty: boolean = false;

  @Input()
  nodeId: string;

  @Input()
  starterState: any;

  constructor(private matDialog: MatDialog, private nodeService: NodeService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.isDirty = !changes.starterState.isFirstChange();
  }

  confirmSave() {
    if (confirm($localize`Are you sure you want to save the starter state?`)) {
      this.nodeService.respondStarterState({
        nodeId: this.nodeId,
        componentId: this.componentId,
        starterState: this.starterState
      });
      this.isDirty = false;
    }
  }

  confirmDelete() {
    if (
      confirm(
        $localize`Are you sure you want to delete the starter state? This will also close this preview window.`
      )
    ) {
      this.nodeService.deleteStarterState({
        nodeId: this.nodeId,
        componentId: this.componentId
      });
      this.matDialog.closeAll();
    }
  }
}
