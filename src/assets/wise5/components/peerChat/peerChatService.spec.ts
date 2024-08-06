import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { PeerChatMessage } from './PeerChatMessage';
import { PeerChatService } from './peerChatService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: PeerChatService;

describe('PeerChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [PeerChatService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(PeerChatService);
  });

  processIsDeletedAnnotations();
});

function processIsDeletedAnnotations() {
  it('should process is deleted annotations', () => {
    const annotations = [
      createInappropriateAnnotation(1, 'Delete'),
      createInappropriateAnnotation(2, 'Delete'),
      createInappropriateAnnotation(2, 'Undo Delete')
    ];
    const peerChatMessage1 = new PeerChatMessage(1, 'Hello', 1000, 1);
    const peerChatMessage2 = new PeerChatMessage(2, 'Hello', 2000, 2);
    const peerChatMessage3 = new PeerChatMessage(3, 'Hello', 3000, 3);
    const peerChatMessages = [peerChatMessage1, peerChatMessage2, peerChatMessage3];
    service.processIsDeletedAnnotations(annotations, peerChatMessages);
    expect(peerChatMessage1.isDeleted).toBeTruthy();
    expect(peerChatMessage2.isDeleted).toBeFalsy();
    expect(peerChatMessage3.isDeleted).toBeFalsy();
  });
}

function createInappropriateAnnotation(studentWorkId: number, action: string) {
  return { data: { action: action }, studentWorkId: studentWorkId, type: 'inappropriateFlag' };
}
