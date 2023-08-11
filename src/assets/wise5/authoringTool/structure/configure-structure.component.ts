'use strict';

import { HttpClient } from '@angular/common/http';
import { Directive } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';

@Directive()
export abstract class ConfigureStructureComponent {
  groupsPath: string;
  nodesPath: string;
  $state: any;
  structure: any = {};
  structureDir: string = 'assets/wise5/authoringTool/structure';

  constructor(private http: HttpClient, protected upgrade: UpgradeModule) {}

  ngOnInit(): void {
    this.$state = this.upgrade.$injector.get('$state');
    this.injectGroupAndNodes();
  }

  protected injectGroupAndNodes(): void {
    this.injectGroup();
    this.injectNodes();
  }

  protected injectGroup(): void {
    this.fetchGroups();
  }

  protected injectNodes(): void {
    this.fetchNodes();
  }

  protected fetchGroups(groupsPath: string = this.groupsPath): void {
    this.http.get(`${this.structureDir}/${groupsPath}`).subscribe((group: any) => {
      this.structure.group = group;
    });
  }

  protected fetchNodes(nodesPath: string = this.nodesPath): void {
    this.http.get(`${this.structureDir}/${nodesPath}`).subscribe((nodes: any[]) => {
      this.structure.nodes = nodes;
    });
  }

  protected chooseLocation(): void {
    this.$state.go('root.at.project.structure.location', { structure: this.structure });
  }

  protected goToChooseStructure(): void {
    this.$state.go('root.at.project.structure.choose');
  }

  protected cancel() {
    this.$state.go('root.at.project');
  }
}
