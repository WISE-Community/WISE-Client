import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'peer-chat-question-bank',
  templateUrl: './peer-chat-question-bank.component.html',
  styleUrls: ['./peer-chat-question-bank.component.scss']
})
export class PeerChatQuestionBankComponent implements OnInit {
  @Input()
  questions: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
