'use strict';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './configService';
import { Observable, Subject } from 'rxjs';
import { StudentAssetRequest } from '../vle/studentAsset/StudentAssetRequest';
import { isAudio, isImage } from '../common/file/file';
import { Component } from '../common/Component';

@Injectable()
export class StudentAssetService {
  allAssets = [];
  private attachStudentAssetSource: Subject<StudentAssetRequest> = new Subject<StudentAssetRequest>();
  public attachStudentAsset$: Observable<StudentAssetRequest> = this.attachStudentAssetSource.asObservable();

  constructor(private http: HttpClient, private ConfigService: ConfigService) {}

  getAssetById(assetId) {
    for (const asset of this.allAssets) {
      if (asset.id === assetId) {
        return asset;
      }
    }
    return null;
  }

  retrieveAssets() {
    if (this.ConfigService.isPreview()) {
      this.allAssets = [];
      return Promise.resolve(this.allAssets);
    } else {
      return this.http
        .get(`${this.ConfigService.getStudentAssetsURL()}/${this.ConfigService.getWorkgroupId()}`)
        .toPromise()
        .then((assets: any) => {
          this.allAssets = [];
          const studentUploadsBaseURL = this.ConfigService.getStudentUploadsBaseURL();
          for (const asset of assets) {
            if (
              !asset.isReferenced &&
              asset.serverDeleteTime == null &&
              asset.fileName !== '.DS_Store'
            ) {
              asset.url = studentUploadsBaseURL + asset.filePath;
              if (this.isImage(asset)) {
                asset.type = 'image';
                asset.iconURL = asset.url;
              } else if (this.isAudio(asset)) {
                asset.type = 'audio';
                asset.iconURL = 'assets/wise5/vle/notebook/audio.png';
              } else {
                asset.type = 'file';
                asset.iconURL = 'assets/wise5/vle/notebook/file.png';
              }
              this.allAssets.push(asset);
            }
          }
          return this.allAssets;
        });
    }
  }

  getAssetContent(asset) {
    return this.http
      .get(asset.url)
      .toPromise()
      .then((response) => {
        return response;
      });
  }

  isImage(asset) {
    return isImage(this.getFileNameFromAsset(asset));
  }

  isAudio(asset) {
    return isAudio(this.getFileNameFromAsset(asset));
  }

  getFileNameFromAsset(asset) {
    if (this.ConfigService.isPreview()) {
      return asset.file;
    } else {
      return asset.fileName;
    }
  }

  uploadAsset(file) {
    if (this.ConfigService.isPreview()) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = ((theFile) => {
          return (e) => {
            const asset: any = {
              file: theFile.name,
              url: e.target.result
            };
            this.setAssetTypeAndIconURL(asset);
            this.allAssets.push(asset);
            resolve(asset);
          };
        })(file);
        reader.readAsDataURL(file);
      });
    } else {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('clientSaveTime', Date.parse(new Date().toString()) + '');
        formData.append('files', file, file.name);
        formData.append('periodId', this.ConfigService.getPeriodId());
        formData.append('runId', this.ConfigService.getRunId());
        formData.append('workgroupId', this.ConfigService.getWorkgroupId());
        this.http.post(this.ConfigService.getStudentAssetsURL(), formData).subscribe(
          (asset: any) => {
            if (asset === 'error') {
              alert($localize`There was an error uploading.`);
            } else {
              const studentUploadsBaseURL = this.ConfigService.getStudentUploadsBaseURL();
              asset.url = studentUploadsBaseURL + asset.filePath;
              this.setAssetTypeAndIconURL(asset);
              this.allAssets.push(asset);
              resolve(asset);
            }
          },
          () => {
            alert(
              $localize`There was an error uploading. You might have reached your file upload limit or the file you tried to upload was too large. Please ask your teacher for help.`
            );
            reject();
          }
        );
      });
    }
  }

  private setAssetTypeAndIconURL(asset: any): void {
    if (this.isImage(asset)) {
      asset.type = 'image';
      asset.iconURL = asset.url;
    } else if (this.isAudio(asset)) {
      asset.type = 'audio';
      asset.iconURL = 'assets/wise5/themes/default/images/audio.png';
    } else {
      asset.type = 'file';
      asset.iconURL = 'assets/wise5/themes/default/images/file.png';
    }
  }

  // given asset, makes a copy of it so steps can use for reference. Returns newly-copied asset.
  copyAssetForReference(studentAsset) {
    if (this.ConfigService.isPreview()) {
      return Promise.resolve(studentAsset);
    } else {
      return this.http
        .post(`${this.ConfigService.getStudentAssetsURL()}/copy`, {
          studentAssetId: studentAsset.id,
          workgroupId: this.ConfigService.getWorkgroupId(),
          periodId: this.ConfigService.getPeriodId(),
          clientSaveTime: Date.parse(new Date().toString())
        })
        .toPromise()
        .then((copiedAsset: any) => {
          if (copiedAsset != null) {
            const studentUploadsBaseURL = this.ConfigService.getStudentUploadsBaseURL();
            if (copiedAsset.isReferenced && copiedAsset.fileName !== '.DS_Store') {
              copiedAsset.url = studentUploadsBaseURL + copiedAsset.filePath;
              if (this.isImage(copiedAsset)) {
                copiedAsset.type = 'image';
                copiedAsset.iconURL = copiedAsset.url;
              } else if (this.isAudio(copiedAsset)) {
                copiedAsset.type = 'audio';
                copiedAsset.iconURL = 'assets/wise5/vle/notebook/audio.png';
              } else {
                copiedAsset.type = 'file';
                copiedAsset.iconURL = 'assets/wise5/vle/notebook/file.png';
              }
              return copiedAsset;
            }
          }
          return null;
        });
    }
  }

  deleteAsset(studentAsset: any) {
    if (this.ConfigService.isPreview()) {
      return new Promise((resolve, reject) => {
        this.allAssets = this.allAssets.splice(this.allAssets.indexOf(studentAsset), 1);
        return resolve(studentAsset);
      });
    } else {
      let httpParams = new HttpParams();
      httpParams = httpParams.set('studentAssetId', studentAsset.id);
      httpParams = httpParams.set('workgroupId', this.ConfigService.getWorkgroupId());
      httpParams = httpParams.set('periodId', this.ConfigService.getPeriodId());
      httpParams = httpParams.set('clientDeleteTime', `${Date.parse(new Date().toString())}`);
      const options = { params: httpParams };
      return this.http
        .delete(`${this.ConfigService.getStudentAssetsURL()}/delete`, options)
        .toPromise()
        .then(() => {
          this.allAssets.splice(this.allAssets.indexOf(studentAsset), 1);
          return studentAsset;
        });
    }
  }

  broadcastAttachStudentAsset(component: Component, asset: any): void {
    this.attachStudentAssetSource.next({
      asset: asset,
      component: component
    });
  }
}
