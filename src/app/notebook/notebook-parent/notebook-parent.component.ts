import { Component, Input } from '@angular/core';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ObjectService } from '../../../assets/wise5/services/objectService';

@Component({
  selector: 'notebook-parent',
  template: ''
})
export class NotebookParentComponent {
  @Input() config: any;
  @Input() workgroupId: number;
  @Input() mode: string;
  notebook: any;

  constructor(
    public ConfigService: ConfigService,
    public NotebookService: NotebookService,
    public objectService: ObjectService
  ) {}

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
      this.config = this.objectService.copy(this.NotebookService.getStudentNotebookConfig());
    } else {
      this.config = this.objectService.copy(this.NotebookService.getTeacherNotebookConfig());
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
