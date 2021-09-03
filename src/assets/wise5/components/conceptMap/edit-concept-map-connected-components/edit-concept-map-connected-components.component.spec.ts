import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConceptMapConnectedComponentsComponent } from './edit-concept-map-connected-components.component';

describe('EditConceptMapConnectedComponentsComponent', () => {
  let component: EditConceptMapConnectedComponentsComponent;
  let fixture: ComponentFixture<EditConceptMapConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConceptMapConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConceptMapConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
