import { Component, OnInit } from '@angular/core';
import { LocationTypesService } from '../../../services/location-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-location-type',
  templateUrl: './add-location-type.component.html',
  styleUrls: ['./add-location-type.component.scss'],
})
export class AddLocationTypeComponent implements OnInit {
  model: any = {
    parentId: {
      typeId: 0,
    },
  };

  index: number = 0;
  companyId: number = 0;
  companyName: string = '';
  globalCompany: any = {};
  locationsTypes: any[] = [];

  value: number | null = null;
  items: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });

  userName: string | null = null;
  dismissible: boolean = true;
  helpFlag: boolean = false;
  loader: boolean = false;

  constructor(
    private locationTypesService: LocationTypesService,
    private router: Router,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyId ?? 0;
      this.companyName = this.globalCompany.name ?? '';
    }

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value?.companyId ?? 0;
      this.companyName = value?.name ?? '';
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.getAllLocTypes();
  }

  getAllLocTypes(): void {
    this.spinner.show();
    this.locationTypesService
      .getAllLocationTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();
          this.locationsTypes = (response as any[]) ?? [];
          if (this.locationsTypes.length > 0) {
            this.items = this.generateHierarchy(this.locationsTypes);
          }
        },
        () => {
          this.spinner.hide();
        }
      );
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
        children,
      });
    });
  }

  onValueChange(value: number): void {
    this.value = value;
  }

  saveLocation(): void {
    if (!this.model.name) {
      this.index = -1;
      window.scroll(0, 0);
      return;
    }

    const request = {
      attributeSearchDisplay: 0,
      company: {
        companyId: this.companyId,
      },
      description: this.model.description,
      entityTypeId: 0,
      hostingFee: this.model.hostingFee ? this.model.hostingFee : 0,
      isHidden: true,
      lastModifiedBy: this.userName,
      moduleType: 'locationtype',
      name: this.model.name,
      parentId: {
        typeId: this.value ?? 0,
      },
      typeId: 0,
      typeMtbs: 0,
      typeSpareRatio: 0,
    };

    this.spinner.show();
    this.locationTypesService.saveLocationType(request).subscribe(
      () => {
        this.spinner.hide();
        this.index = 1;
        setTimeout(() => (this.index = 0), 7000);
        window.scroll(0, 0);
        this.router.navigate(['/location/types']);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
