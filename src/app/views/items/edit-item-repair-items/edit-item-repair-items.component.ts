import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemTypesService } from '../../../services/Items/item-types.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyManagementService } from '../../../services/company-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemRepairItemsService } from '../../../services/Items/item-repair-items.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item-repair-items',
  templateUrl: './edit-item-repair-items.component.html',
  styleUrls: ['./edit-item-repair-items.component.scss'],
})
export class EditItemRepairItemsComponent implements OnInit {
  itemTypes: any;
  model: any;
  globalCompany: any;
  companyId: any;
  companyName: any;
  itemType: any = '';
  repairItem: any;
  repairItems: any;
  userName: any;
  repairItemFilter: any;
  itemsForPagination: any = 5;
  index: number;
  order: string = '';
  reverse: string = '';
  modalRef: BsModalRef;
  repairid: any;
  route: ActivatedRoute;
  router: Router;
  helpFlag: any = false;
  dismissible = true;
  loader = false;
  constructor(
    private modalService: BsModalService,
    private itemTypesService: ItemTypesService,
    sanitizer: DomSanitizer,
    private companyManagementService: CompanyManagementService,
    private spinner: NgxSpinnerService,
    private itemReairItemsService: ItemRepairItemsService,
    router: Router,
    route: ActivatedRoute
  ) {
    this.globalCompany = this.companyManagementService.getGlobalCompany();

    if (this.globalCompany) {
      this.companyId = this.globalCompany.companyid;
      this.companyName = this.globalCompany.name;
      this.getAllItemTypes();
    }
    this.router = router;
    this.route = route;
    this.companyManagementService.globalCompanyChange.subscribe((value) => {
      this.globalCompany = value;
      this.companyId = value.companyid;
      this.companyName = value.name;
    });
  }

  ngOnInit() {
    this.userName = sessionStorage.getItem('userName');
    this.repairid = this.route.snapshot.params['repairId'];
    this.itemReairItemsService.getItemRepairItem(this.repairid).subscribe(
      (response) => {
        this.spinner.hide();

        this.model = response;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  getAllItemTypes() {
    this.spinner.show();

    this.itemTypesService
      .getAllItemTypes(this.companyId)
      .subscribe((response) => {
        this.spinner.hide();

        this.itemTypes = response;
      });
  }

  getRepairItems() {
    if (this.itemType != '') {
      this.spinner.show();

      this.itemReairItemsService
        .getAllItemRepairItems(this.companyId, this.itemType)
        .subscribe((response) => {
          this.spinner.hide();

          this.repairItems = response;
        });
    }
  }

  UpdateRepairItem() {
    this.spinner.show();

    var request = {
      lastmodifiedby: this.userName,
      companyid: this.companyId,
      repairdescription: this.model.repairdescription,
      repairid: this.repairid,
      typeid: this.model.typeid,
    };
    this.itemReairItemsService
      .updateRepairItemType(request, this.repairid)
      .subscribe((response) => {
        this.spinner.hide();

        this.index = 1;
        setTimeout(() => {
          this.index = 0;
        }, 7000);
          this.router.navigate(['/items/repairItems']);
        this.getRepairItems();
      });
  }

  setOrder(value: string) {
    if (this.order === value) {
      if (this.reverse == '') {
        this.reverse = '-';
      } else {
        this.reverse = '';
      }
    }
    this.order = value;
  }

  confirm(): void {
    this.spinner.show();

    this.itemReairItemsService.removeRepairItem(this.index).subscribe(
      (response) => {
        this.spinner.hide();

        this.modalRef.hide();
        this.getRepairItems();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  cancel() {
    this.router.navigate(['/items/repairItems']);
  }
  print() {
    this.helpFlag = false;
    window.print();
  }
  help() {
    this.helpFlag = !this.helpFlag;
  }
}
