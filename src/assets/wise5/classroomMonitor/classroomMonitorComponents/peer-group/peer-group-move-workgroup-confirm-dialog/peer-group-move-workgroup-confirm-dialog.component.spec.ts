import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupMoveWorkgroupConfirmDialogComponent } from './peer-group-move-workgroup-confirm-dialog.component';

describe('PeerGroupMoveWorkgroupConfirmDialogComponent', () => {
  let component: PeerGroupMoveWorkgroupConfirmDialogComponent;
  let fixture: ComponentFixture<PeerGroupMoveWorkgroupConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupMoveWorkgroupConfirmDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
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
