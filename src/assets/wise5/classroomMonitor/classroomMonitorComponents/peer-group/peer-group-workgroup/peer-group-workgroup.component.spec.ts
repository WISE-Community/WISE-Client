import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerGroupWorkgroupComponent } from './peer-group-workgroup.component';

describe('PeerGroupWorkgroupComponent', () => {
  let component: PeerGroupWorkgroupComponent;
  let fixture: ComponentFixture<PeerGroupWorkgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerGroupWorkgroupComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupWorkgroupComponent);
    component = fixture.componentInstance;
    component.workgroup = { username: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
