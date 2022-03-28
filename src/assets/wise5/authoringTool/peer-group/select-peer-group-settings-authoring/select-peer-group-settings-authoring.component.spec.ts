import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPeerGroupSettingsAuthoringComponent } from './select-peer-group-settings-authoring.component';

describe('SelectPeerGroupSettingsAuthoringComponent', () => {
  let component: SelectPeerGroupSettingsAuthoringComponent;
  let fixture: ComponentFixture<SelectPeerGroupSettingsAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPeerGroupSettingsAuthoringComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupSettingsAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
