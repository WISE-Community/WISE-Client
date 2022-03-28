import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPeerGroupSettingsDialogComponent } from './create-new-peer-group-settings-dialog.component';

describe('CreateNewPeerGroupSettingsDialogComponent', () => {
  let component: CreateNewPeerGroupSettingsDialogComponent;
  let fixture: ComponentFixture<CreateNewPeerGroupSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewPeerGroupSettingsDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPeerGroupSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
