import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { EditPeerGroupingDialogComponent } from './edit-peer-grouping-dialog.component';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { DIFFERENT_IDEAS_VALUE, DIFFERENT_SCORES_VALUE } from '../PeerGroupingLogic';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

let component: EditPeerGroupingDialogComponent;
const componentId1 = 'component1';
let dialogCloseSpy: jasmine.Spy;
let fixture: ComponentFixture<EditPeerGroupingDialogComponent>;
const modeAny: string = 'any';
const nodeId1 = 'node1';
const modeMaximize: string = 'maximize';
let snackBar: MatSnackBar;
let peerGroupingAuthoringService;
let updatePeerGroupingSpy: jasmine.Spy;

describe('EditPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, PeerGroupingTestingModule, StudentTeacherCommonServicesModule],
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
    peerGroupingAuthoringService = TestBed.inject(PeerGroupingAuthoringService);
    updatePeerGroupingSpy = spyOn(peerGroupingAuthoringService, 'updatePeerGrouping');
    dialogCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  savePeerGrouping();
  deletePeerGrouping();
  cancelPeerGrouping();
});

function savePeerGrouping() {
  describe('save is clicked', () => {
    describe('save to backend is successful', () => {
      it('closes the dialog', async () => {
        const settings = new PeerGrouping();
        component.peerGrouping = settings;
        updatePeerGroupingSpy.and.returnValue(of(settings));
        component.save();
        expect(updatePeerGroupingSpy).toHaveBeenCalledWith(settings);
        expect(dialogCloseSpy).toHaveBeenCalled();
      });
    });

    describe('peer grouping logic is random', () => {
      it('properly generates the random logic string', () => {
        savePeerGroupingWithLogic('random', null, 'random');
      });
    });

    describe('peer grouping logic is manual', () => {
      it('properly generates the manual logic string', () => {
        savePeerGroupingWithLogic('manual', null, 'manual');
      });
    });

    describe('peer grouping logic is different ideas', () => {
      it('properly generates the different ideas logic string', () => {
        savePeerGroupingWithLogic(
          DIFFERENT_IDEAS_VALUE,
          modeAny,
          `${DIFFERENT_IDEAS_VALUE}("${nodeId1}", "${componentId1}", "${modeAny}")`
        );
      });
    });

    describe('peer grouping logic is different ideas maximize logic', () => {
      it('properly generates the different ideas maximize logic string', () => {
        savePeerGroupingWithLogic(
          DIFFERENT_IDEAS_VALUE,
          modeMaximize,
          `${DIFFERENT_IDEAS_VALUE}("${nodeId1}", "${componentId1}", "${modeMaximize}")`
        );
      });
    });

    describe('peer grouping logic is different scores', () => {
      it('properly generates the different scores logic string', () => {
        savePeerGroupingWithLogic(
          DIFFERENT_SCORES_VALUE,
          modeAny,
          `${DIFFERENT_SCORES_VALUE}("${nodeId1}", "${componentId1}", "${modeAny}")`
        );
      });
    });

    describe('peer grouping logic is different scores maximize logic', () => {
      it('proplery generates the different scores maximize logic string', () => {
        savePeerGroupingWithLogic(
          DIFFERENT_SCORES_VALUE,
          modeMaximize,
          `${DIFFERENT_SCORES_VALUE}("${nodeId1}", "${componentId1}", "${modeMaximize}")`
        );
      });
    });

    describe('save to backend returns not authorized error', () => {
      it('shows not authorized error', () => {
        const snackBarSpy = spyOn(snackBar, 'open');
        updatePeerGroupingSpy.and.returnValue(
          throwError(() => {
            return {
              error: {
                messageCode: 'notAuthorized'
              }
            };
          })
        );
        component.save();
        expect(snackBarSpy).toHaveBeenCalledWith('You are not allowed to perform this action.');
      });
    });
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
  updatePeerGroupingSpy.and.returnValue(of(peerGrouping));
  component.save();
  expect(component.peerGrouping.logic).toEqual(expectedLogic);
}

function deletePeerGrouping() {
  describe('delete is clicked', () => {
    it('deletes peer grouping', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.delete();
      expect(dialogCloseSpy).toHaveBeenCalled();
    });
  });
}

function cancelPeerGrouping() {
  describe('cancel is clicked', () => {
    it('cancels peer grouping', () => {
      component.cancel();
      expect(dialogCloseSpy).toHaveBeenCalled();
    });
  });
}
