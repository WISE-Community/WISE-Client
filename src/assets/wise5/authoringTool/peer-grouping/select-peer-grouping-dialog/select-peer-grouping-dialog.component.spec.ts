import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { PeerGroupingSettings } from '../peerGroupingSettings';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog.component';
import { getDialogOpenSpy } from '../peer-grouping-testing-helper';

let component: SelectPeerGroupingDialogComponent;
let fixture: ComponentFixture<SelectPeerGroupingDialogComponent>;
let peerGroupingSettings: PeerGroupingSettings;
const tag1: string = 'tag1';
const tag2: string = 'tag2';

describe('SelectPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
      declarations: [SelectPeerGroupingDialogComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    peerGroupingSettings = new PeerGroupingSettings();
    spyOn(TestBed.inject(TeacherProjectService), 'getPeerGroupingSettings').and.returnValue([]);
    fixture.detectChanges();
  });

  showNewPeerGroupingAuthoring();
  deletePeerGrouping();
});

function createPeerGrouping(tag: string): any {
  return { settings: new PeerGroupingSettings({ tag: tag }) };
}

function showNewPeerGroupingAuthoring() {
  it('should show new peer grouping authoring', () => {
    const dialogOpenSpy = getDialogOpenSpy(peerGroupingSettings);
    expect(component.peerGroupings.length).toEqual(0);
    component.showNewPeerGroupingAuthoring();
    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(component.peerGroupings.length).toEqual(1);
  });
}

function deletePeerGrouping() {
  it('should delete peer grouping', () => {
    const peerGrouping1 = createPeerGrouping(tag1);
    const peerGrouping2 = createPeerGrouping(tag2);
    component.peerGroupings = [peerGrouping1, peerGrouping2];
    const deletePeerGroupingSettingsSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'deletePeerGroupingSettings'
    );
    component.deletePeerGrouping(tag2);
    expect(component.peerGroupings).toEqual([peerGrouping1]);
    expect(deletePeerGroupingSettingsSpy).toHaveBeenCalledWith(tag2);
  });
}
