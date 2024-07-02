import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBranchComponent } from './edit-branch.component';

describe('EditBranchComponent', () => {
  let component: EditBranchComponent;
  let fixture: ComponentFixture<EditBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBranchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
