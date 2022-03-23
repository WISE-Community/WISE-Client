import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPeerGroupingComponent } from './new-peer-grouping.component';

describe('NewPeerGroupingComponent', () => {
  let component: NewPeerGroupingComponent;
  let fixture: ComponentFixture<NewPeerGroupingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPeerGroupingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPeerGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
