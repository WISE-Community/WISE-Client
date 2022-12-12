import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { SelectPeerGroupingOptionComponent } from './select-peer-grouping-option.component';
import { getDialogOpenSpy } from '../peer-grouping-testing-helper';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { DIFFERENT_IDEAS_NAME, DIFFERENT_SCORES_NAME } from '../PeerGroupingLogic';

let component: SelectPeerGroupingOptionComponent;
let deleteEventSpy: jasmine.Spy;
let fixture: ComponentFixture<SelectPeerGroupingOptionComponent>;
let peerGrouping1: PeerGrouping;
const tag1: string = 'tag1';

describe('SelectPeerGroupingOptionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule, StudentTeacherCommonServicesModule],
      declarations: [SelectPeerGroupingOptionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingOptionComponent);
    component = fixture.componentInstance;
    peerGrouping1 = new PeerGrouping({ tag: tag1, logic: 'random' });
    component.peerGrouping = peerGrouping1;
    deleteEventSpy = spyOn(component.deleteEvent, 'emit');
    fixture.detectChanges();
  });

  selectPeerGrouping();
  editPeerGrouping();
  setPeerGroupingLogicName();
});

function selectPeerGrouping() {
  it('should select peer grouping', () => {
    const selectEventSpy = spyOn(component.selectEvent, 'emit');
    component.select();
    expect(selectEventSpy).toHaveBeenCalledWith(peerGrouping1);
  });
}

function editPeerGrouping() {
  it('should edit peer grouping', () => {
    const dialogOpenSpy = getDialogOpenSpy(false);
    component.edit();
    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(deleteEventSpy).not.toHaveBeenCalled();
  });

  it('should edit peer grouping and delete', () => {
    const dialogOpenSpy = getDialogOpenSpy(true);
    component.edit();
    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(deleteEventSpy).toHaveBeenCalledWith(peerGrouping1);
  });
}

function setPeerGroupingLogicName() {
  it('should set peer grouping logic name when logic is random', () => {
    setAndExpectPeerGroupingLogic('random', 'Random');
  });
  it('should set peer grouping logic name when logic is manual', () => {
    setAndExpectPeerGroupingLogic('manual', 'Manual');
  });
  it('should set peer grouping logic name when logic is different ideas', () => {
    setAndExpectPeerGroupingLogic('differentIdeas("node1", "componen1")', DIFFERENT_IDEAS_NAME);
  });
  it('should set peer grouping logic name when logic is different scores any', () => {
    setAndExpectPeerGroupingLogic(
      'differentKIScores("node1", "componen1", "any")',
      DIFFERENT_SCORES_NAME
    );
  });
  it('should set peer grouping logic name when logic is different scores maximize', () => {
    setAndExpectPeerGroupingLogic(
      'differentKIScores("node1", "componen1", "maximize")',
      DIFFERENT_SCORES_NAME
    );
  });
}

function setAndExpectPeerGroupingLogic(logic: string, expectedLogicName: string) {
  fixture = TestBed.createComponent(SelectPeerGroupingOptionComponent);
  component = fixture.componentInstance;
  peerGrouping1 = new PeerGrouping({ tag: tag1, logic: logic });
  component.peerGrouping = peerGrouping1;
  fixture.detectChanges();
  expect(component.peerGroupingLogicName).toEqual(expectedLogicName);
}
