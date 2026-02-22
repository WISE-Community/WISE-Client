import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditComponent } from './edit.component';
import { MockComponents } from 'ng-mocks';
import { StudentEditProfileComponent } from '../edit-profile/edit-profile.component';
import { EditPasswordComponent } from '../../../modules/shared/edit-password/edit-password.component';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditComponent, MockComponents(StudentEditProfileComponent, EditPasswordComponent)]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
