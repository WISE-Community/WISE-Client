import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupAssignedWorkgroupsComponent } from './peer-group-assigned-workgroups.component';

let component: PeerGroupAssignedWorkgroupsComponent;
let fixture: ComponentFixture<PeerGroupAssignedWorkgroupsComponent>;

describe('PeerGroupAssignedWorkgroupsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeerGroupAssignedWorkgroupsComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(PeerGroupAssignedWorkgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
