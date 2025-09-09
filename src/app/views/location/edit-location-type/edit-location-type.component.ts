import { Component, OnInit } from '@angular/core';
import { LocationTypesService } from '../../../services/location-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-edit-location-type',
  templateUrl: './edit-location-type.component.html',
  styleUrls: ['./edit-location-type.component.scss'],
})
export class EditLocationTypeComponent implements OnInit {
  model: any = {
    parentId: {
      typeId: 0,
    },
  };

  locationTypeId!: number;
  companyId!: number;
  companyName!: string;
  globalCompany: any;

  items: TreeviewItem[] = [];
  locationsTypes: any[] = [];

  value: number | null = null;
  index = 0;

  userName!: string | null;
  helpFlag = false;
  dismissible = true;
  loader = false;

  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });

  constructor(
    private locationTypesService: LocationTypesService,
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.locationTypeId = Number(this.route.snapshot.params['id']);
    this.companyId = Number(this.route.snapshot.params['cmpId']);

    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany?.name;

    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = value.name;
    });
  }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
    this.getAllLocTypes();
  }

  private getLocationType(typeId: number): void {
    this.spinner.show();
    this.locationTypesService.getLocationTypeDetails(String(typeId)).subscribe(
      (response) => {
        this.spinner.hide();
        this.model = response;

        if (!this.model.parentId) {
          this.model.parentId = { typeId: 0 };
        } else {
          this.value = this.model.parentId.typeId;
        }
      },
      () => this.spinner.hide()
    );
  }

  private getAllLocTypes(): void {
    this.spinner.show();
    this.locationTypesService
  .getAllLocationTypesWithHierarchy(this.companyId)
  .subscribe(
    (response: any) => {
      this.spinner.hide();
      this.locationsTypes = response || [];
      if (Array.isArray(this.locationsTypes) && this.locationsTypes.length > 0) {
        this.items = this.generateHierarchy(this.locationsTypes);
      }
      this.getLocationType(this.locationTypeId);
    },
    () => this.spinner.hide()
  );
  }

  private generateHierarchy(typeList: any[]): TreeviewItem[] {
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

  updateLocationType(): void {
    if (this.model.name && this.value !== this.locationTypeId) {
      const request = {
        attributeSearchDisplay: 0,
        description: this.model.description,
        entityTypeId: this.model.entitytypeId || 0,
        hostingFee: this.model.hostingFee || 0,
        isHidden: true,
        lastModifiedBy: this.userName,
        moduleType: 'locationtype',
        name: this.model.name,
        parentId: { typeId: this.value || 0 },
        company: { companyId: this.companyId },
        typeList: this.model.typeList || [],
        typeId: this.locationTypeId,
        typeMtbs: 0,
        typeSpareRatio: 0,
      };

      this.spinner.show();
      this.locationTypesService.updateLocationType(request).subscribe(
        () => {
          this.spinner.hide();
          this.index = 1;
          setTimeout(() => (this.index = 0), 7000);
          window.scroll(0, 0);
          this.router.navigate(['/location/types']);
        },
        () => this.spinner.hide()
      );
    } else {
      this.index = this.value === this.locationTypeId ? -2 : -1;
      window.scroll(0, 0);
    }
  }

  print(): void {
    this.helpFlag = false;
    window.print();
  }

  help(): void {
    this.helpFlag = !this.helpFlag;
  }
}
