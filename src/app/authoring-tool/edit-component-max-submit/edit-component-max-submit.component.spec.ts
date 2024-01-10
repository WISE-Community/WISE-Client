import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponentMaxSubmitComponent } from './edit-component-max-submit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditComponentMaxSubmitComponent', () => {
  let component: EditComponentMaxSubmitComponent;
  let fixture: ComponentFixture<EditComponentMaxSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditComponentMaxSubmitComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentMaxSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
