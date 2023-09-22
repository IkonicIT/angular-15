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
    parentid: {
      typeid: 0,
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
      this.companyId = value.companyid;
      this.companyName = this.globalCompany.name;
    });
    this.getAllLocTypes();
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
  }

  getLocationType(typeId: string) {
    this.spinner.show();
    this.loader = true;
    this.locationTypesService.getLocationTypeDetails(typeId).subscribe(
      (response) => {
        this.spinner.hide();
        this.loader = false;
        console.log(response);
        this.model = response;
        if (!this.model.parentid) {
          this.model.parentid = {
            typeid: 0,
          };
        } else {
          this.value = this.model.parentid.typeid;
        }
      },
      (error) => {
        this.spinner.hide();
        this.loader = false;
      }
    );
  }

  getAllLocTypes() {
    this.spinner.show();
    this.loader = true;
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
          this.loader = false;
        }
      );
  }

  generateHierarchy(typeList: any) {
    var items: any = [];
    typeList.forEach(
      (type: { typeList: string | any[]; name: any; typeid: any }) => {
        var children = [];
        if (type.typeList && type.typeList.length > 0) {
          children = this.generateHierarchy(type.typeList); //children.push({text : childLoc.name, value: childLoc.locationid})
        }
        items.push(
          new TreeviewItem({
            text: type.name,
            value: type.typeid,
            collapsed: true,
            children: children,
          })
        );
      }
    );
    return items;
  }

  onValueChange(value: any) {
    console.log(value);
  }

  updateLocationType() {
    if (this.model.name && this.value != this.locationTypeId) {
      var request = {
        attributesearchdisplay: 0,
        description: this.model.description,
        entitytypeid: this.model.entitytypeid,
        hostingfee: this.model.hostingfee,
        ishidden: true,
        lastmodifiedby: this.userName,
        moduleType: 'locationtype',
        name: this.model.name,
        parentid: {
          typeid: this.value ? this.value : 0,
        },
        company: {
          companyid: this.companyId,
        },
        typeList: this.model.typeList,
        typeid: this.locationTypeId,
        typemtbs: 0,
        typespareratio: 0,
      };
      this.spinner.show();
      this.loader = true;
      this.locationTypesService.updateLocationType(request).subscribe(
        (response) => {
          this.spinner.hide();
          this.loader = false;
          this.index = 1;
          setTimeout(() => {
            this.index = 0;
          }, 7000);
          window.scroll(0, 0);
          this.router.navigate(['/location/types']);
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
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
