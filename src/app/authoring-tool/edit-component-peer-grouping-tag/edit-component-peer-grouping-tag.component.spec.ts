import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingTestingModule } from '../../../assets/wise5/authoringTool/peer-grouping/peer-grouping-testing.module';
import { SelectPeerGroupingAuthoringComponent } from '../../../assets/wise5/authoringTool/peer-grouping/select-peer-grouping-authoring/select-peer-grouping-authoring.component';
import { ComponentServiceLookupServiceModule } from '../../../assets/wise5/services/componentServiceLookupServiceModule';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditComponentPeerGroupingTagComponent } from './edit-component-peer-grouping-tag.component';

let component: EditComponentPeerGroupingTagComponent;
let fixture: ComponentFixture<EditComponentPeerGroupingTagComponent>;
let projectService: TeacherProjectService;
const tag1: string = 'tag1';
const tag2: string = 'tag2';

describe('EditComponentPeerGroupingTagComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentServiceLookupServiceModule, PeerGroupingTestingModule],
      declarations: [EditComponentPeerGroupingTagComponent, SelectPeerGroupingAuthoringComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentPeerGroupingTagComponent);
    component = fixture.componentInstance;
    component.authoringComponentContent = { peerGroupingTag: tag1 };
    projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getPeerGroupings').and.returnValue([]);
    fixture.detectChanges();
  });

  peerGroupingTagChanged();
});

function peerGroupingTagChanged() {
  it('should handle peer grouping tag changed', () => {
    const componentChangedSpy = spyOn(projectService, 'componentChanged');
    expect(component.authoringComponentContent.peerGroupingTag).toEqual(tag1);
    component.peerGroupingTagChanged(tag2);
    expect(component.authoringComponentContent.peerGroupingTag).toEqual(tag2);
    expect(componentChangedSpy).toHaveBeenCalled();
  });
}
