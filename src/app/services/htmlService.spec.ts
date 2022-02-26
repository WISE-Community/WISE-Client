import { TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { HTMLService } from '../../assets/wise5/components/html/htmlService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { TagService } from '../../assets/wise5/services/tagService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { StudentStudentStatusService } from '../../assets/wise5/services/studentStudentStatusService';

let service: HTMLService;

describe('HTMLService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      providers: [
        AnnotationService,
        ConfigService,
        ProjectService,
        HTMLService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        StudentStudentStatusService,
        TagService,
        UtilService
      ]
    });
    service = TestBed.get(HTMLService);
  });
  createComponent();
  isCompleted();
});

function createComponent() {
  it('should create an html component', () => {
    const component = service.createComponent();
    expect(component.type).toEqual('HTML');
    expect(component.html).toEqual('Enter html here');
  });
}

function isCompleted() {
  function expectIsCompleted(nodeEvents: any[], expectedResult: boolean) {
    expect(service.isCompleted({}, [], [], nodeEvents)).toEqual(expectedResult);
  }
  it('should check if is compeleted when there are no node entered events', () => {
    expectIsCompleted([], false);
  });
  it('should check if is compeleted when there is a node entered event', () => {
    expectIsCompleted([{ event: 'nodeEntered' }], true);
  });
}
