import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { PeerGroupMoveWorkgroupConfirmDialogComponent } from './peer-group-move-workgroup-confirm-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PeerGroupMoveWorkgroupConfirmDialogComponent', () => {
  let component: PeerGroupMoveWorkgroupConfirmDialogComponent;
  let fixture: ComponentFixture<PeerGroupMoveWorkgroupConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerGroupMoveWorkgroupConfirmDialogComponent],
      imports: [MatButtonModule, MatDialogModule, MatIconModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupMoveWorkgroupConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
