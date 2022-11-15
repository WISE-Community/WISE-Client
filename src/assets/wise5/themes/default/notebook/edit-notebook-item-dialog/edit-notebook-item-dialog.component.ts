import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { ProjectService } from '../../../../services/projectService';
import { RandomKeyService } from '../../../../services/randomKeyService';
import { StudentAssetService } from '../../../../services/studentAssetService';
import { UtilService } from '../../../../services/utilService';

@Component({
  selector: 'edit-notebook-item-dialog',
  templateUrl: './edit-notebook-item-dialog.component.html',
  styleUrls: ['./edit-notebook-item-dialog.component.scss']
})
export class EditNotebookItemDialogComponent implements OnInit {
  color: any;
  file: any;
  isEditMode: boolean;
  isEditTextEnabled: boolean;
  isFileUploadEnabled: boolean;
  item: any;
  itemId: string;
  nodeId: string;
  note: any;
  notebookConfig: any;
  noteFormGroup: FormGroup;
  saveEnabled: boolean;
  showUpload: boolean = false;
  studentWorkIds: number[];
  text: string;
  textInputLabel: string;
  textRequired: boolean;
  title: string;

  constructor(
    private configService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditNotebookItemDialogComponent>,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private studentAssetService: StudentAssetService,
    private utilService: UtilService
  ) {
    this.nodeId = this.data.nodeId;
    this.file = this.data.file;
    this.isEditMode = this.data.isEditMode;
    this.isEditTextEnabled = this.data.isEditTextEnabled;
    this.isFileUploadEnabled = this.data.isFileUploadEnabled;
    this.note = this.data.note;
    this.studentWorkIds = this.data.studentWorkIds;
    this.text = this.data.text;
  }

  ngOnInit(): void {
    if (this.note == null) {
      const currentNodeTitle = this.projectService.getNodeTitle(this.nodeId);

      this.item = {
        id: null, // null id means we're creating a new notebook item.
        localNotebookItemId: RandomKeyService.generate(),
        type: 'note', // the notebook item type, TODO: once questions are enabled, don't hard code
        nodeId: this.nodeId,
        title: $localize`Note from ${currentNodeTitle}`,
        content: {
          text: '',
          attachments: []
        }
      };
    } else {
      this.item = this.utilService.makeCopyOfJSONObject(this.note);
      this.itemId = this.item.id;
      // Set to null so we're creating a new notebook item.
      // An edit to a notebook item results in a new entry in the db.
      this.item.id = null;
      if (
        this.isNotebookItemPublic(this.item) &&
        this.item.workgroupId != this.configService.getWorkgroupId()
      ) {
        this.isEditMode = false;
      }
    }

    // this.notebookConfig = this.NotebookService.getNotebookConfig();
    this.notebookConfig = this.data.notebookConfig;
    this.color = this.notebookConfig.itemTypes[this.item.type].label.color;
    this.textRequired = this.notebookConfig.itemTypes?.note?.requireTextOnEveryNote;

    let label = this.notebookConfig.itemTypes[this.item.type].label.singular;
    if (this.isEditMode) {
      if (this.itemId) {
        this.title = $localize`Edit ${label}`;
      } else {
        this.title = $localize`Add ${label}`;
      }
    } else {
      this.title = $localize`View ${label}`;
    }
    const noteTerm = this.notebookConfig.itemTypes[this.item.type].label.link;
    this.textInputLabel = $localize`:Label for note text input:${noteTerm} text`;
    this.saveEnabled = false;

    if (this.file != null) {
      // student is trying to add a file to this notebook item.
      this.attachStudentAssetToNote(this.file);
    } else {
      this.setShowUpload();
    }

    if (this.text != null) {
      this.item.content.text = this.text;
      this.saveEnabled = true;
    }
    if (!this.isFileUploadEnabled) {
      this.showUpload = false;
    }
    this.intitializeForm();

    if (this.studentWorkIds != null) {
      this.item.content.studentWorkIds = this.studentWorkIds;
    }
  }

  intitializeForm(): void {
    this.noteFormGroup = this.fb.group({
      text: new FormControl('')
    });
    const textInput = this.noteFormGroup.get('text');
    if (!this.isEditMode || !this.isEditTextEnabled) {
      textInput.disable();
    }
    if (this.textRequired) {
      textInput.setValidators(Validators.required);
    }
  }

  isSharedWithClass(): boolean {
    return this.item.groups != null && this.item.groups.includes('public');
  }

  toggleMakeNotePublic(): void {
    if (this.item.groups == null) {
      this.item.groups = [];
    }
    if (!this.item.groups.includes('public')) {
      this.item.groups.push('public');
    } else {
      for (let i = 0; i < this.item.groups.length; i++) {
        if (this.item.groups[i] === 'public') {
          this.item.groups.splice(i, 1);
          break;
        }
      }
    }
    this.update();
  }

  copyPublicNotebookItem(ev): void {
    ev.stopPropagation();
    this.data.copyNotebookItem(this.itemId);
    this.dialogRef.close();
  }

  attachStudentAssetToNote(file: any): void {
    const attachment: any = {
      studentAssetId: null,
      iconURL: '',
      file: file
    };

    /*
     * read image data as URL and set it in the attachment iconURL attribute
     * so students can preview the image
     */
    const reader = new FileReader();
    reader.onload = (event) => {
      attachment.iconURL = event.target.result;
      this.item.content.attachments.push(attachment);
      this.update();
    };
    reader.readAsDataURL(file);
  }

  getItemNodeId(): string {
    return this.item == null ? null : this.item.nodeId;
  }

  getItemNodeLink(): string {
    return this.item == null ? '' : this.projectService.getNodePositionAndTitle(this.item.nodeId);
  }

  removeAttachment(attachment: any): void {
    if (this.item.content.attachments.indexOf(attachment) != -1) {
      this.item.content.attachments.splice(this.item.content.attachments.indexOf(attachment), 1);
      this.update();
    }
  }

  delete(ev): void {
    // TODO: add archiving/deleting notebook items
  }

  cancel(): void {
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): Promise<any> {
    // go through the notebook item's attachments and look for any attachments that need to be
    // uploaded and made into StudentAsset.
    let uploadAssetPromises = [];
    if (this.item.content.attachments != null) {
      for (let i = 0; i < this.item.content.attachments.length; i++) {
        let attachment = this.item.content.attachments[i];
        if (attachment.studentAssetId == null && attachment.file != null) {
          // this attachment hasn't been uploaded yet, so we'll do that now.
          let file = attachment.file;
          const promise = new Promise((resolve, reject) => {
            this.studentAssetService.uploadAsset(file).then((studentAsset) => {
              this.studentAssetService.copyAssetForReference(studentAsset).then((copiedAsset) => {
                if (copiedAsset != null) {
                  var newAttachment = {
                    studentAssetId: copiedAsset.id,
                    iconURL: copiedAsset.iconURL
                  };
                  this.item.content.attachments[i] = newAttachment;
                  resolve(newAttachment);
                }
              });
            });
          });
          uploadAssetPromises.push(promise);
        }
      }
    }

    // make sure all the assets are created before saving the notebook item.
    return Promise.all(uploadAssetPromises).then(() => {
      this.data
        .saveNotebookItem(
          this.item.id,
          this.item.nodeId,
          this.item.localNotebookItemId,
          this.item.type,
          this.item.title,
          this.item.content,
          this.item.groups,
          Date.parse(new Date().toString())
        )
        .then(() => {
          this.dialogRef.close();
        });
    });
  }

  update(): void {
    this.saveEnabled =
      this.item.content.text || (!this.textRequired && this.item.content.attachments.length);
    this.setShowUpload();
  }

  setShowUpload(): void {
    this.showUpload =
      this.notebookConfig.itemTypes != null &&
      this.notebookConfig.itemTypes.note != null &&
      this.notebookConfig.itemTypes.note.enableStudentUploads &&
      this.item.content.attachments &&
      this.item.content.attachments.length < 1;
  }

  canShareWithClass(): boolean {
    return this.projectService.isSpaceExists('public');
  }

  canCopyPublicNotebookItem(): boolean {
    return (
      !this.configService.isClassroomMonitor() &&
      this.projectService.isSpaceExists('public') &&
      !this.isMyNotebookItem()
    );
  }

  isMyNotebookItem(): boolean {
    return this.item.workgroupId === this.configService.getWorkgroupId();
  }

  isNotebookItemPublic(notebookItem: any): boolean {
    return !this.isNotebookItemPrivate(notebookItem);
  }

  isNotebookItemPrivate(notebookItem: any): boolean {
    return notebookItem.groups == null;
  }
}
