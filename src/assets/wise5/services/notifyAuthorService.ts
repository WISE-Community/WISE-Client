import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NotifyAuthorService {
  constructor(private http: HttpClient) {}

  editBegin(projectId: number): void {
    this.http.post(`/api/author/project/notify/${projectId}/true`, null).subscribe();
  }

  editEnd(projectId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (projectId == null) {
        resolve();
      }
      this.http.post(`/api/author/project/notify/${projectId}/false`, null).subscribe(() => {
        resolve();
      });
    });
  }
}
