import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimedNodeComponent } from './timed-node.component';

describe('TimedNodeComponent', () => {
  let component: TimedNodeComponent;
  let fixture: ComponentFixture<TimedNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimedNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimedNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
