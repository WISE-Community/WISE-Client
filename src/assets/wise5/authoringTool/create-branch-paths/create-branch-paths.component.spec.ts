import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { CreateBranchPathsComponent } from './create-branch-paths.component';

describe('CreateBranchPathComponent', () => {
  let component: CreateBranchPathsComponent;
  let fixture: ComponentFixture<CreateBranchPathsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBranchPathsComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();
    fixture = TestBed.createComponent(CreateBranchPathsComponent);
    component = fixture.componentInstance;
    component.pathFormGroup = new FormGroup({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
