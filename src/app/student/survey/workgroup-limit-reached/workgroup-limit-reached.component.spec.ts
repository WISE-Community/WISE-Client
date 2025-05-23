import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkgroupLimitReachedComponent } from './workgroup-limit-reached.component';

describe('WorkgroupLimitReachedComponent', () => {
  let component: WorkgroupLimitReachedComponent;
  let fixture: ComponentFixture<WorkgroupLimitReachedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkgroupLimitReachedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkgroupLimitReachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
