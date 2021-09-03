import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectedComponentNodeSelectComponent } from './edit-connected-component-node-select.component';

describe('EditConnectedComponentNodeSelectComponent', () => {
  let component: EditConnectedComponentNodeSelectComponent;
  let fixture: ComponentFixture<EditConnectedComponentNodeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditConnectedComponentNodeSelectComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentNodeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
