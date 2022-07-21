import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { NotebookReportAnnotationsComponent } from './notebook-report-annotations.component';

let component: NotebookReportAnnotationsComponent;

describe('NotebookReportAnnotationsComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      declarations: [NotebookReportAnnotationsComponent]
    });
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
