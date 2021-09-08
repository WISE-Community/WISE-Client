import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiscussionConnectedComponentsComponent } from './edit-discussion-connected-components.component';

describe('EditDiscussionConnectedComponentsComponent', () => {
  let component: EditDiscussionConnectedComponentsComponent;
  let fixture: ComponentFixture<EditDiscussionConnectedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDiscussionConnectedComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiscussionConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
