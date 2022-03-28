import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPeerGroupSettingsOptionComponent } from './select-peer-group-settings-option.component';

describe('SelectPeerGroupSettingsComponent', () => {
  let component: SelectPeerGroupSettingsOptionComponent;
  let fixture: ComponentFixture<SelectPeerGroupSettingsOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPeerGroupSettingsOptionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupSettingsOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
