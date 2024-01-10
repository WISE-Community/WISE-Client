import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { TagService } from '../../assets/wise5/services/tagService';
import { EmbeddedService } from '../../assets/wise5/components/embedded/embeddedService';
import { SessionService } from '../../assets/wise5/services/sessionService';

let service: EmbeddedService;

describe('EmbeddedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AnnotationService,
        ConfigService,
        EmbeddedService,
        ProjectService,
        SessionService,
        StudentAssetService,
        TagService
      ]
    });
    service = TestBed.get(EmbeddedService);
  });
  createComponent();
  isCompleted();
});

function createComponentState(isCompleted: boolean) {
  return {
    studentData: {
      isCompleted: isCompleted
    }
  };
}

function createComponent() {
  it('should create an embedded component', () => {
    const component: any = service.createComponent();
    expect(component.type).toEqual('Embedded');
    expect(component.url).toEqual('');
    expect(component.height).toEqual(600);
  });
}

function isCompleted() {
  let componentStates: any[];
  let nodeEvents: any[];
  beforeEach(() => {
    componentStates = [];
    nodeEvents = [];
  });
  function expectIsCompleted(componentStates: any[], nodeEvents: any[], expectedResult: boolean) {
    expect(service.isCompleted({}, componentStates, nodeEvents, null)).toEqual(expectedResult);
  }
  it('should check is completed when there are no node entered events and no component states', () => {
    expectIsCompleted(componentStates, nodeEvents, false);
  });
  it('should check is completed when there is a node entered event and no component states', () => {
    nodeEvents.push({ event: 'nodeEntered' });
    expectIsCompleted(componentStates, nodeEvents, true);
  });
  it('should check is completed when there is a component state with is completed false', () => {
    componentStates.push(createComponentState(false));
    expectIsCompleted(componentStates, nodeEvents, false);
  });
  it('should check is completed when there is a component state with is completed true', () => {
    componentStates.push(createComponentState(true));
    expectIsCompleted(componentStates, nodeEvents, true);
  });
}
