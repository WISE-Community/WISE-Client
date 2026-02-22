import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeerGroupButtonComponent } from './peer-group-button.component';
import { MockService } from 'ng-mocks';
import { TeacherPeerGroupService } from '../../../services/teacherPeerGroupService';

let component: PeerGroupButtonComponent;
let fixture: ComponentFixture<PeerGroupButtonComponent>;
describe('PeerGroupButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerGroupButtonComponent],
      providers: [
        { provide: TeacherPeerGroupService, useValue: MockService(TeacherPeerGroupService) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeerGroupButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  peerGroupAvailable();
  peerGroupNotAvailable();
});

function peerGroupAvailable() {
  describe('peer group is available', () => {
    beforeEach(() => {
      component.component = { peerGroupingTag: 'tag' };
      component.ngOnChanges();
      fixture.detectChanges();
    });
    it('should show button', () => {
      const button = fixture.debugElement.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });
  });
}

function peerGroupNotAvailable() {
  describe('peer group is not available', () => {
    it('should hide button', () => {
      const button = fixture.debugElement.nativeElement.querySelector('button');
      expect(button).toBeFalsy();
    });
  });
}
