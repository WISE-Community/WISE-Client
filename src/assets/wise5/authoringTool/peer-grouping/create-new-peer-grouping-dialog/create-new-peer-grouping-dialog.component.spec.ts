import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { ReferenceComponent } from '../../../../../app/domain/referenceComponent';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { CreateNewPeerGroupingDialogComponent } from './create-new-peer-grouping-dialog.component';

const TAG1: string = 'tag1';
const REFERENCE_COMPONENT_NODE_ID1 = 'node1';
const REFERENCE_COMPONENT_COMPONENT_ID1 = 'component1';
let component: CreateNewPeerGroupingDialogComponent;
let createNewPeerGroupingSpy: jasmine.Spy, dialogCloseSpy: jasmine.Spy;
let fixture: ComponentFixture<CreateNewPeerGroupingDialogComponent>;
let snackBar: MatSnackBar;

describe('CreateNewPeerGroupingDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, PeerGroupingTestingModule, StudentTeacherCommonServicesModule],
      declarations: [CreateNewPeerGroupingDialogComponent]
    }).compileComponents();
    const peerGroupingAuthoringService = TestBed.inject(PeerGroupingAuthoringService);
    createNewPeerGroupingSpy = spyOn(peerGroupingAuthoringService, 'createNewPeerGrouping');
    dialogCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    spyOn(peerGroupingAuthoringService, 'getUniqueTag').and.returnValue(TAG1);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPeerGroupingDialogComponent);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });
  create();
});

function create() {
  create_RandomLogic_ShouldCreatePeerGroup();
  create_DifferentIdeasAnyLogic_ShouldCreatePeerGroup();
  create_DifferentIdeasMaximizeLogic_ShouldCreatePeerGroup();
  create_DifferentScoresAnyLogic_ShouldCreatePeerGroup();
  create_DifferentScoresMaximizeLogic_ShouldCreatePeerGroup();
  create_ErrorOccurs_ShowsError();
}

function create_RandomLogic_ShouldCreatePeerGroup() {
  it('should create peer grouping with random logic', async () => {
    const newPeerGrouping = new PeerGrouping({
      logic: 'random',
      maxMembershipCount: 2,
      tag: TAG1
    });
    createNewPeerGroupingSpy.and.returnValue(of(newPeerGrouping));
    component.logicType = 'random';
    component.create();
    expect(createNewPeerGroupingSpy).toHaveBeenCalledWith(newPeerGrouping);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}

function create_DifferentIdeasAnyLogic_ShouldCreatePeerGroup() {
  it('should create peer grouping with different ideas any logic', async () => {
    expectLogicCreateNewPeerGrouping('differentIdeas', 'any');
  });
}

function create_DifferentIdeasMaximizeLogic_ShouldCreatePeerGroup() {
  it('should create peer grouping with different ideas maximize logic', async () => {
    expectLogicCreateNewPeerGrouping('differentIdeas', 'maximize');
  });
}
function create_DifferentScoresAnyLogic_ShouldCreatePeerGroup() {
  it('should create peer grouping with different scores any logic', async () => {
    expectLogicCreateNewPeerGrouping('differentKIScores', 'any');
  });
}

function create_DifferentScoresMaximizeLogic_ShouldCreatePeerGroup() {
  it('should create peer grouping with different scores maximize logic', async () => {
    expectLogicCreateNewPeerGrouping('differentKIScores', 'maximize');
  });
}

function expectLogicCreateNewPeerGrouping(logicType: string, mode: string) {
  const newPeerGrouping = new PeerGrouping({
    logic: `${logicType}("${REFERENCE_COMPONENT_NODE_ID1}", "${REFERENCE_COMPONENT_COMPONENT_ID1}", "${mode}")`,
    maxMembershipCount: 2,
    tag: TAG1
  });
  createNewPeerGroupingSpy.and.returnValue(of(newPeerGrouping));
  component.logicType = logicType;
  component.referenceComponent = new ReferenceComponent(
    REFERENCE_COMPONENT_NODE_ID1,
    REFERENCE_COMPONENT_COMPONENT_ID1
  );
  component.mode = mode;
  component.create();
  expect(createNewPeerGroupingSpy).toHaveBeenCalledWith(newPeerGrouping);
  expect(dialogCloseSpy).toHaveBeenCalled();
}

function create_ErrorOccurs_ShowsError(): void {
  describe('create new peer grouping returns error', () => {
    create_GenericErrorOccurs_ShowsError();
    create_NotAuthorizedErrorOccurs_ShowsError();
  });
}

function create_GenericErrorOccurs_ShowsError(): void {
  describe('returns generic error', () => {
    it('shows generic error message in snackbar', async () => {
      returnErrorExpectErrorMessage('genericError', 'An error occurred. Please try again.');
    });
  });
}

function create_NotAuthorizedErrorOccurs_ShowsError(): void {
  describe('returns not authorized error', () => {
    it('shows not authorized error in snackbar', async () => {
      returnErrorExpectErrorMessage('notAuthorized', 'You are not allowed to perform this action.');
    });
  });
}

function returnErrorExpectErrorMessage(messageCode: string, errorMessage: string): void {
  const snackBarSpy = spyOn(snackBar, 'open');
  createNewPeerGroupingSpy.and.returnValue(
    throwError(() => {
      return {
        error: {
          messageCode: messageCode
        }
      };
    })
  );
  component.create();
  expect(snackBarSpy).toHaveBeenCalledWith(errorMessage);
}
