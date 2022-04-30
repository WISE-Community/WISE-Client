import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { SelectPeerGroupingDialogComponent } from './select-peer-grouping-dialog.component';
import { getDialogOpenSpy } from '../peer-grouping-testing-helper';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';

let component: SelectPeerGroupingDialogComponent;
let fixture: ComponentFixture<SelectPeerGroupingDialogComponent>;
let peerGrouping: PeerGrouping;
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
    peerGrouping = new PeerGrouping();
    spyOn(TestBed.inject(TeacherProjectService), 'getPeerGroupings').and.returnValue([]);
    fixture.detectChanges();
  });

  showNewPeerGroupingAuthoring();
  deletePeerGrouping();
});

function createPeerGrouping(tag: string): any {
  return new PeerGrouping({ tag: tag });
}

function showNewPeerGroupingAuthoring() {
  it('should show new peer grouping authoring', () => {
    const dialogOpenSpy = getDialogOpenSpy(peerGrouping);
    component.showNewPeerGroupingAuthoring();
    expect(dialogOpenSpy).toHaveBeenCalled();
  });
}

function deletePeerGrouping() {
  it('should delete peer grouping', () => {
    const peerGrouping1 = createPeerGrouping(tag1);
    const peerGrouping2 = createPeerGrouping(tag2);
    component.peerGroupings = [peerGrouping1, peerGrouping2];
    const deletePeerGroupingSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'deletePeerGrouping'
    );
    component.deletePeerGrouping(tag2);
    expect(component.peerGroupings).toEqual([peerGrouping1]);
    expect(deletePeerGroupingSpy).toHaveBeenCalledWith(tag2);
  });
}
