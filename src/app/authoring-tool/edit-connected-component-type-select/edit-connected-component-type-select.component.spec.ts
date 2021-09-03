import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectedComponentTypeSelectComponent } from './edit-connected-component-type-select.component';

describe('EditConnectedComponentTypeSelectComponent', () => {
  let component: EditConnectedComponentTypeSelectComponent;
  let fixture: ComponentFixture<EditConnectedComponentTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConnectedComponentTypeSelectComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
