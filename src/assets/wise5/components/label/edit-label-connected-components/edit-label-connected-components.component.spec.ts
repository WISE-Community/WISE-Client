import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabelConnectedComponentsComponent } from './edit-label-connected-components.component';

describe('EditLabelConnectedComponentsComponent', () => {
  let component: EditLabelConnectedComponentsComponent;
  let fixture: ComponentFixture<EditLabelConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLabelConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabelConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
