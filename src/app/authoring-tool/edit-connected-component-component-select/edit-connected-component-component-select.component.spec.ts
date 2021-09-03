import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectedComponentComponentSelectComponent } from './edit-connected-component-component-select.component';

describe('EditConnectedComponentComponentSelectComponent', () => {
  let component: EditConnectedComponentComponentSelectComponent;
  let fixture: ComponentFixture<EditConnectedComponentComponentSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConnectedComponentComponentSelectComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentComponentSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
