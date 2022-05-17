import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

import { PeerGroupUnassignedWorkgroupsComponent } from './peer-group-unassigned-workgroups.component';

describe('PeerGroupUnassignedWorkgroupsComponent', () => {
  let component: PeerGroupUnassignedWorkgroupsComponent;
  let fixture: ComponentFixture<PeerGroupUnassignedWorkgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerGroupUnassignedWorkgroupsComponent],
      imports: [DragDropModule, FlexLayoutModule, MatCardModule, MatDialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupUnassignedWorkgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
