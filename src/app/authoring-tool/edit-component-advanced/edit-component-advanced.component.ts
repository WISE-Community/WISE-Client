import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component as WiseComponent } from '../../../assets/wise5/common/Component';

@Component({
  selector: 'edit-component-advanced',
  templateUrl: './edit-component-advanced.component.html',
  styleUrls: ['./edit-component-advanced.component.scss']
})
export class EditComponentAdvancedComponent implements OnInit {
  component: WiseComponent;
  nodeId: string;

  constructor(
    public dialogRef: MatDialogRef<EditComponentAdvancedComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.component = data.component;
    this.nodeId = data.nodeId;
  }

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }
}
