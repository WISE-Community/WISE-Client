import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectedComponentsAddButtonComponent } from './edit-connected-components-add-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditConnectedComponentsAddButtonComponent', () => {
  let component: EditConnectedComponentsAddButtonComponent;
  let fixture: ComponentFixture<EditConnectedComponentsAddButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConnectedComponentsAddButtonComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentsAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
