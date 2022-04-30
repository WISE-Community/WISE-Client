import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { SelectPeerGroupingAuthoringComponent } from './select-peer-grouping-authoring.component';
import { getDialogOpenSpy } from '../peer-grouping-testing-helper';

let component: SelectPeerGroupingAuthoringComponent;
let fixture: ComponentFixture<SelectPeerGroupingAuthoringComponent>;
const name: string = 'water';
const tag1: string = 'tag1';

describe('SelectPeerGroupingAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
      declarations: [SelectPeerGroupingAuthoringComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  selectGroupingLogic();
});

function selectGroupingLogic() {
  it('should select grouping logic', () => {
    const dialogOpenSpy = getDialogOpenSpy(tag1);
    spyOn(TestBed.inject(PeerGroupingAuthoringService), 'getPeerGroupingName').and.returnValue(
      name
    );
    const tagChangedEmitSpy = spyOn(component.tagChanged, 'emit');
    expect(component.name).not.toEqual(name);
    component.selectGroupingLogic();
    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(component.name).toEqual(name);
    expect(tagChangedEmitSpy).toHaveBeenCalledWith(tag1);
  });
}
