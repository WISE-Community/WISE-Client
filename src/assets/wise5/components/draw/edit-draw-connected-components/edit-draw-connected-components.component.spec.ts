import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrawConnectedComponentsComponent } from './edit-draw-connected-components.component';

describe('EditDrawConnectedComponentsComponent', () => {
  let component: EditDrawConnectedComponentsComponent;
  let fixture: ComponentFixture<EditDrawConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDrawConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrawConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
