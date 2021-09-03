import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGraphConnectedComponentsComponent } from './edit-graph-connected-components.component';

describe('EditGraphConnectedComponentsComponent', () => {
  let component: EditGraphConnectedComponentsComponent;
  let fixture: ComponentFixture<EditGraphConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGraphConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGraphConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
