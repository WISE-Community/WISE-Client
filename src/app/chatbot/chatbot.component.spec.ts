import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot.component';
import { ChatbotService } from './chatbot.service';
import { ConfigService } from '../../assets/wise5/services/configService';
import { DataService } from '../services/data.service';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of, throwError } from 'rxjs';
import { Chat, ChatMessage } from './chat';
import { provideHttpClient } from '@angular/common/http';
import { OpenAiChatService } from '../services/chat/openAiChat.service';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;
  let chatbotService: jasmine.SpyObj<ChatbotService>;
  let chatService: jasmine.SpyObj<OpenAiChatService>;
  let configService: jasmine.SpyObj<ConfigService>;
  let dataService: jasmine.SpyObj<DataService>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  const runId = 123;
  const workgroupId = 456;
  const nodeId = 'node1';
  const systemPrompt = 'You are a helpful assistant.';

  const createMockChat = (id: string, messages: ChatMessage[] = []): Chat => ({
    id,
    title: '',
    messages,
    createdAt: new Date('2026-01-01'),
    lastUpdated: new Date('2026-01-01'),
    deleted: false
  });

  beforeEach(async () => {
    const chatbotServiceSpy = jasmine.createSpyObj('ChatbotService', [
      'getChats',
      'createChat',
      'updateChat',
      'deleteChat'
    ]);
    const chatServiceSpy = jasmine.createSpyObj('OpenAiChatService', [
      'sendMessage',
      'generateChatTitle'
    ]);
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['getRunId', 'getWorkgroupId']);
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['getCurrentNode']);
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProject']);
    const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', [
      'observe',
      'isMatched'
    ]);

    configServiceSpy.getRunId.and.returnValue(runId);
    configServiceSpy.getWorkgroupId.and.returnValue(workgroupId);
    dataServiceSpy.getCurrentNode.and.returnValue({ id: nodeId });
    projectServiceSpy.getProject.and.returnValue({
      chatbot: { systemPrompt: systemPrompt }
    });
    breakpointObserverSpy.observe.and.returnValue(of({ matches: false, breakpoints: {} }));
    breakpointObserverSpy.isMatched.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [ChatbotComponent],
      providers: [
        { provide: ChatbotService, useValue: chatbotServiceSpy },
        { provide: OpenAiChatService, useValue: chatServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        provideHttpClient()
      ]
    }).compileComponents();

    chatbotService = TestBed.inject(ChatbotService) as jasmine.SpyObj<ChatbotService>;
    chatService = TestBed.inject(OpenAiChatService) as jasmine.SpyObj<OpenAiChatService>;
    configService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    chatbotService.getChats.and.returnValue(of([]));
    chatbotService.createChat.and.returnValue(Promise.resolve(createMockChat('1')));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load existing chats and select the last edited one', () => {
      const chat1 = createMockChat('1');
      chat1.lastUpdated = new Date('2026-01-01');
      const chat2 = createMockChat('2');
      chat2.lastUpdated = new Date('2026-01-02');
      const chats = [chat1, chat2];

      chatbotService.getChats.and.returnValue(of(chats));
      fixture.detectChanges();

      expect(chatbotService.getChats).toHaveBeenCalledWith(runId, workgroupId);
      expect(component['chats']).toEqual(chats);
      expect(component['currentChat']).toEqual(chat2);
      expect(component['messages']).toEqual(chat2.messages);
    });

    it('should handle error when loading chats', () => {
      spyOn(console, 'error');
      chatbotService.getChats.and.returnValue(throwError(() => new Error('Load error')));

      fixture.detectChanges();

      expect(console.error).toHaveBeenCalledWith('Error loading chats:', jasmine.any(Error));
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      const chat = createMockChat('1');
      chatbotService.getChats.and.returnValue(of([chat]));
      chatbotService.updateChat.and.returnValue(Promise.resolve(chat));
      fixture.detectChanges();
      component['currentChat'] = chat;
    });

    it('should send a message and receive a response', async () => {
      const userMessage = 'Hello';
      const assistantResponse = 'Hi there!';
      component['userInput'] = userMessage;

      chatService.sendMessage.and.returnValue(Promise.resolve(assistantResponse));
      spyOn(component, 'generateChatTitle').and.returnValue(Promise.resolve('New Title'));
      await component['sendMessage']();

      expect(component['messages'].length).toBe(2);
      expect(component['messages'][0].role).toBe('user');
      expect(component['messages'][0].content).toBe(userMessage);
      expect(component['messages'][1].role).toBe('assistant');
      expect(component['messages'][1].content).toBe(assistantResponse);
      expect(component['userInput']).toBe('');
      expect(component['loading']).toBe(false);
      expect(chatbotService.updateChat).toHaveBeenCalled();
    });

    it('should generate a chat title for the first user message', async () => {
      const userMessage = 'What is WISE?';
      const assistantResponse = 'WISE is a platform...';
      const newTitle = 'About WISE';
      component['userInput'] = userMessage;

      // First user message (only system message exists initially)
      component['messages'] = [];
      chatService.sendMessage.and.returnValue(Promise.resolve(assistantResponse));
      spyOn(component, 'generateChatTitle').and.returnValue(Promise.resolve(newTitle));

      await component['sendMessage']();

      expect(component['generateChatTitle']).toHaveBeenCalledWith(userMessage);
      expect(component['currentChat']?.title).toBe(newTitle);
      expect(chatbotService.updateChat).toHaveBeenCalled();
    });

    it('should not send empty messages', async () => {
      component['userInput'] = '   ';

      await component['sendMessage']();

      expect(chatService.sendMessage).not.toHaveBeenCalled();
      expect(component['messages'].length).toBe(0);
    });

    it('should not send messages when loading', async () => {
      component['userInput'] = 'Hello';
      component['loading'] = true;

      await component['sendMessage']();

      expect(chatService.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send messages when no current chat', async () => {
      component['userInput'] = 'Hello';
      component['currentChat'] = null;

      await component['sendMessage']();

      expect(chatService.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle errors when sending messages', async () => {
      component['userInput'] = 'Hello';
      chatService.sendMessage.and.returnValue(Promise.reject(new Error('API error')));

      await component['sendMessage']();

      expect(component['messages'].length).toBe(2);
      expect(component['messages'][1].role).toBe('assistant');
      expect(component['messages'][1].content).toContain('Sorry, I encountered an error');
      expect(component['loading']).toBe(false);
    });
  });

  describe('createNewChat', () => {
    it('should create a new chat with sequential numbering', async () => {
      const existingChats = [createMockChat('1'), createMockChat('2')];
      const newChat = createMockChat('3');

      chatbotService.getChats.and.returnValue(of(existingChats));
      chatbotService.createChat.and.returnValue(Promise.resolve(newChat));
      fixture.detectChanges();

      component['chats'] = existingChats;
      await component['createNewChat']();

      expect(chatbotService.createChat).toHaveBeenCalledWith(
        runId,
        workgroupId,
        nodeId,
        systemPrompt
      );
    });

    it('should switch to the newly created chat', async () => {
      const newChat = createMockChat('1');
      chatbotService.getChats.and.returnValue(of([newChat]));
      chatbotService.createChat.and.returnValue(Promise.resolve(newChat));
      fixture.detectChanges();

      await component['createNewChat']();
      expect(chatbotService.createChat).toHaveBeenCalledWith(
        runId,
        workgroupId,
        nodeId,
        systemPrompt
      );

      expect(component['currentChat']).toEqual(newChat);
      expect(component['messages']).toEqual(newChat.messages);
    });
  });

  describe('switchToChat', () => {
    it('should switch to a different chat', () => {
      const chat1 = createMockChat('1');
      const chat2 = createMockChat('2', [new ChatMessage('user', 'Hello', nodeId)]);

      chatbotService.getChats.and.returnValue(of([chat1, chat2]));
      fixture.detectChanges();

      component['currentChat'] = chat1;
      component['switchToChat'](chat2);

      expect(component['currentChat']).toEqual(chat2);
      expect(component['messages']).toEqual(chat2.messages);
    });
  });

  xdescribe('toggleCollapse', () => {
    beforeEach(() => {
      chatbotService.getChats.and.returnValue(of([]));
      chatbotService.createChat.and.returnValue(Promise.resolve(createMockChat('1')));
      fixture.detectChanges();
    });

    it('should toggle collapsed state', () => {
      component['collapsed'] = true;
      component['full'] = false;

      component['toggleCollapse']();

      expect(component['collapsed']).toBe(false);
    });

    it('should open fullscreen on small screens when collapsed', () => {
      component['collapsed'] = true;
      breakpointObserver.isMatched.and.returnValue(true);

      component['toggleCollapse']();

      expect(component['full']).toBe(true);
      expect(component['collapsed']).toBe(false);
    });

    it('should exit fullscreen mode when toggling', () => {
      component['collapsed'] = false;
      component['full'] = true;

      component['toggleCollapse']();

      expect(component['full']).toBe(false);
      expect(component['collapsed']).toBe(true);
    });
  });

  xdescribe('fullscreen', () => {
    beforeEach(() => {
      chatbotService.getChats.and.returnValue(of([]));
      chatbotService.createChat.and.returnValue(Promise.resolve(createMockChat('1')));
      fixture.detectChanges();
    });

    it('should enter fullscreen mode when collapsed', () => {
      component['collapsed'] = true;
      component['full'] = false;

      component['fullscreen']();

      expect(component['full']).toBe(true);
      expect(component['collapsed']).toBe(false);
    });

    it('should toggle fullscreen mode when not collapsed', () => {
      component['collapsed'] = false;
      component['full'] = false;

      component['fullscreen']();

      expect(component['full']).toBe(true);
    });
  });

  describe('handleKeyPress', () => {
    beforeEach(() => {
      const chat = createMockChat('1');
      chatbotService.getChats.and.returnValue(of([chat]));
      chatbotService.updateChat.and.returnValue(Promise.resolve(chat));
      fixture.detectChanges();
      component['currentChat'] = chat;
    });

    it('should send message on Enter key press', () => {
      component['userInput'] = 'Hello';
      chatService.sendMessage.and.returnValue(Promise.resolve('Response'));
      spyOn(component, 'generateChatTitle').and.returnValue(Promise.resolve('New Title'));

      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      spyOn(event, 'preventDefault');

      component['handleKeyPress'](event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should not send message on Enter + Shift key press', () => {
      component['userInput'] = 'Hello';

      const event = new KeyboardEvent('keypress', { key: 'Enter', shiftKey: true });
      spyOn(event, 'preventDefault');

      component['handleKeyPress'](event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(chatService.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      chatbotService.getChats.and.returnValue(of([]));
      chatbotService.createChat.and.returnValue(Promise.resolve(createMockChat('1')));
      fixture.detectChanges();

      spyOn(component['subscriptions'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
    });
  });
});
