import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockProvider, MockProviders } from 'ng-mocks';
import { ConfigService } from '../../../services/configService';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ChooseSimulationComponent } from './choose-simulation.component';

describe('ChooseSimulationComponent', () => {
  let component: ChooseSimulationComponent;
  let fixture: ComponentFixture<ChooseSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseSimulationComponent],
      providers: [
        MockProviders(
          ConfigService,
          CopyNodesService,
          InsertFirstNodeInBranchPathService,
          InsertNodesService
        ),
        MockProvider(TeacherProjectService, { retrieveProjectById: () => Promise.resolve({}) }),
        provideRouter([])
      ]
    }).compileComponents();
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(ChooseSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
