import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCRaterInfoComponent } from './edit-crater-info.component';

describe('EditCRaterInfoComponent', () => {
  let component: EditCRaterInfoComponent;
  let fixture: ComponentFixture<EditCRaterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCRaterInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCRaterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
