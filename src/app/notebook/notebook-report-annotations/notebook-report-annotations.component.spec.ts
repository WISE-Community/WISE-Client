import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { UtilService } from '../../../assets/wise5/services/utilService';
import { VLEProjectService } from '../../../assets/wise5/vle/vleProjectService';
import { NotebookReportAnnotationsComponent } from './notebook-report-annotations.component';

let component: NotebookReportAnnotationsComponent;

describe('NotebookReportAnnotationsComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [NotebookReportAnnotationsComponent],
      providers: [ConfigService, ProjectService, SessionService, UtilService, VLEProjectService]
    });
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(NotebookReportAnnotationsComponent);
    component = fixture.componentInstance;
  });

  setLabelAndIcon();
});

function setLabelAndIcon() {
  it('should set label and icon', () => {
    const annotation = {
      type: 'autoComment'
    };
    spyOn(component, 'getLatestAnnotation').and.returnValue(annotation);
    expect(component.label).toEqual('');
    expect(component.icon).toEqual('person');
    component.setLabelAndIcon();
    expect(component.label).toEqual('Computer Feedback');
    expect(component.icon).toEqual('keyboard');
  });
}
