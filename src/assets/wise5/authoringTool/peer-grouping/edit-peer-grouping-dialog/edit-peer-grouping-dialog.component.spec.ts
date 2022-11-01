import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog.component';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { DIFFERENT_IDEAS_VALUE } from '../PeerGroupingLogic';

let component: EditPeerGroupingDialogComponent;
let dialogCloseSpy: jasmine.Spy;
let fixture: ComponentFixture<EditPeerGroupingDialogComponent>;

describe('EditPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule, StudentTeacherCommonServicesModule],
      declarations: [EditPeerGroupingDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            settings: {},
            stepsUsedIn: []
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    dialogCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    fixture.detectChanges();
  });

  savePeerGrouping();
  deletePeerGrouping();
  cancelPeerGrouping();
});

function savePeerGrouping() {
  it('should save peer grouping', async () => {
    const settings = new PeerGrouping();
    component.peerGrouping = settings;
    const updatePeerGroupingSpy = spyOn(
      TestBed.inject(PeerGroupingAuthoringService),
      'updatePeerGrouping'
    ).and.returnValue(of(settings));
    component.save();
    expect(updatePeerGroupingSpy).toHaveBeenCalledWith(settings);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });

  it('should save peer grouping with random logic', () => {
    savePeerGroupingWithLogic('random', null, 'random');
  });

  it('should save peer grouping with manual logic', () => {
    savePeerGroupingWithLogic('manual', null, 'manual');
  });

  it('should save peer grouping with different ideas logic', () => {
    savePeerGroupingWithLogic(DIFFERENT_IDEAS_VALUE, null, 'differentIdeas("node1", "component1")');
  });

  it('should save peer grouping with different scores any logic', () => {
    savePeerGroupingWithLogic(
      'differentKIScores',
      'any',
      'differentKIScores("node1", "component1", "any")'
    );
  });

  it('should save peer grouping with different scores maximize logic', () => {
    savePeerGroupingWithLogic(
      'differentKIScores',
      'maximize',
      'differentKIScores("node1", "component1", "maximize")'
    );
  });
}

function savePeerGroupingWithLogic(logicType: string, mode: string, expectedLogic: string) {
  const peerGrouping = new PeerGrouping();
  component.peerGrouping = peerGrouping;
  component.logicType = logicType;
  component.referenceComponent = {
    nodeId: 'node1',
    componentId: 'component1'
  };
  component.mode = mode;
  spyOn(TestBed.inject(PeerGroupingAuthoringService), 'updatePeerGrouping').and.returnValue(
    of(peerGrouping)
  );
  component.save();
  expect(component.peerGrouping.logic).toEqual(expectedLogic);
}

function deletePeerGrouping() {
  it('should delete peer grouping', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.delete();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}

function cancelPeerGrouping() {
  it('should cancel peer grouping', () => {
    component.cancel();
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}
