import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGuidanceGradingComponent } from './dialog-guidance-grading.component';

xdescribe('DialogGuidanceGradingComponent', () => {
  let component: DialogGuidanceGradingComponent;
  let fixture: ComponentFixture<DialogGuidanceGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogGuidanceGradingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
