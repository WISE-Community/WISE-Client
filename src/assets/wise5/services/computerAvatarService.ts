'use strict';

import { Injectable } from '@angular/core';
import { ComputerAvatar } from '../common/ComputerAvatar';

@Injectable()
export class ComputerAvatarService {
  avatars: ComputerAvatar[] = [
    new ComputerAvatar('robot', 'Robot', 'robot.png'),
    new ComputerAvatar('monkey', 'Monkey', 'monkey.jpg'),
    new ComputerAvatar('girl', 'Girl', 'robot.png'),
    new ComputerAvatar('boy', 'Boy', 'monkey.jpg'),
    new ComputerAvatar('tiger', 'Tiger', 'robot.png'),
    new ComputerAvatar('koala', 'Koala', 'monkey.jpg')
  ];
  avatarsPath: string = '/assets/img/computer-avatars/';

  getAvatar(id: string): ComputerAvatar {
    return this.avatars.find((avatar) => avatar.id === id);
  }

  getAvatars(): ComputerAvatar[] {
    return JSON.parse(JSON.stringify(this.avatars));
  }

  getAvatarsPath(): string {
    return this.avatarsPath;
  }
}
