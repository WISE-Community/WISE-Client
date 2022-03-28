import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPeerGroupSettingsDialogComponent } from './select-peer-group-settings-dialog.component';

describe('SelectPeerGroupSettingsDialogComponent', () => {
  let component: SelectPeerGroupSettingsDialogComponent;
  let fixture: ComponentFixture<SelectPeerGroupSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPeerGroupSettingsDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
