import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
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
let createNewPeerGroupingSpy, dialogCloseSpy;
let fixture: ComponentFixture<CreateNewPeerGroupingDialogComponent>;

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
    fixture.detectChanges();
  });
  create();
});

function create() {
  create_RandomLogic_ShouldCreatePeerGroup();
  create_DifferentIdeasLogic_ShouldCreatePeerGroup();
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

function create_DifferentIdeasLogic_ShouldCreatePeerGroup() {
  it('should create peer grouping with different ideas logic', async () => {
    const newPeerGrouping = new PeerGrouping({
      logic: `differentIdeas("${REFERENCE_COMPONENT_NODE_ID1}", "${REFERENCE_COMPONENT_COMPONENT_ID1}")`,
      maxMembershipCount: 2,
      tag: TAG1
    });
    createNewPeerGroupingSpy.and.returnValue(of(newPeerGrouping));
    component.logicType = 'differentIdeas';
    component.referenceComponent = new ReferenceComponent(
      REFERENCE_COMPONENT_NODE_ID1,
      REFERENCE_COMPONENT_COMPONENT_ID1
    );
    component.create();
    expect(createNewPeerGroupingSpy).toHaveBeenCalledWith(newPeerGrouping);
    expect(dialogCloseSpy).toHaveBeenCalled();
  });
}
