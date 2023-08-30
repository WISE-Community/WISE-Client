'use strict';

import { HttpClient } from '@angular/common/http';
import { Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Directive()
export abstract class ConfigureStructureComponent {
  protected groupsPath: string;
  protected nodesPath: string;
  private structure: any = {};
  private structureDir: string = 'assets/wise5/authoringTool/structure';

  constructor(
    private http: HttpClient,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
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
    this.router.navigate(['../location'], {
      relativeTo: this.route,
      state: { structure: this.structure }
    });
  }
}
