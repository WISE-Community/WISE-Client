import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerGroupAssignedWorkgroupsComponent } from './peer-group-assigned-workgroups.component';

describe('PeerGroupAssignedWorkgroupsComponent', () => {
  let component: PeerGroupAssignedWorkgroupsComponent;
  let fixture: ComponentFixture<PeerGroupAssignedWorkgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerGroupAssignedWorkgroupsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupAssignedWorkgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
