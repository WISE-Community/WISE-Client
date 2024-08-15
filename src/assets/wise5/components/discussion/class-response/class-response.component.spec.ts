import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../services/configService';
import { ClassResponse } from './class-response.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let fixture: ComponentFixture<ClassResponse>;
let component: ClassResponse;
let reply1: any = createComponentState('Hello');
let reply2: any = createComponentState('World');

describe('ClassResponseComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [ClassResponse],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [ConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(ClassResponse);
    component = fixture.componentInstance;
    component.response = createComponentState();
    fixture.detectChanges();
  });

  injectLinks();
  showLastReply();
  showAllReplies();
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
      expect(component.injectLinks(responseText)).toEqual(responseText);
    });

    it('should inject link into text that does have a link', () => {
      const url = 'https://www.berkeley.edu';
      const responseText: string = `Go to ${url}`;
      const modifiedText: string = `Go to <a href="${url}" target="_blank">${url}</a>`;
      expect(component.injectLinks(responseText)).toEqual(modifiedText);
    });

    it('should inject link into text that does have a link that does not start with http', () => {
      const url = 'www.berkeley.edu';
      const responseText: string = `Go to ${url}`;
      const modifiedText: string = `Go to <a href="//${url}" target="_blank">${url}</a>`;
      expect(component.injectLinks(responseText)).toEqual(modifiedText);
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
      component.showLastReply();
      expect(component.repliesToShow.length).toEqual(1);
      expect(component.repliesToShow[0]).toEqual(reply2);
    });
  });
}

function showAllReplies() {
  describe('showAllReplies', () => {
    it('should show all replies', () => {
      setReplies(component.response);
      component.showAllReplies();
      expect(component.repliesToShow.length).toEqual(2);
      expect(component.repliesToShow[0]).toEqual(reply1);
      expect(component.repliesToShow[1]).toEqual(reply2);
    });
  });
}
