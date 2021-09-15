import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponentMaxSubmitComponent } from './edit-component-max-submit.component';

describe('EditComponentMaxSubmitComponent', () => {
  let component: EditComponentMaxSubmitComponent;
  let fixture: ComponentFixture<EditComponentMaxSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditComponentMaxSubmitComponent ]
    })
    .compileComponents();
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
