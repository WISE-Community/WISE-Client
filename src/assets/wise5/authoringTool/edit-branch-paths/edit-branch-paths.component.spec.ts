import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { EditBranchPathsComponent } from './edit-branch-paths.component';

describe('EditBranchPathsComponent', () => {
  let component: EditBranchPathsComponent;
  let fixture: ComponentFixture<EditBranchPathsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBranchPathsComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(EditBranchPathsComponent);
    component = fixture.componentInstance;
    component.pathFormGroup = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
