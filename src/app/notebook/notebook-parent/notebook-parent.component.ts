import { Component, Input } from '@angular/core';
import { copy } from '../../../assets/wise5/common/object/object';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';

@Component({
  selector: 'notebook-parent',
  template: ''
})
export class NotebookParentComponent {
  @Input() config: any;
  @Input() mode: string;
  @Input() workgroupId: number;
  notebook: any;

  constructor(public ConfigService: ConfigService, public NotebookService: NotebookService) {}

  ngOnInit(): void {
    if (this.workgroupId == null) {
      this.workgroupId = this.ConfigService.getWorkgroupId();
    }
    if (this.config == null) {
      this.setConfig();
    }
    this.notebook = this.NotebookService.getNotebookByWorkgroup(this.workgroupId);
  }

  setConfig(): void {
    if (this.isStudentNotebook()) {
      this.config = copy(this.NotebookService.getStudentNotebookConfig());
    } else {
      this.config = copy(this.NotebookService.getTeacherNotebookConfig());
    }
  }

  isStudentNotebook(): boolean {
    return (
      this.ConfigService.getMode() === 'studentRun' ||
      this.ConfigService.getMode() === 'preview' ||
      ((this.ConfigService.isRunOwner() || this.ConfigService.isRunSharedTeacher()) &&
        this.ConfigService.getWorkgroupId() !== this.workgroupId)
    );
  }
}
