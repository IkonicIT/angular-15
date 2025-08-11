import { Component, OnInit } from '@angular/core';
import { LocationTypesService } from '../../../services/location-types.service';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-location-type',
  templateUrl: './add-location-type.component.html',
  styleUrls: ['./add-location-type.component.scss'],
})
export class AddLocationTypeComponent implements OnInit {
  model: any = {
    parentid: {
      typeid: 0,
    },
  };
  index: number = 0;
  companyId: number;
  globalCompany: any = {};
  locationsTypes: any;
  companyName: any;

  value: any;
  items: TreeviewItem[];
  config = TreeviewConfig.create({
    hasFilter: false,
    hasCollapseExpand: false,
  });
  userName: any;
  dismissible = true;
  helpFlag: any = false;
  loader = false;
  constructor(
    private locationTypesService: LocationTypesService,
    private router: Router,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyId = this.globalCompany.companyid;
    this.companyName = this.globalCompany.name;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
    });
    this.getAllLocTypes();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getAllLocTypes() {
    this.spinner.show();

    this.locationTypesService
      .getAllLocationTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.spinner.hide();

          this.locationsTypes = response;
          var self = this;
          if (this.locationsTypes && this.locationsTypes.length > 0) {
            self.items = [];
            self.items = this.generateHierarchy(this.locationsTypes);
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  generateHierarchy(typeList: any) {
    var items: any = [];
    typeList.forEach((type: any) => {
      var children = [];
      if (type.typeList && type.typeList.length > 0) {
        children = this.generateHierarchy(type.typeList);
      }
      items.push(
        new TreeviewItem({
          text: type.name,
          value: type.typeId,
          collapsed: true,
          children: children,
        })
      );
    });
    return items;
  }

  onValueChange(value: any) {
    console.log(value);
  }

  saveLocation() {
    if (this.model.name) {
      var request = {
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
          typeId: this.value ? this.value : 0,
        },
        typeId: 0,
        typeMtbs: 0,
        typeSpareRatio: 0,
      };
      this.spinner.show();

      this.locationTypesService.saveLocationType(request).subscribe(
        (response) => {
          this.spinner.hide();

          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.router.navigate(['/location/types']);
        },
        (error) => {
          this.spinner.hide();
        }
      );
    } else {
      this.index = -1;
      window.scroll(0, 0);
    }
  }

  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
