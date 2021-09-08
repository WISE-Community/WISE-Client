import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultipleChoiceConnectedComponentsComponent } from './edit-multiple-choice-connected-components.component';

describe('EditMultipleChoiceConnectedComponentsComponent', () => {
  let component: EditMultipleChoiceConnectedComponentsComponent;
  let fixture: ComponentFixture<EditMultipleChoiceConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMultipleChoiceConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultipleChoiceConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
