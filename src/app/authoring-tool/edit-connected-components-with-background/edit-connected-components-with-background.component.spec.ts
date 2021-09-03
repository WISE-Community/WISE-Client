import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectedComponentsWithBackgroundComponent } from './edit-connected-components-with-background.component';

describe('EditConnectedComponentsWithBackgroundComponent', () => {
  let component: EditConnectedComponentsWithBackgroundComponent;
  let fixture: ComponentFixture<EditConnectedComponentsWithBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConnectedComponentsWithBackgroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentsWithBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
