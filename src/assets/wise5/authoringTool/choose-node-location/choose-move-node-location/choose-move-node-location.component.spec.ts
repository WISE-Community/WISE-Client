import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseMoveNodeLocationComponent } from './choose-move-node-location.component';
import { MoveNodesService } from '../../../services/moveNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { provideRouter } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { Node } from '../../../common/Node';

let component: ChooseMoveNodeLocationComponent;
let fixture: ComponentFixture<ChooseMoveNodeLocationComponent>;
describe('ChooseMoveNodeLocationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseMoveNodeLocationComponent],
      providers: [
        MockProvider(MoveNodesService),
        MockProvider(TeacherProjectService, {
          idToOrder: {}
        }),
        provideRouter([])
      ]
    });
    window.history.pushState(
      {
        selectedNodeIds: ['node1']
      },
      '',
      ''
    );
    fixture = TestBed.createComponent(ChooseMoveNodeLocationComponent);
    component = fixture.componentInstance;
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getNode').and.returnValue(new Node());
    spyOn(projectService, 'getInactiveGroupNodes').and.returnValue([]);
    spyOn(projectService, 'getInactiveStepNodes').and.returnValue([]);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
