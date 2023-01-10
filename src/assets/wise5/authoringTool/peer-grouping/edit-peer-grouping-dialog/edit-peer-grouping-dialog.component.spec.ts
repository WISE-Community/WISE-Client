import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog.component';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { DIFFERENT_IDEAS_VALUE, DIFFERENT_SCORES_VALUE } from '../PeerGroupingLogic';

let component: EditPeerGroupingDialogComponent;
const componentId1 = 'component1';
let dialogCloseSpy: jasmine.Spy;
let fixture: ComponentFixture<EditPeerGroupingDialogComponent>;
const modeAny: string = 'any';
const modeMaximize: string = 'maximize';
const nodeId1 = 'node1';

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

  it('should save peer grouping with different ideas any logic', () => {
    savePeerGroupingWithLogic(
      DIFFERENT_IDEAS_VALUE,
      modeAny,
      `${DIFFERENT_IDEAS_VALUE}("${nodeId1}", "${componentId1}", "${modeAny}")`
    );
  });

  it('should save peer grouping with different ideas maximize logic', () => {
    savePeerGroupingWithLogic(
      DIFFERENT_IDEAS_VALUE,
      modeMaximize,
      `${DIFFERENT_IDEAS_VALUE}("${nodeId1}", "${componentId1}", "${modeMaximize}")`
    );
  });

  it('should save peer grouping with different scores any logic', () => {
    savePeerGroupingWithLogic(
      DIFFERENT_SCORES_VALUE,
      modeAny,
      `${DIFFERENT_SCORES_VALUE}("${nodeId1}", "${componentId1}", "${modeAny}")`
    );
  });

  it('should save peer grouping with different scores maximize logic', () => {
    savePeerGroupingWithLogic(
      DIFFERENT_SCORES_VALUE,
      modeMaximize,
      `${DIFFERENT_SCORES_VALUE}("${nodeId1}", "${componentId1}", "${modeMaximize}")`
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
