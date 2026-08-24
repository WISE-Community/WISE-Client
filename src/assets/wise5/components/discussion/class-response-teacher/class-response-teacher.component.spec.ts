import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassResponseTeacherComponent } from './class-response-teacher.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { SaveTimeMessageComponent } from '../../../common/save-time-message/save-time-message.component';
import { ConfigService } from '../../../services/configService';
import { provideRouter } from '@angular/router';

let fixture: ComponentFixture<ClassResponseTeacherComponent>;
let component: ClassResponseTeacherComponent;

describe('ClassResponseTeacherComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassResponseTeacherComponent, MockComponent(SaveTimeMessageComponent)],
      providers: [MockProvider(ConfigService), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassResponseTeacherComponent);
    component = fixture.componentInstance;
    component.response = createResponse('Hello World');
    fixture.detectChanges();
  });

  isHidden();
  visiblePost();
  hiddenPost();
  visibleReply();
  hiddenReply();
  hiddenParentReply();
  hidePost();
  showPost();
});

function createResponse(text: string = '', replies: any[] = []): any {
  return {
    workgroupId: 1,
    usernames: 'Student A',
    serverSaveTime: Date.now(),
    studentData: { response: text, responseTextHTML: text, attachments: [] },
    replies,
    latestInappropriateFlagAnnotation: null
  };
}

function createReply(text: string = ''): any {
  return {
    workgroupId: 2,
    usernames: 'Student B',
    serverSaveTime: Date.now(),
    studentData: { response: text, responseHTML: text },
    latestInappropriateFlagAnnotation: null
  };
}

function hiddenAnnotation(): any {
  return { data: { action: 'Delete' } };
}

function queryText(selector: string): string {
  return fixture.nativeElement.querySelector(selector)?.textContent?.trim() ?? '';
}

function query(selector: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(selector);
}

function isHidden() {
  describe('isHidden', () => {
    it('returns false when latestInappropriateFlagAnnotation is null', () => {
      const post = createResponse();
      expect(component['isHidden'](post)).toBe(false);
    });

    it('returns false when latestInappropriateFlagAnnotation data is null', () => {
      const post = createResponse();
      post.latestInappropriateFlagAnnotation = { data: null };
      expect(component['isHidden'](post)).toBe(false);
    });

    it('returns false when action is not Delete', () => {
      const post = createResponse();
      post.latestInappropriateFlagAnnotation = { data: { action: 'Flag' } };
      expect(component['isHidden'](post)).toBe(false);
    });

    it('returns true when latestInappropriateFlagAnnotation action is Delete', () => {
      const post = createResponse();
      post.latestInappropriateFlagAnnotation = hiddenAnnotation();
      expect(component['isHidden'](post)).toBe(true);
    });
  });
}

function visiblePost() {
  describe('visible post', () => {
    it('renders post content', () => {
      expect(queryText('.post')).toBe('Hello World');
    });

    it('includes a hide button', () => {
      const btn = query('button[mattooltip="Hide from students"]');
      expect(btn).not.toBeNull();
    });

    it('does not wrap the post in a <details> element', () => {
      expect(query('details')).toBeNull();
    });
  });
}

function hiddenPost() {
  describe('hidden post', () => {
    beforeEach(() => {
      component.response = createResponse('Hidden content');
      component.response.latestInappropriateFlagAnnotation = hiddenAnnotation();
      fixture.detectChanges();
    });

    it('wraps the post in a <details> element', () => {
      expect(query('details')).not.toBeNull();
    });

    it('shows hidden post message', () => {
      expect(queryText('summary')).toContain('This post is hidden from students.');
    });

    it('includes a show button', () => {
      const btn = query('button[mattooltip="Show to students"]');
      expect(btn).not.toBeNull();
    });
  });
}

function visibleReply() {
  describe('visible reply on a visible post', () => {
    let reply: any;

    beforeEach(() => {
      reply = createReply('Reply text');
      component.response.replies = [reply];
      component['repliesToShow'] = [reply];
      fixture.detectChanges();
    });

    it('shows reply content without a <details> wrapper', () => {
      expect(query('.comment details')).toBeNull();
    });

    it('renders the reply content', () => {
      expect(queryText('.comment')).toContain('Reply text');
    });

    it('includes a hide button', () => {
      const btn = query('.comment button[mattooltip="Hide from students"]');
      expect(btn).not.toBeNull();
    });
  });
}

function hiddenReply() {
  describe('hidden reply on a visible post', () => {
    let reply: any;

    beforeEach(() => {
      reply = createReply('Hidden reply');
      reply.latestInappropriateFlagAnnotation = hiddenAnnotation();
      component.response.replies = [reply];
      component['repliesToShow'] = [reply];
      fixture.detectChanges();
    });

    it('wraps the reply in a <details> element', () => {
      expect(query('.comment details')).not.toBeNull();
    });

    it('shows comment hidden message', () => {
      expect(queryText('.comment summary')).toContain('This comment is hidden from students.');
    });

    it('includes a show button', () => {
      const btn = query('.comment button[mattooltip="Show to students"]');
      expect(btn).not.toBeNull();
    });
  });
}

function hiddenParentReply() {
  describe('hidden parent post', () => {
    let reply: any;

    beforeEach(() => {
      reply = createReply('Reply on hidden post');
      component.response = createResponse('Hidden post content', [reply]);
      component.response.latestInappropriateFlagAnnotation = hiddenAnnotation();
      component['repliesToShow'] = [reply];
      fixture.detectChanges();
    });

    it('wraps replies in a <details> element', () => {
      const detailsEls = fixture.nativeElement.querySelectorAll('.comment details');
      expect(detailsEls.length).toBeGreaterThan(0);
    });

    it('shows parent hidden message on replies', () => {
      expect(queryText('.comment summary')).toContain(
        'Comment hidden because parent post is hidden.'
      );
    });

    it('does not include a show button on replies', () => {
      const btn = query('.comment button[mattooltip="Show to students"]');
      expect(btn).toBeNull();
    });
  });
}

function hidePost() {
  describe('hidePost', () => {
    it('emits hidePostEvent after confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const spy = spyOn(component.hidePostEvent, 'emit');
      component['hidePost'](component.response);
      expect(spy).toHaveBeenCalledWith(component.response);
    });

    it('does not emit hidePostEvent when confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const spy = spyOn(component.hidePostEvent, 'emit');
      component['hidePost'](component.response);
      expect(spy).not.toHaveBeenCalled();
    });
  });
}

function showPost() {
  describe('showPost', () => {
    it('emits showPostEvent after confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const spy = spyOn(component.showPostEvent, 'emit');
      component['showPost'](component.response);
      expect(spy).toHaveBeenCalledWith(component.response);
    });

    it('does not emit showPostEvent when confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      const spy = spyOn(component.showPostEvent, 'emit');
      component['showPost'](component.response);
      expect(spy).not.toHaveBeenCalled();
    });
  });
}
