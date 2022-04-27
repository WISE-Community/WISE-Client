import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupingTestingModule } from '../peer-grouping-testing.module';
import { SelectPeerGroupingOptionComponent } from './select-peer-grouping-option.component';

describe('SelectPeerGroupingOptionComponent', () => {
  let component: SelectPeerGroupingOptionComponent;
  let fixture: ComponentFixture<SelectPeerGroupingOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupingTestingModule],
      declarations: [SelectPeerGroupingOptionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPeerGroupingOptionComponent);
    component = fixture.componentInstance;
    component.peerGrouping = { settings: {}, stepsUsedIn: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
