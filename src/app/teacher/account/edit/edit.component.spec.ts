import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditComponent } from './edit.component';
import { MockComponents, MockProvider } from 'ng-mocks';
import { TeacherEditProfileComponent } from '../edit-profile/edit-profile.component';
import { UserService } from '../../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../domain/user';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EditComponent, MockComponents(TeacherEditProfileComponent)],
      providers: [
        MockProvider(UserService, {
          getUser: () => new BehaviorSubject<User>(null)
        })
      ]
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
