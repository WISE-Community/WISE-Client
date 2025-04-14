import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCRaterDescriptionComponent } from './edit-crater-description.component';

describe('EditCRaterDescriptionComponent', () => {
  let component: EditCRaterDescriptionComponent;
  let fixture: ComponentFixture<EditCRaterDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCRaterDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCRaterDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
