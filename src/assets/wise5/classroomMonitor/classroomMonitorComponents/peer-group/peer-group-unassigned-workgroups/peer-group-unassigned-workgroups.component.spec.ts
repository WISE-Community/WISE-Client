import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { PeerGroupUnassignedWorkgroupsComponent } from './peer-group-unassigned-workgroups.component';
import { MockComponent } from 'ng-mocks';
import { PeerGroupWorkgroupComponent } from '../peer-group-workgroup/peer-group-workgroup.component';
import { By } from '@angular/platform-browser';

describe('PeerGroupUnassignedWorkgroupsComponent', () => {
  let component: PeerGroupUnassignedWorkgroupsComponent;
  let fixture: ComponentFixture<PeerGroupUnassignedWorkgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PeerGroupUnassignedWorkgroupsComponent,
        MockComponent(PeerGroupWorkgroupComponent)
      ],
      imports: [DragDropModule, MatCardModule, MatDialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupUnassignedWorkgroupsComponent);
    component = fixture.componentInstance;
    component.unassignedWorkgroups = [
      { id: 1, name: 'Workgroup 1' },
      { id: 2, name: 'Workgroup 2' }
    ];
    fixture.detectChanges();
  });

  it('should display 2 workgroups', () => {
    expect(fixture.debugElement.queryAll(By.css('li')).length).toEqual(2);
  });
});
