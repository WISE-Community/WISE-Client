import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeGradingComponent } from './node-grading.component';

describe('NodeGradingComponent', () => {
  let component: NodeGradingComponent;
  let fixture: ComponentFixture<NodeGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeGradingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
