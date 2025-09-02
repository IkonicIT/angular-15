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
  locationTypeId: any;
  index: number;
  companyId: any;
  globalCompany: any;
  companyName: any;
  locationsTypes: any;

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
    private companyManagementService: CompanyManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.locationTypeId = route.snapshot.params['id'];
    this.companyId = route.snapshot.params['cmpId'];
    this.globalCompany = this.companyManagementService.getGlobalCompany();
    this.companyName = this.globalCompany.name;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyId;
      this.companyName = this.globalCompany.name;
    });
    this.getAllLocTypes();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getLocationType(typeId: string) {
    this.spinner.show();

    this.locationTypesService.getLocationTypeDetails(typeId).subscribe(
      (response) => {
        this.spinner.hide();

        console.log(response);
        this.model = response;
        if (!this.model.parentId) {
          this.model.parentId = {
            typeId: 0,
          };
        } else {
          this.value = this.model.parentId.typeId;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllLocTypes() {
    this.spinner.show();

    this.locationTypesService
      .getAllLocationTypesWithHierarchy(this.companyId)
      .subscribe(
        (response) => {
          this.locationsTypes = response;
          var self = this;
          if (this.locationsTypes && this.locationsTypes.length > 0) {
            self.items = this.generateHierarchy(this.locationsTypes);
          }
          this.getLocationType(this.locationTypeId);
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
        children = this.generateHierarchy(type.typeList); //children.push({text : childLoc.name, value: childLoc.locationId})
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

  updateLocationType() {
    if (this.model.name && this.value != this.locationTypeId) {
      var request = {
        attributeSearchDisplay: 0,
        description: this.model.description,
        entityTypeId: this.model.entitytypeId,
        hostingFee: this.model.hostingFee,
        isHidden: true,
        lastModifiedBy: this.userName,
        moduleType: 'locationtype',
        name: this.model.name,
        parentId: {
          typeId: this.value ? this.value : 0,
        },
        company: {
          companyId: this.companyId,
        },
        typeList: this.model.typeList,
        typeId: this.locationTypeId,
        typeMtbs: 0,
        typeSpareRatio: 0,
      };
      this.spinner.show();

      this.locationTypesService.updateLocationType(request).subscribe(
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
      if (this.value == this.locationTypeId) {
        this.index = -2;
      }
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
