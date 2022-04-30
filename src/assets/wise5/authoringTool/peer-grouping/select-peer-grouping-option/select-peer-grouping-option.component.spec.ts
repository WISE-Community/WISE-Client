import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { SelectPeerGroupingOptionComponent } from './select-peer-grouping-option.component';
import { getDialogOpenSpy } from '../peer-grouping-testing-helper';
import { PeerGrouping } from '../../../../../app/domain/peerGrouping';

let component: SelectPeerGroupingOptionComponent;
let deleteEventSpy: jasmine.Spy;
let fixture: ComponentFixture<SelectPeerGroupingOptionComponent>;
const tag1: string = 'tag1';

describe('SelectPeerGroupingOptionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
      declarations: [SelectPeerGroupingOptionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingOptionComponent);
    component = fixture.componentInstance;
    component.peerGrouping = new PeerGrouping({ tag: tag1 });
    deleteEventSpy = spyOn(component.deleteEvent, 'emit');
    fixture.detectChanges();
  });

  selectPeerGrouping();
  editPeerGrouping();
});

function selectPeerGrouping() {
  it('should select peer grouping', () => {
    const selectEventSpy = spyOn(component.selectEvent, 'emit');
    component.select();
    expect(selectEventSpy).toHaveBeenCalledWith(tag1);
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
    expect(deleteEventSpy).toHaveBeenCalledWith(tag1);
  });
}
