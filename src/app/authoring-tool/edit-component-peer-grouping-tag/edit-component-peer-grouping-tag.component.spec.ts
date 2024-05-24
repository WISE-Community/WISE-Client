import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingTestingModule } from '../../../assets/wise5/authoringTool/peer-grouping/peer-grouping-testing.module';
import { SelectPeerGroupingAuthoringComponent } from '../../../assets/wise5/authoringTool/peer-grouping/select-peer-grouping-authoring/select-peer-grouping-authoring.component';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditComponentPeerGroupingTagComponent } from './edit-component-peer-grouping-tag.component';
import { PeerGroupingAuthoringService } from '../../../assets/wise5/services/peerGroupingAuthoringService';
import { PeerGrouping } from '../../domain/peerGrouping';

let component: EditComponentPeerGroupingTagComponent;
let fixture: ComponentFixture<EditComponentPeerGroupingTagComponent>;
let projectService: TeacherProjectService;
const tag1: string = 'tag1';
const tag2: string = 'tag2';

describe('EditComponentPeerGroupingTagComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule, StudentTeacherCommonServicesModule],
      declarations: [EditComponentPeerGroupingTagComponent, SelectPeerGroupingAuthoringComponent],
      providers: [PeerGroupingAuthoringService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentPeerGroupingTagComponent);
    component = fixture.componentInstance;
    component.componentContent = { peerGroupingTag: tag1 };
    projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getPeerGroupings').and.returnValue([]);
    const peerGrouping1 = new PeerGrouping({ tag: tag1 });
    spyOn(TestBed.inject(PeerGroupingAuthoringService), 'getPeerGrouping').and.returnValue(
      peerGrouping1
    );
    fixture.detectChanges();
  });

  peerGroupingTagChanged();
});

function peerGroupingTagChanged() {
  it('should handle peer grouping tag changed', () => {
    const componentChangedSpy = spyOn(projectService, 'componentChanged');
    expect(component.componentContent.peerGroupingTag).toEqual(tag1);
    component.peerGroupingTagChanged(tag2);
    expect(component.componentContent.peerGroupingTag).toEqual(tag2);
    expect(componentChangedSpy).toHaveBeenCalled();
  });
}
