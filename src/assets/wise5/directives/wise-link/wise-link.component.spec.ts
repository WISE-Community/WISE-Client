import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { StudentDataService } from '../../services/studentDataService';
import { WiseLinkComponent } from './wise-link.component';
import { provideHttpClient } from '@angular/common/http';
import { MockProviders } from 'ng-mocks';
import { ProjectService } from '../../services/projectService';

describe('WiseLinkComponent', () => {
  let component: WiseLinkComponent;
  let fixture: ComponentFixture<WiseLinkComponent>;
  const nodeId1 = 'node1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiseLinkComponent],
      providers: [MockProviders(MatDialog, ProjectService, StudentDataService), provideHttpClient()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WiseLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should go to step', () => {
    const closeAllSpy = spyOn(TestBed.inject(MatDialog), 'closeAll');
    const setCurrentNodeByNodeIdSpy = spyOn(
      TestBed.inject(StudentDataService),
      'setCurrentNodeByNodeId'
    );
    component.nodeId = nodeId1;
    component['goToStep']();
    expect(closeAllSpy).toHaveBeenCalled();
    expect(setCurrentNodeByNodeIdSpy).toHaveBeenCalledWith(nodeId1);
  });
});
