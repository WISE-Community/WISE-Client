import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProviders } from 'ng-mocks';
import { ConfigService } from '../../services/configService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { NotebookAuthoringComponent } from './notebook-authoring.component';

describe('NotebookAuthoringComponent', () => {
  let component: NotebookAuthoringComponent;
  let fixture: ComponentFixture<NotebookAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookAuthoringComponent],
      providers: [MockProviders(ConfigService, TeacherProjectService)]
    }).compileComponents();
    TestBed.inject(TeacherProjectService).project = {};
    fixture = TestBed.createComponent(NotebookAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
