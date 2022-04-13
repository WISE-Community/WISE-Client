import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectedComponentDeleteButtonComponent } from './edit-connected-component-delete-button.component';

describe('EditConnectedComponentDeleteButtonComponent', () => {
  let component: EditConnectedComponentDeleteButtonComponent;
  let fixture: ComponentFixture<EditConnectedComponentDeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConnectedComponentDeleteButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
