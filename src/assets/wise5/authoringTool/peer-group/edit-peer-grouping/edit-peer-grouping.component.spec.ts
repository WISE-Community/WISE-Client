import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPeerGroupingComponent } from './edit-peer-grouping.component';

describe('EditPeerGroupingComponent', () => {
  let component: EditPeerGroupingComponent;
  let fixture: ComponentFixture<EditPeerGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPeerGroupingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPeerGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
