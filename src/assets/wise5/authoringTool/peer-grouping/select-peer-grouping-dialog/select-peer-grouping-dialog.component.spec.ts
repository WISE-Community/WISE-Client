import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog.component';
import { getDialogOpenSpy } from '../peer-grouping-testing-helper';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';

let component: SelectPeerGroupingDialogComponent;
let fixture: ComponentFixture<SelectPeerGroupingDialogComponent>;
let peerGrouping1: PeerGrouping;
let peerGrouping2: PeerGrouping;
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
    peerGrouping1 = new PeerGrouping({ tag: tag1 });
    peerGrouping2 = new PeerGrouping({ tag: tag2 });
    spyOn(TestBed.inject(TeacherProjectService), 'getPeerGroupings').and.returnValue([]);
    fixture.detectChanges();
  });

  showNewPeerGroupingAuthoring();
  deletePeerGrouping();
});

function showNewPeerGroupingAuthoring() {
  it('should show new peer grouping authoring', () => {
    const dialogOpenSpy = getDialogOpenSpy(peerGrouping1);
    component.showNewPeerGroupingAuthoring();
    expect(dialogOpenSpy).toHaveBeenCalled();
  });
}

function deletePeerGrouping() {
  it('should delete peer grouping', () => {
    component.peerGroupings = [peerGrouping1, peerGrouping2];
    const deletePeerGroupingSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'deletePeerGrouping'
    );
    component.deletePeerGrouping(peerGrouping2);
    expect(deletePeerGroupingSpy).toHaveBeenCalledWith(peerGrouping2);
  });
}
