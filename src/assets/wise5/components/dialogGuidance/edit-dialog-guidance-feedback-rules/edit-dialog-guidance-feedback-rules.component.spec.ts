import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDialogGuidanceFeedbackRulesComponent } from './edit-dialog-guidance-feedback-rules.component';

describe('EditDialogGuidanceFeedbackRulesComponent', () => {
  let component: EditDialogGuidanceFeedbackRulesComponent;
  let fixture: ComponentFixture<EditDialogGuidanceFeedbackRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDialogGuidanceFeedbackRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDialogGuidanceFeedbackRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
