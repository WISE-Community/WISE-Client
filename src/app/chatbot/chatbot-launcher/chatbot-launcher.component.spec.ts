import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotLauncherComponent } from './chatbot-launcher.component';

describe('ChatbotLauncherComponent', () => {
  let component: ChatbotLauncherComponent;
  let fixture: ComponentFixture<ChatbotLauncherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotLauncherComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotLauncherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
