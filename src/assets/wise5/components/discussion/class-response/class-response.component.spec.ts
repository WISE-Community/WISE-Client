import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../services/configService';
import { ClassResponse } from './class-response.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { SaveTimeMessageComponent } from '../../../common/save-time-message/save-time-message.component';

let fixture: ComponentFixture<ClassResponse>;
let component: ClassResponse;
let reply1: any = createComponentState('Hello');
let reply2: any = createComponentState('World');
describe('ClassResponseComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClassResponse, MockComponent(SaveTimeMessageComponent)],
      providers: [MockProvider(ConfigService)]
    });
    fixture = TestBed.createComponent(ClassResponse);
    component = fixture.componentInstance;
    component.response = createComponentState();
    fixture.detectChanges();
  });

  injectLinks();
  showLastReply();
  showAllReplies();
  replyEntered();
});

function createComponentState(responseText: string = '', replies: any[] = []): any {
  return {
    studentData: {
      response: responseText
    },
    replies: replies
  };
}

function injectLinks() {
  describe('injectLinks', () => {
    it('should not modify text that does not have a link', () => {
      const responseText: string = 'Hello World';
      expect(component['injectLinks'](responseText)).toEqual(responseText);
    });

    it('should inject link into text that does have a link', () => {
      const url = 'https://www.berkeley.edu';
      const responseText: string = `Go to ${url}`;
      const modifiedText: string = `Go to <a href="${url}" target="_blank">${url}</a>`;
      expect(component['injectLinks'](responseText)).toEqual(modifiedText);
    });

    it('should inject link into text that does have a link that does not start with http', () => {
      const url = 'www.berkeley.edu';
      const responseText: string = `Go to ${url}`;
      const modifiedText: string = `Go to <a href="//${url}" target="_blank">${url}</a>`;
      expect(component['injectLinks'](responseText)).toEqual(modifiedText);
    });
  });
}

function setReplies(componentState: any): void {
  componentState.replies = [reply1, reply2];
  return componentState;
}

function showLastReply() {
  describe('showLastReply', () => {
    it('should show the last reply', () => {
      setReplies(component.response);
      component['showLastReply']();
      expect(component['repliesToShow'].length).toEqual(1);
      expect(component['repliesToShow'][0]).toEqual(reply2);
    });
  });
}

function showAllReplies() {
  describe('showAllReplies', () => {
    it('should show all replies', () => {
      setReplies(component.response);
      component['showAllReplies']();
      expect(component['repliesToShow'].length).toEqual(2);
      expect(component['repliesToShow'][0]).toEqual(reply1);
      expect(component['repliesToShow'][1]).toEqual(reply2);
    });
  });
}

function replyEntered() {
  describe('replyEntered', () => {
    let textarea: HTMLTextAreaElement;
    beforeEach(() => {
      component.mode = 'student';
      component.response.replyText = '我同意你的看法';
      fixture.detectChanges();
      textarea = fixture.nativeElement.querySelector('.new-reply-input');
      spyOn(component.submitButtonClicked, 'emit');
    });

    it('should not submit when Enter confirms an IME composition', () => {
      pressKey(textarea, 'keydown', { key: 'Process', isComposing: true }, 229);
      pressKey(textarea, 'keyup', { key: 'Enter' }, 13);
      expect(component.submitButtonClicked.emit).not.toHaveBeenCalled();
      expect(component.response.replyText).toEqual('我同意你的看法');
    });

    it('should not submit when the Enter keydown is reported as composing', () => {
      pressKey(textarea, 'keydown', { key: 'Enter', isComposing: true }, 13);
      expect(component.submitButtonClicked.emit).not.toHaveBeenCalled();
      expect(component.response.replyText).toEqual('我同意你的看法');
    });

    it('should not submit when the Enter keydown has key code 229 after composition ends', () => {
      pressKey(textarea, 'keydown', { key: 'Enter', isComposing: false }, 229);
      expect(component.submitButtonClicked.emit).not.toHaveBeenCalled();
      expect(component.response.replyText).toEqual('我同意你的看法');
    });

    it('should submit the reply exactly as typed when Enter is pressed', () => {
      const keydown = pressKey(textarea, 'keydown', { key: 'Enter' }, 13);
      pressKey(textarea, 'keyup', { key: 'Enter' }, 13);
      expect(keydown.defaultPrevented).toBeTrue();
      expect(component.submitButtonClicked.emit).toHaveBeenCalledTimes(1);
      expect(component.response.replyText).toEqual('我同意你的看法');
    });

    it('should not submit when Shift+Enter is pressed', () => {
      pressKey(textarea, 'keydown', { key: 'Enter', shiftKey: true }, 13);
      pressKey(textarea, 'keyup', { key: 'Enter', shiftKey: true }, 13);
      expect(component.submitButtonClicked.emit).not.toHaveBeenCalled();
      expect(component.response.replyText).toEqual('我同意你的看法');
    });
  });
}

function pressKey(
  target: HTMLElement,
  type: string,
  init: KeyboardEventInit,
  keyCode: number
): KeyboardEvent {
  const event = new KeyboardEvent(type, { bubbles: true, cancelable: true, ...init });
  Object.defineProperty(event, 'keyCode', { get: () => keyCode });
  target.dispatchEvent(event);
  return event;
}
