import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring.component';

xdescribe('DialogGuidanceAuthoringComponent', () => {
  let component: DialogGuidanceAuthoringComponent;
  let fixture: ComponentFixture<DialogGuidanceAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogGuidanceAuthoringComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
