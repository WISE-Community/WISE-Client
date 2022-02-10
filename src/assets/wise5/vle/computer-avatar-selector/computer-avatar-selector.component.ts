import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'computer-avatar-selector',
  templateUrl: './computer-avatar-selector.component.html',
  styleUrls: ['./computer-avatar-selector.component.scss']
})
export class ComputerAvatarSelectorComponent implements OnInit {
  @Input()
  label: string;

  @Input()
  prompt: string;

  @Output()
  chooseAvatarEvent = new EventEmitter<string>();

  avatars: any[] = [
    { id: 'robot', name: 'Robot', image: 'robot.png' },
    { id: 'monkey', name: 'Monkey', image: 'monkey.jpg' },
    { id: 'girl', name: 'Girl', image: 'robot.png' },
    { id: 'boy', name: 'Boy', image: 'monkey.jpg' },
    { id: 'tiger', name: 'Tiger', image: 'robot.png' },
    { id: 'koala', name: 'Koala', image: 'monkey.jpg' }
  ];
  avatarSelected: any;
  avatarsPath: string = '/assets/img/computer-avatars/';

  constructor() {}

  ngOnInit(): void {
    if (this.prompt == null) {
      this.prompt =
        'Discuss your answer with a thought partner!\n' +
        'Your partner will ask you to explain your thinking and will compare your response to ' +
        'responses from other students around the world.\n' +
        'Then your partner will ask some questions to help you.';
    }
    if (this.label == null) {
      this.label = 'Thought Partner';
    }
  }

  highlightAvatar(avatar: any): void {
    this.avatars.forEach((avatar) => delete avatar.isSelected);
    avatar.isSelected = true;
    this.avatarSelected = avatar;
  }

  chooseAvatar(): void {
    delete this.avatarSelected.isSelected;
    this.chooseAvatarEvent.emit(this.avatarSelected);
  }
}
