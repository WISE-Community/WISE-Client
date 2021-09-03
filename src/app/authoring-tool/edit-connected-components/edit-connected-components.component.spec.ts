import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectedComponentsComponent } from './edit-connected-components.component';

describe('EditConnectedComponentsComponent', () => {
  let component: EditConnectedComponentsComponent;
  let fixture: ComponentFixture<EditConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
