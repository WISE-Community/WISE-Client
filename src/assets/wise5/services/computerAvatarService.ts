'use strict';

import { Injectable } from '@angular/core';
import { ComputerAvatar } from '../common/ComputerAvatar';
import { copy } from '../common/object/object';

@Injectable()
export class ComputerAvatarService {
  avatars: ComputerAvatar[] = [
    new ComputerAvatar('person1', $localize`:A name for a computer avatar:Ermina`, 'person-1.png'),
    new ComputerAvatar('person2', $localize`:A name for a computer avatar:Alyx`, 'person-2.png'),
    new ComputerAvatar('person3', $localize`:A name for a computer avatar:Kai`, 'person-3.png'),
    new ComputerAvatar('person4', $localize`:A name for a computer avatar:Morgan`, 'person-4.png'),
    new ComputerAvatar('person5', $localize`:A name for a computer avatar:Parker`, 'person-5.png'),
    new ComputerAvatar('person6', $localize`:A name for a computer avatar:Milan`, 'person-6.png'),
    new ComputerAvatar('person7', $localize`:A name for a computer avatar:Emery`, 'person-7.png'),
    new ComputerAvatar('person8', $localize`:A name for a computer avatar:Yuna`, 'person-8.png'),
    new ComputerAvatar('robot1', $localize`:A name for a computer avatar:Ada`, 'robot-1.png'),
    new ComputerAvatar('robot2', $localize`:A name for a computer avatar:Nico`, 'robot-2.png')
  ];
  avatarsPath: string = '/assets/img/computer-avatars/';

  getAvatar(id: string): ComputerAvatar {
    return this.avatars.find((avatar) => avatar.id === id);
  }

  getAvatars(): ComputerAvatar[] {
    return copy(this.avatars);
  }

  getAvatarsPath(): string {
    return this.avatarsPath;
  }

  getDefaultAvatar(): ComputerAvatar {
    return this.getAvatar('robot1');
  }

  getDefaultComputerAvatarSettings(): any {
    return {
      ids: this.getAvatars().map((avatar) => avatar.id),
      label: this.getDefaultComputerAvatarLabel(),
      prompt: $localize`Discuss your answer with a thought buddy!`,
      initialResponse: $localize`Hi there! It's nice to meet you. What do you think about...`
    };
  }

  getDefaultComputerAvatarLabel(): string {
    return $localize`Thought Buddy`;
  }
}
