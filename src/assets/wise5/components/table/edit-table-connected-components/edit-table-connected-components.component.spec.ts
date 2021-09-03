import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTableConnectedComponentsComponent } from './edit-table-connected-components.component';

describe('EditTableConnectedComponentsComponent', () => {
  let component: EditTableConnectedComponentsComponent;
  let fixture: ComponentFixture<EditTableConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTableConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTableConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
