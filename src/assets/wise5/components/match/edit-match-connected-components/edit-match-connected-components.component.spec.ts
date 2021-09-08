import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMatchConnectedComponentsComponent } from './edit-match-connected-components.component';

describe('EditMatchConnectedComponentsComponent', () => {
  let component: EditMatchConnectedComponentsComponent;
  let fixture: ComponentFixture<EditMatchConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMatchConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMatchConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
