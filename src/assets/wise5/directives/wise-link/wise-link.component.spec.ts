import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { NotebookService } from '../../services/notebookService';
import { StudentDataService } from '../../services/studentDataService';
import { WiseLinkComponent } from './wise-link.component';

describe('WiseLinkComponent', () => {
  let component: WiseLinkComponent;
  let fixture: ComponentFixture<WiseLinkComponent>;
  const nodeId1 = 'node1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [WiseLinkComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WiseLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should go to step', () => {
    const closeAllSpy = spyOn(TestBed.inject(MatDialog), 'closeAll');
    const closeNotesSpy = spyOn(TestBed.inject(NotebookService), 'closeNotes');
    const setCurrentNodeByNodeIdSpy = spyOn(
      TestBed.inject(StudentDataService),
      'setCurrentNodeByNodeId'
    );
    component.nodeId = nodeId1;
    component.goToStep();
    expect(closeAllSpy).toHaveBeenCalled();
    expect(closeNotesSpy).toHaveBeenCalled();
    expect(setCurrentNodeByNodeIdSpy).toHaveBeenCalledWith(nodeId1);
  });
});
