'use strict';

import { Injectable } from '@angular/core';
import { ComputerAvatar } from '../common/ComputerAvatar';

@Injectable()
export class ComputerAvatarService {
  avatars: any[] = [
    new ComputerAvatar('robot', 'Robot', 'robot.png'),
    new ComputerAvatar('monkey', 'Monkey', 'monkey.jpg'),
    new ComputerAvatar('girl', 'Girl', 'robot.png'),
    new ComputerAvatar('boy', 'Boy', 'monkey.jpg'),
    new ComputerAvatar('tiger', 'Tiger', 'robot.png'),
    new ComputerAvatar('koala', 'Koala', 'monkey.jpg')
  ];
  avatarsPath: string = '/assets/img/computer-avatars/';

  getAvatars(): ComputerAvatar[] {
    return JSON.parse(JSON.stringify(this.avatars));
  }

  getAvatarsPath(): string {
    return this.avatarsPath;
  }

  getImage(id: string): string {
    for (const avatar of this.avatars) {
      if (avatar.id === id) {
        return avatar.image;
      }
    }
    return '';
  }

  getName(id: string): string {
    for (const avatar of this.avatars) {
      if (avatar.id === id) {
        return avatar.name;
      }
    }
    return '';
  }
}
