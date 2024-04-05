import { Tag } from './tag';

export class ArchiveProjectResponse {
  archived: boolean;
  id: number;
  tag: Tag;

  constructor(id: number, archived: boolean, tag: Tag) {
    this.id = id;
    this.archived = archived;
    this.tag = tag;
  }
}
