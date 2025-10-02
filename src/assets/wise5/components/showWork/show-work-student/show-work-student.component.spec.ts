import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowWorkStudentComponent } from './show-work-student.component';
import { MockComponent, MockProviders } from 'ng-mocks';
import { OpenResponseShowWorkComponent } from '../../openResponse/open-response-show-work/open-response-show-work.component';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';

describe('ShowWorkStudentComponent', () => {
  let component: ShowWorkStudentComponent;
  let fixture: ComponentFixture<ShowWorkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent(OpenResponseShowWorkComponent), ShowWorkStudentComponent],
      providers: [MockProviders(NodeService, ProjectService)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowWorkStudentComponent);
    component = fixture.componentInstance;
    component.studentWork = { componentType: 'OpenResponse' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
