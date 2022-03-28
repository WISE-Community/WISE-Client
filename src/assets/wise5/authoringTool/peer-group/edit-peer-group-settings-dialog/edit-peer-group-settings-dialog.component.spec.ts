import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPeerGroupSettingsDialogComponent } from './edit-peer-group-settings-dialog.component';

describe('EditPeerGroupSettingsDialogComponent', () => {
  let component: EditPeerGroupSettingsDialogComponent;
  let fixture: ComponentFixture<EditPeerGroupSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPeerGroupSettingsDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPeerGroupSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
