import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectedComponentDefaultSelectsComponent } from './edit-connected-component-default-selects.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditConnectedComponentDefaultSelectsComponent', () => {
  let component: EditConnectedComponentDefaultSelectsComponent;
  let fixture: ComponentFixture<EditConnectedComponentDefaultSelectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConnectedComponentDefaultSelectsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentDefaultSelectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
