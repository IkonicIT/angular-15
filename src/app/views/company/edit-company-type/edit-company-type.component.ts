import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { CompanyTypesService } from '../../../services/index';
import { Company } from '../../../models';

@Component({
  selector: 'app-edit-company-type',
  templateUrl: './edit-company-type.component.html',
  styleUrls: ['./edit-company-type.component.scss'],
})
export class EditCompanyTypeComponent implements OnInit, OnDestroy {
  model: any = {
    parentId: {
      typeId: 0,
    },
  };
  index = 0;
  companyId = 0;
  typeId = 0;
  private sub: Subscription = new Subscription();
  id!: number;
  cmpTypes: any[] = [];
  value: number | null = null;
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  userName: string | null = null;
  helpFlag = false;
  dismissible = true;
  loader = false;

  constructor(
    private companyTypesService: CompanyTypesService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.companyId = Number(this.route.snapshot.params['id']);
    console.log('companyId=', this.companyId);
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');

    // Subscribe to query params
    this.sub.add(
      this.route.queryParams.subscribe((params) => {
        this.companyId = +params['q'] || 0;
        this.typeId = +params['a'] || 0;
        console.log('Query params companyId:', this.companyId, 'typeId:', this.typeId);
      })
    );

    this.spinner.show();

    this.companyTypesService.getCompanyType(this.typeId).subscribe({
      next: (response) => {
        this.model = response;
        if (!this.model.parentId) {
          this.model.parentId = { typeId: 0 };
        } else {
          this.value = this.model.parentId.typeId;
        }
        this.getAllTypes();
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getAllTypes(): void {
    this.spinner.show();
    this.companyTypesService
      .getAllCompanyTypesWithHierarchy(this.companyId)
      .subscribe({
        next: (response: any[]) => {
          this.spinner.hide();
          this.cmpTypes = response;
          if (this.cmpTypes?.length > 0) {
            this.items = this.generateHierarchy(this.cmpTypes);
          }
        },
        error: () => {
          this.spinner.hide();
        },
      });
  }

  generateHierarchy(typeList: any[]): TreeviewItem[] {
    return typeList.map((type) => {
      const children =
        type.typeList && type.typeList.length > 0
          ? this.generateHierarchy(type.typeList)
          : [];
      return new TreeviewItem({
        text: type.name,
        value: type.typeId,
        collapsed: true,
        children: children,
      });
    });
  }

  onValueChange(value: number): void {
    console.log(value);
  }

  updateCompanyType(): void {
    if (!this.model.name || this.value === this.typeId) {
      this.index = this.value === this.typeId ? -2 : -1;
      window.scroll(0, 0);
      return;
    }

    const request = {
      attributeSearchDisplay: 0,
      company: { companyId: this.companyId },
      description: this.model.description,
      entityTypeId: this.model.entitytypeId,
      hostingFee: this.model.hostingFee,
      isHidden: true,
      lastModifiedBy: this.userName,
      moduleType: 'companytype',
      name: this.model.name,
      parentId: { typeId: this.value ?? 0 },
      typeList: this.model.typeList,
      typeId: this.typeId,
      typeMtbs: 0,
      typeSpareRatio: 0,
    };

    this.spinner.show();

    this.companyTypesService.updateCompanyType(this.typeId, request).subscribe({
      next: () => {
        this.spinner.hide();
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        window.scroll(0, 0);
        this.router.navigate(['/company/types', this.companyId]);
      },
      error: () => {
        this.spinner.hide();
      },
    });
  }

  cancelCompanyDocument(): void {
    this.router.navigate(['/company/types', this.companyId]);
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
