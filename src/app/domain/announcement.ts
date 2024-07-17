import { AnnouncementButton } from './announcementButton';

export class Announcement {
  visible: boolean = true;
  bannerText: string = '';
  bannerButton: string = '';
  title: string = '';
  content: string = '';
  buttons: AnnouncementButton[] = [];
}
