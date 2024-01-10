export class ArchiveProjectResponse {
  archived: boolean;
  id: number;

  constructor(id: number, archived: boolean) {
    this.id = id;
    this.archived = archived;
  }
}
